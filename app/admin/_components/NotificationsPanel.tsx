'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Trash2, ExternalLink, X } from 'lucide-react';
import type { Notification } from '@/lib/types';
import {
  useAdminNotifications,
  useAdminUnreadNotificationCount,
  useAdminMarkNotificationRead,
  useAdminMarkAllNotificationsRead,
  useAdminDeleteNotification,
} from '@/lib/hooks/admin/useAdminNotifications';
import { getNotificationVisual } from '@/lib/components/notifications/notificationConfig';

// ─── Deep-link resolver ───────────────────────────────────────────────────────

function resolveActionUrl(n: Notification): string | undefined {
  if (n.data.action_url) return n.data.action_url;
  const type = n.type;
  if (['order_placed','order_confirmed','order_processing','order_shipped','order_out_for_delivery','order_delivered','order_cancelled','order_status_updated'].includes(type) && n.data.order_id) {
    return `/admin/orders/${n.data.order_id}`;
  }
  if (['return_requested','return_approved','return_rejected','return_received'].includes(type) && n.data.return_id) {
    return `/admin/returns/${n.data.return_id}`;
  }
  if (['refund_initiated','refund_completed','refund_failed'].includes(type) && n.data.refund_id) {
    return `/admin/refunds/${n.data.refund_id}`;
  }
  if (['low_stock_alert','out_of_stock_alert'].includes(type) && n.data.product_id) {
    return `/admin/inventory?product=${n.data.product_id}`;
  }
  if (['campaign_sent','campaign_failed'].includes(type) && n.data.campaign_id) {
    return `/admin/campaigns/${n.data.campaign_id}`;
  }
  if (['review_approved','review_rejected','review_response'].includes(type) && n.data.review_id) {
    return `/admin/reviews/${n.data.review_id}`;
  }
  if (['promotion_started'].includes(type) && n.data.promotion_id) {
    return `/admin/promotions/${n.data.promotion_id}`;
  }
  if (['meta_pixel_error','meta_ad_event'].includes(type)) {
    return '/admin/marketing';
  }
  if (type === 'report_ready') return '/admin/analytics';
  return undefined;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Single row ───────────────────────────────────────────────────────────────

function NotifRow({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const router = useRouter();
  const { mutate: markRead } = useAdminMarkNotificationRead();
  const { mutate: del } = useAdminDeleteNotification();
  const visual = getNotificationVisual(notification.type);
  const Icon = visual.icon;
  const isUnread = !notification.read_at;
  const actionUrl = resolveActionUrl(notification);

  const handleClick = () => {
    if (isUnread) markRead(notification.id);
    if (actionUrl) { router.push(actionUrl); onClose(); }
  };

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 transition-colors ${
        isUnread ? 'bg-amber-50/40' : ''
      } ${actionUrl ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={handleClick}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${visual.bgClass}`}>
        <Icon className={`w-3.5 h-3.5 ${visual.iconClass}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-snug ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
          {notification.data.title}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
          {notification.data.message}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {notification.data.order_number && (
            <span className="text-[10px] font-medium bg-blue-50 text-blue-600 rounded px-1.5 py-0.5">
              #{notification.data.order_number}
            </span>
          )}
          {notification.data.product_name && (
            <span className="text-[10px] font-medium bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 truncate max-w-[120px]">
              {notification.data.product_name}
            </span>
          )}
          {notification.data.campaign_name && (
            <span className="text-[10px] font-medium bg-purple-50 text-purple-600 rounded px-1.5 py-0.5 truncate max-w-[120px]">
              {notification.data.campaign_name}
            </span>
          )}
          {notification.data.coupon_code && (
            <span className="text-[10px] font-medium bg-emerald-50 text-emerald-600 rounded px-1.5 py-0.5">
              {notification.data.coupon_code}
            </span>
          )}
        </div>
        <p className="text-[10px] text-gray-300 mt-1">{timeAgo(notification.created_at)}</p>
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="hidden group-hover:flex flex-col gap-1 flex-shrink-0">
        {isUnread && (
          <button
            onClick={(e) => { e.stopPropagation(); markRead(notification.id); }}
            className="p-1 rounded text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            title="Mark as read"
          >
            <Check className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); del(notification.id); }}
          className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
        {actionUrl && (
          <button
            onClick={(e) => { e.stopPropagation(); router.push(actionUrl); onClose(); }}
            className="p-1 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Open"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {isUnread && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />}
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: countData } = useAdminUnreadNotificationCount();
  const { data, isLoading } = useAdminNotifications({ per_page: 15 });
  const { mutate: markAll, isPending: markingAll } = useAdminMarkAllNotificationsRead();

  const unreadCount = countData?.unread_count ?? 0;
  const notifications: Notification[] = data?.data ?? [];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center bg-amber-400 text-white text-[9px] font-bold rounded-full leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAll()}
                  disabled={markingAll}
                  className="text-[11px] text-gray-500 hover:text-gray-800 disabled:opacity-50 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Check className="w-3 h-3" /> All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {isLoading ? (
              <div className="space-y-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded animate-pulse w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotifRow key={n.id} notification={n} onClose={() => setOpen(false)} />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5">
              <button
                onClick={() => { router.push('/admin/notifications'); setOpen(false); }}
                className="text-xs text-gray-500 hover:text-gray-800 w-full text-center transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
