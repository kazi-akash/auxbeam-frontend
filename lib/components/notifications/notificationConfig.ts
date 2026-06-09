import {
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCcw,
  DollarSign,
  Star,
  Package,
  Megaphone,
  Tag,
  BarChart2,
  Zap,
  Ticket,
  Bell,
  type LucideIcon,
} from 'lucide-react';

export interface NotificationVisual {
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
  label: string;
}

export const NOTIFICATION_CONFIG: Record<string, NotificationVisual> = {
  // ─── Orders ─────────────────────────────────────────────────────────────────
  order_placed:            { icon: ShoppingBag,  iconClass: 'text-blue-500',    bgClass: 'bg-blue-50',    label: 'Order Placed' },
  order_confirmed:         { icon: ShoppingBag,  iconClass: 'text-blue-600',    bgClass: 'bg-blue-50',    label: 'Order Confirmed' },
  order_processing:        { icon: ShoppingBag,  iconClass: 'text-indigo-500',  bgClass: 'bg-indigo-50',  label: 'Processing' },
  order_shipped:           { icon: Truck,         iconClass: 'text-indigo-500',  bgClass: 'bg-indigo-50',  label: 'Shipped' },
  order_out_for_delivery:  { icon: Truck,         iconClass: 'text-purple-500',  bgClass: 'bg-purple-50',  label: 'Out for Delivery' },
  order_delivered:         { icon: CheckCircle,   iconClass: 'text-green-500',   bgClass: 'bg-green-50',   label: 'Delivered' },
  order_cancelled:         { icon: XCircle,       iconClass: 'text-red-500',     bgClass: 'bg-red-50',     label: 'Cancelled' },
  order_status_updated:    { icon: ShoppingBag,   iconClass: 'text-gray-500',    bgClass: 'bg-gray-50',    label: 'Status Updated' },

  // ─── Returns & Refunds ───────────────────────────────────────────────────────
  return_requested:        { icon: RefreshCcw,    iconClass: 'text-orange-500',  bgClass: 'bg-orange-50',  label: 'Return Requested' },
  return_approved:         { icon: RefreshCcw,    iconClass: 'text-green-500',   bgClass: 'bg-green-50',   label: 'Return Approved' },
  return_rejected:         { icon: RefreshCcw,    iconClass: 'text-red-500',     bgClass: 'bg-red-50',     label: 'Return Rejected' },
  return_received:         { icon: Package,       iconClass: 'text-blue-500',    bgClass: 'bg-blue-50',    label: 'Return Received' },
  refund_initiated:        { icon: DollarSign,    iconClass: 'text-yellow-600',  bgClass: 'bg-yellow-50',  label: 'Refund Initiated' },
  refund_completed:        { icon: DollarSign,    iconClass: 'text-green-600',   bgClass: 'bg-green-50',   label: 'Refund Completed' },
  refund_failed:           { icon: DollarSign,    iconClass: 'text-red-500',     bgClass: 'bg-red-50',     label: 'Refund Failed' },

  // ─── Reviews ─────────────────────────────────────────────────────────────────
  review_approved:         { icon: Star,          iconClass: 'text-yellow-500',  bgClass: 'bg-yellow-50',  label: 'Review Approved' },
  review_rejected:         { icon: Star,          iconClass: 'text-red-400',     bgClass: 'bg-red-50',     label: 'Review Rejected' },
  review_response:         { icon: Star,          iconClass: 'text-blue-400',    bgClass: 'bg-blue-50',    label: 'Review Response' },

  // ─── Inventory (admin) ────────────────────────────────────────────────────────
  low_stock_alert:         { icon: AlertCircle,   iconClass: 'text-amber-500',   bgClass: 'bg-amber-50',   label: 'Low Stock' },
  out_of_stock_alert:      { icon: AlertCircle,   iconClass: 'text-red-600',     bgClass: 'bg-red-50',     label: 'Out of Stock' },

  // ─── Campaigns (admin) ───────────────────────────────────────────────────────
  campaign_sent:           { icon: Megaphone,     iconClass: 'text-blue-500',    bgClass: 'bg-blue-50',    label: 'Campaign Sent' },
  campaign_failed:         { icon: Megaphone,     iconClass: 'text-red-500',     bgClass: 'bg-red-50',     label: 'Campaign Failed' },

  // ─── Meta Ads (admin) ────────────────────────────────────────────────────────
  meta_pixel_error:        { icon: Zap,           iconClass: 'text-red-500',     bgClass: 'bg-red-50',     label: 'Pixel Error' },
  meta_ad_event:           { icon: Zap,           iconClass: 'text-blue-600',    bgClass: 'bg-blue-50',    label: 'Ad Event' },

  // ─── Promotions & Coupons ────────────────────────────────────────────────────
  promotion_started:       { icon: Tag,           iconClass: 'text-yellow-500',  bgClass: 'bg-yellow-50',  label: 'Promotion' },
  coupon_issued:           { icon: Ticket,        iconClass: 'text-emerald-500', bgClass: 'bg-emerald-50', label: 'Coupon' },
  coupon_expiring:         { icon: Ticket,        iconClass: 'text-orange-500',  bgClass: 'bg-orange-50',  label: 'Coupon Expiring' },

  // ─── Reports (admin) ─────────────────────────────────────────────────────────
  report_ready:            { icon: BarChart2,     iconClass: 'text-purple-500',  bgClass: 'bg-purple-50',  label: 'Report Ready' },

  // ─── Generic ─────────────────────────────────────────────────────────────────
  promo:                   { icon: Tag,           iconClass: 'text-yellow-500',  bgClass: 'bg-yellow-50',  label: 'Promotion' },
  system:                  { icon: Bell,          iconClass: 'text-gray-400',    bgClass: 'bg-gray-50',    label: 'System' },
};

export const DEFAULT_VISUAL: NotificationVisual = {
  icon: Bell,
  iconClass: 'text-gray-400',
  bgClass: 'bg-gray-50',
  label: 'Notification',
};

export function getNotificationVisual(type: string): NotificationVisual {
  return NOTIFICATION_CONFIG[type] ?? DEFAULT_VISUAL;
}

// Notification types that belong to the admin channel (not shown to customers)
export const ADMIN_NOTIFICATION_TYPES = new Set([
  'low_stock_alert',
  'out_of_stock_alert',
  'campaign_sent',
  'campaign_failed',
  'meta_pixel_error',
  'meta_ad_event',
  'report_ready',
]);
