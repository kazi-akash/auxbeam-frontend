'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2, RefreshCw } from 'lucide-react';
import type { Notification, NotificationType } from '@/lib/types';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useClearNotifications,
} from '@/lib/hooks/customer/useNotifications';
import { getNotificationVisual } from '@/lib/components/notifications/notificationConfig';

// ─── Tab definition ───────────────────────────────────────────────────────────

type Tab = 'all' | 'orders' | 'returns' | 'reviews' | 'promotions' | 'system';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all',        label: 'All' },
  { id: 'orders',     label: 'Orders' },
  { id: 'returns',    label: 'Returns & Refunds' },
  { id: 'reviews',    label: 'Reviews' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'system',     label: 'System' },
];

const TAB_TYPES: Record<Tab, (NotificationType | string)[]> = {
  all: [],
  orders: [
    'order_placed', 'order_confirmed', 'order_processing',
    'order_shipped', 'order_out_for_delivery', 'order_delivered',
    'order_cancelled', 'order_status_updated',
  ],
  returns: [
    'return_requested', 'return_approved', 'return_rejected', 'return_received',
    'refund_initiated', 'refund_completed', 'refund_failed',
  ],
  reviews: ['review_approved', 'review_rejected', 'review_response'],
  promotions: ['promotion_started', 'coupon_issued', 'coupon_expiring', 'promo'],
  system: ['system'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ─── Single notification row ──────────────────────────────────────────────────

function NotificationRow({ notification }: { notification: Notification }) {
  const router = useRouter();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: del } = useDeleteNotification();
  const visual = getNotificationVisual(notification.type);
  const Icon = visual.icon;
  const isUnread = !notification.read_at;

  const handleClick = () => {
    if (isUnread) markRead(notification.id);
    if (notification.data.action_url) router.push(notification.data.action_url);
  };

  return (
    <div
      className={`group flex gap-3 p-4 rounded-xl border transition-colors ${
        isUnread ? 'bg-white border-gray-200' : 'bg-gray-50/60 border-gray-100'
      } ${notification.data.action_url ? 'cursor-pointer hover:border-gray-300' : ''}`}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${visual.bgClass}`}>
        <Icon className={`w-4 h-4 ${visual.iconClass}`} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
            {notification.data.title}
          </p>
          <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">{timeAgo(notification.created_at)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.data.message}</p>

        {/* Contextual chips */}
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {notification.data.order_number && (
            <span className="inline-flex items-center text-[10px] font-medium bg-blue-50 text-blue-600 rounded px-1.5 py-0.5">
              #{notification.data.order_number}
            </span>
          )}
          {notification.data.coupon_code && (
            <span className="inline-flex items-center text-[10px] font-medium bg-emerald-50 text-emerald-600 rounded px-1.5 py-0.5">
              {notification.data.coupon_code}
            </span>
          )}
          {notification.data.product_name && (
            <span className="inline-flex items-center text-[10px] font-medium bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 truncate max-w-[140px]">
              {notification.data.product_name}
            </span>
          )}
          {notification.data.refund_amount != null && (
            <span className="inline-flex items-center text-[10px] font-medium bg-green-50 text-green-700 rounded px-1.5 py-0.5">
              ৳{Number(notification.data.refund_amount).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Unread dot + action buttons */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
        <div className="hidden group-hover:flex flex-col gap-1 mt-auto">
          {isUnread && (
            <button
              onClick={(e) => { e.stopPropagation(); markRead(notification.id); }}
              className="p-1 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              title="Mark as read"
            >
              <Check className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); del(notification.id); }}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useNotifications({ page, per_page: 20 });
  const { data: countData } = useUnreadNotificationCount();
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead();
  const { mutate: clearAll, isPending: clearing } = useClearNotifications();

  const notifications: Notification[] = data?.data ?? data ?? [];
  const unreadCount = countData?.unread_count ?? 0;

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter((n) => TAB_TYPES[activeTab].includes(n.type));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your latest alerts and updates</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
          {unreadCount > 0 && (
            <button
              onClick={() => markAll()}
              disabled={markingAll}
              className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-50 flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {notifications.length > 0 && (
            <button
              onClick={() => clearAll()}
              disabled={clearing}
              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 flex items-center gap-1 px-2 py-1 rounded-lg border border-red-100 hover:border-red-200 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1); }}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-sm text-red-500">Failed to load notifications.</p>
          <button onClick={() => refetch()} className="text-xs text-gray-500 underline mt-1">Try again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">No notifications in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => <NotificationRow key={n.id} notification={n} />)}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && notifications.length === 20 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-xs text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
