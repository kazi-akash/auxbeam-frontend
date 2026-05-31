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

export interface Notification {
  id: string;
  type: string;
  data: {
    title: string;
    message: string;
    order_number?: string;
    [key: string]: unknown;
  };
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
