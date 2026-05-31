'use client';

import { Bell, ShoppingBag, Truck, CheckCircle, AlertCircle, Tag } from 'lucide-react';
import type { Notification } from '@/lib/types';

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order_placed',
    data: {
      title: 'Order Confirmed',
      message: 'Your order #AUX-10042 has been placed successfully and is being processed.',
      order_number: 'AUX-10042',
    },
    read_at: null,
    created_at: '2026-05-24T10:15:00.000000Z',
  },
  {
    id: '2',
    type: 'order_shipped',
    data: {
      title: 'Order Shipped',
      message: 'Your order #AUX-10038 has been shipped and is on its way to you.',
      order_number: 'AUX-10038',
    },
    read_at: null,
    created_at: '2026-05-23T14:30:00.000000Z',
  },
  {
    id: '3',
    type: 'order_delivered',
    data: {
      title: 'Order Delivered',
      message: 'Your order #AUX-10031 has been delivered. Enjoy your new lights!',
      order_number: 'AUX-10031',
    },
    read_at: '2026-05-22T09:00:00.000000Z',
    created_at: '2026-05-22T08:45:00.000000Z',
  },
  {
    id: '4',
    type: 'promo',
    data: {
      title: 'Flash Sale — 20% Off Light Bars',
      message: 'Use code FLASH20 at checkout. Valid today only on all 5D Pro Series light bars.',
    },
    read_at: '2026-05-21T12:00:00.000000Z',
    created_at: '2026-05-21T08:00:00.000000Z',
  },
  {
    id: '5',
    type: 'order_cancelled',
    data: {
      title: 'Order Cancelled',
      message: 'Your order #AUX-10028 was cancelled. A refund has been initiated.',
      order_number: 'AUX-10028',
    },
    read_at: '2026-05-20T16:00:00.000000Z',
    created_at: '2026-05-20T15:50:00.000000Z',
  },
];

const TYPE_CONFIG: Record<string, { icon: React.ElementType; iconClass: string; bgClass: string }> = {
  order_placed:    { icon: ShoppingBag,   iconClass: 'text-blue-500',   bgClass: 'bg-blue-50' },
  order_shipped:   { icon: Truck,         iconClass: 'text-indigo-500', bgClass: 'bg-indigo-50' },
  order_delivered: { icon: CheckCircle,   iconClass: 'text-green-500',  bgClass: 'bg-green-50' },
  order_cancelled: { icon: AlertCircle,   iconClass: 'text-red-500',    bgClass: 'bg-red-50' },
  promo:           { icon: Tag,           iconClass: 'text-yellow-500', bgClass: 'bg-yellow-50' },
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationItem({ notification }: { notification: Notification }) {
  const config = TYPE_CONFIG[notification.type] ?? { icon: Bell, iconClass: 'text-gray-400', bgClass: 'bg-gray-50' };
  const Icon = config.icon;
  const isUnread = !notification.read_at;

  return (
    <div className={`flex gap-4 p-4 rounded-xl border transition-colors ${isUnread ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgClass}`}>
        <Icon className={`w-4 h-4 ${config.iconClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
            {notification.data.title}
          </p>
          <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">{timeAgo(notification.created_at)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.data.message}</p>
      </div>
      {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
    </div>
  );
}

export default function NotificationsPage() {
  const unreadCount = DUMMY_NOTIFICATIONS.filter((n) => !n.read_at).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your latest alerts and updates</p>
        </div>
        {unreadCount > 0 && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="space-y-2">
        {DUMMY_NOTIFICATIONS.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
