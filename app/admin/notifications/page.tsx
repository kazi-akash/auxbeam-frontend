'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  Bell,
} from 'lucide-react';
import {
  useAdminNotifications,
  useAdminUnreadNotificationCount,
  useAdminMarkNotificationRead,
  useAdminMarkAllNotificationsRead,
  useAdminDeleteNotification,
  useAdminClearNotifications,
} from '@/lib/hooks/admin/useAdminNotifications';
import {
  getNotificationVisual,
  NOTIFICATION_CONFIG,
} from '@/lib/components/notifications/notificationConfig';
import type { Notification } from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 15;

type TabId = 'all' | 'orders' | 'inventory' | 'returns_refunds' | 'campaigns' | 'marketing' | 'reviews' | 'promotions' | 'reports' | 'unread';

const TABS: { id: TabId; label: string }[] = [
  { id: 'all',             label: 'All'              },
  { id: 'unread',          label: 'Unread'           },
  { id: 'orders',          label: 'Orders'           },
  { id: 'inventory',       label: 'Inventory'        },
  { id: 'returns_refunds', label: 'Returns & Refunds'},
  { id: 'campaigns',       label: 'Campaigns'        },
  { id: 'marketing',       label: 'Meta Ads'         },
  { id: 'reviews',         label: 'Reviews'          },
  { id: 'promotions',      label: 'Promotions'       },
  { id: 'reports',         label: 'Reports'          },
];

