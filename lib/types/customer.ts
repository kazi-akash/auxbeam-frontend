// ─────────────────────────────────────────────────────────────────────────────
// Customer-facing types — addresses, wishlist, reviews, returns, notifications
// ─────────────────────────────────────────────────────────────────────────────

export type AddressType = 'user_address' | 'shipping_address' | 'billing_address';

export interface Address {
  id: number;
  user_id: number;
  address_line_1: string;
  address_line_2: string | null;
  contact_no: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  address_type: AddressType;
  is_default: boolean;
  full_address: string;
}

export interface CreateAddressPayload {
  address_line_1: string;
  address_line_2?: string;
  contact_no: string;
  city: string;
  state?: string;
  zip_code?: string;
  address_type: AddressType;
  is_default?: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

// ─── Wishlist ────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    primary_image_url: string | null;
    stock_status: string;
    images?: { id: number; full_url: string; is_primary: boolean; sort_order: number }[];
    category: { id: number; name: string; slug: string };
    brand: { id: number; name: string; slug: string } | null;
  };
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  product_id?: number;
  user_id?: number;
  rating: number;
  title: string | null;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful_count: number;
  created_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  product?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<string, number>;
}

export interface SubmitReviewPayload {
  product_id: number;
  rating: number;
  title?: string;
  comment: string;
}

// ─── Returns ─────────────────────────────────────────────────────────────────

export interface ReturnItem {
  order_item_id: number;
  quantity: number;
  reason: string;
}

export interface SubmitReturnPayload {
  order_id: number;
  items: ReturnItem[];
  description: string;
  images?: File[];
}

export interface Return {
  id: number;
  order_id: number;
  status: string;
  description: string;
  created_at: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  // Orders
  | 'order_placed'
  | 'order_confirmed'
  | 'order_processing'
  | 'order_shipped'
  | 'order_out_for_delivery'
  | 'order_delivered'
  | 'order_cancelled'
  | 'order_status_updated'
  // Returns & Refunds
  | 'return_requested'
  | 'return_approved'
  | 'return_rejected'
  | 'return_received'
  | 'refund_initiated'
  | 'refund_completed'
  | 'refund_failed'
  // Reviews
  | 'review_approved'
  | 'review_rejected'
  | 'review_response'
  // Inventory (admin)
  | 'low_stock_alert'
  | 'out_of_stock_alert'
  // Campaigns (admin)
  | 'campaign_sent'
  | 'campaign_failed'
  // Meta Ads (admin)
  | 'meta_pixel_error'
  | 'meta_ad_event'
  // Promotions & Coupons (customer)
  | 'promotion_started'
  | 'coupon_issued'
  | 'coupon_expiring'
  // Reports (admin)
  | 'report_ready'
  // Generic
  | 'promo'
  | 'system';

export interface NotificationData {
  title: string;
  message: string;
  // Order context
  order_number?: string;
  order_id?: number;
  order_status?: string;
  // Return / refund context
  return_id?: number;
  refund_id?: number;
  refund_amount?: number;
  refund_method?: string;
  // Product / inventory context
  product_id?: number;
  product_name?: string;
  product_sku?: string;
  stock_quantity?: number;
  threshold?: number;
  // Campaign context
  campaign_id?: number;
  campaign_name?: string;
  recipients_count?: number;
  // Promotion / coupon context
  promotion_id?: number;
  coupon_code?: string;
  discount_value?: number;
  expires_at?: string;
  // Review context
  review_id?: number;
  // Report context
  report_type?: string;
  report_url?: string;
  // Action URL for deep-linking
  action_url?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  type: NotificationType | string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface CustomerDashboardStats {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_spent: number;
  pending_reviews: number;
  active_returns: number;
  wishlist_count: number;
  preorder_balance: number;
}