const TAB_TYPES: Record<TabId, string[]> = {
  all:             [],
  unread:          [],
  orders:          ['order_placed','order_confirmed','order_processing','order_shipped','order_out_for_delivery','order_delivered','order_cancelled','order_status_updated'],
  inventory:       ['low_stock_alert','out_of_stock_alert'],
  returns_refunds: ['return_requested','return_approved','return_rejected','return_received','refund_initiated','refund_completed','refund_failed'],
  campaigns:       ['campaign_sent','campaign_failed'],
  marketing:       ['meta_pixel_error','meta_ad_event'],
  reviews:         ['review_approved','review_rejected','review_response'],
  promotions:      ['promotion_started','coupon_issued','coupon_expiring','promo'],
  reports:         ['report_ready'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function resolveActionUrl(n: Notification): string | undefined {
  if (n.data.action_url) return n.data.action_url;
  const t = n.type;
  if (['order_placed','order_confirmed','order_processing','order_shipped','order_out_for_delivery','order_delivered','order_cancelled','order_status_updated'].includes(t) && n.data.order_id)
    return `/admin/orders/${n.data.order_id}`;
  if (['return_requested','return_approved','return_rejected','return_received'].includes(t) && n.data.return_id)
    return `/admin/returns/${n.data.return_id}`;
  if (['refund_initiated','refund_completed','refund_failed'].includes(t) && n.data.refund_id)
    return `/admin/refunds/${n.data.refund_id}`;
  if (['low_stock_alert','out_of_stock_alert'].includes(t))
    return n.data.product_id ? `/admin/inventory?product=${n.data.product_id}` : '/admin/inventory';
  if (['campaign_sent','campaign_failed'].includes(t) && n.data.campaign_id)
    return `/admin/campaigns/${n.data.campaign_id}`;
  if (['review_approved','review_rejected','review_response'].includes(t) && n.data.review_id)
    return `/admin/reviews/${n.data.review_id}`;
  if (t === 'promotion_started' && n.data.promotion_id)
    return `/admin/promotions/${n.data.promotion_id}`;
  if (['meta_pixel_error','meta_ad_event'].includes(t))
    return '/admin/marketing';
  if (t === 'report_ready')
    return '/admin/analytics';
  return undefined;
}

// ─── Type filter chip ─────────────────────────────────────────────────────────

const ALL_TYPE_OPTIONS = Object.entries(NOTIFICATION_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ unreadCount }: { unreadCount: number }) {
  const cards = [
    { label: 'Unread',    value: unreadCount, cls: 'text-amber-600'  },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-1">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <Bell className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-xs text-gray-400 font-medium">{c.label}</p>
            <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Row component ────────────────────────────────────────────────────────────

function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const visual = getNotificationVisual(notification.type);
  const Icon = visual.icon;
  const isUnread = !notification.read_at;
  const actionUrl = resolveActionUrl(notification);

  const handleClick = () => {
    if (isUnread) onMarkRead(notification.id);
    if (actionUrl) router.push(actionUrl);
  };

  return (
    <tr
      className={`border-b border-gray-50 last:border-0 transition-colors group ${
        isUnread ? 'bg-amber-50/20' : 'hover:bg-gray-50/50'
      } ${actionUrl ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {/* Icon */}
      <td className="px-5 py-4 w-12">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${visual.bgClass}`}>
          <Icon className={`w-3.5 h-3.5 ${visual.iconClass}`} />
        </div>
      </td>

      {/* Type badge */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${visual.bgClass} ${visual.iconClass} border-current border-opacity-20`}>
          {visual.label}
        </span>
      </td>

      {/* Title + message */}
      <td className="px-4 py-4 max-w-xs">
        <p className={`text-xs leading-snug truncate ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
          {notification.data.title}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 leading-relaxed">
          {notification.data.message}
        </p>
      </td>

      {/* Context chips */}
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {notification.data.order_number && (
            <span className="text-[10px] font-medium bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 whitespace-nowrap">
              #{notification.data.order_number}
            </span>
          )}
          {notification.data.product_name && (
            <span className="text-[10px] font-medium bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 truncate max-w-[100px]">
              {notification.data.product_name}
            </span>
          )}
          {notification.data.stock_quantity != null && (
            <span className="text-[10px] font-medium bg-amber-50 text-amber-700 rounded px-1.5 py-0.5 whitespace-nowrap">
              Qty: {notification.data.stock_quantity}
            </span>
          )}
          {notification.data.campaign_name && (
            <span className="text-[10px] font-medium bg-purple-50 text-purple-600 rounded px-1.5 py-0.5 truncate max-w-[100px]">
              {notification.data.campaign_name}
            </span>
          )}
          {notification.data.coupon_code && (
            <span className="text-[10px] font-medium bg-emerald-50 text-emerald-600 rounded px-1.5 py-0.5 whitespace-nowrap">
              {notification.data.coupon_code}
            </span>
          )}
          {notification.data.refund_amount != null && (
            <span className="text-[10px] font-medium bg-green-50 text-green-700 rounded px-1.5 py-0.5 whitespace-nowrap">
              ৳{Number(notification.data.refund_amount).toLocaleString()}
            </span>
          )}
        </div>
      </td>

      {/* Read status */}
      <td className="px-4 py-4 whitespace-nowrap">
        {isUnread ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> Unread
          </span>
        ) : (
          <span className="text-[10px] text-gray-400 font-medium">Read</span>
        )}
      </td>

      {/* Time */}
      <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
        {timeAgo(notification.created_at)}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUnread && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
              title="Mark as read"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          {actionUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); router.push(actionUrl); }}
              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
              title="Go to"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setTypeFilter('');
    setPage(1);
  }, []);

  const { data, isLoading, isFetching, refetch } = useAdminNotifications({ page, per_page: PER_PAGE });
  const { data: countData } = useAdminUnreadNotificationCount();
  const { mutate: markRead } = useAdminMarkNotificationRead();
  const { mutate: markAll, isPending: markingAll } = useAdminMarkAllNotificationsRead();
  const { mutate: del } = useAdminDeleteNotification();
  const { mutate: clearAll, isPending: clearing } = useAdminClearNotifications();

  const unreadCount = countData?.unread_count ?? 0;

  // Normalise paginator shape
  const allNotifications: Notification[] = Array.isArray(data?.data)
    ? (data.data as unknown as Notification[])
    : ((data as any)?.data?.data ?? []);
  const total: number    = (data as any)?.total ?? (data as any)?.data?.total ?? allNotifications.length;
  const lastPage: number = (data as any)?.last_page ?? (data as any)?.data?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  // Client-side tab + type filter (server already returns latest page)
  const filtered = allNotifications.filter((n) => {
    if (activeTab === 'unread' && n.read_at) return false;
    if (activeTab !== 'all' && activeTab !== 'unread' && !TAB_TYPES[activeTab].includes(n.type)) return false;
    if (typeFilter && n.type !== typeFilter) return false;
    return true;
  });

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <StatsBar unreadCount={unreadCount} />

      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`shrink-0 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.id === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-amber-400 text-black text-[9px] font-bold rounded-full px-1.5 py-0.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            <option value="">All types</option>
            {ALL_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => markAll()}
              disabled={markingAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300 hover:text-gray-900 disabled:opacity-50 transition"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          {allNotifications.length > 0 && (
            <button
              onClick={() => clearAll()}
              disabled={clearing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-red-100 rounded-lg text-red-500 hover:border-red-200 hover:text-red-700 disabled:opacity-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="w-12 px-5 py-3.5" />
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Type</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Title / Message</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Context</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Received</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No notifications found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onMarkRead={(id) => markRead(id)}
                    onDelete={(id) => del(id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && total > PER_PAGE && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400">
              Showing {from}–{to} of{' '}
              <span className="font-medium text-gray-600">{total.toLocaleString()} notifications</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${
                    n === page
                      ? 'bg-amber-400 text-black border border-amber-400'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
