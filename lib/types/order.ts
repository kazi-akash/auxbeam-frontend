// ─────────────────────────────────────────────────────────────────────────────
// Order & checkout types
// ─────────────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'incomplete'
  | 'good_but_no_response'
  | 'advance_payment'
  | 'on_hold'
  | 'ready_to_ship'
  | 'complete'
  | 'return_requested'
  | 'return_approved'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ShippingMethod = 'pathao_courier' | 'auxbeam_team' | 'standard';

export type PaymentMethod =
  | 'ssl_commerz'
  | 'bkash'
  | 'nagad'
  | 'cod'
  | 'cash_on_delivery'
  | 'pos_on_delivery'
  | 'cash_on_service'
  | 'pos_on_service';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  product?: {
    id: number;
    name: string;
    slug: string;
    images: { full_url: string; is_primary: boolean }[];
  };
  product_variation?: {
    id: number;
    sku: string;
    variation_values: { variation_option: { value: string; variation: { name: string } } }[];
  } | null;
}

export interface OrderAddress {
  id: number;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string | null;
  zip_code: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: string;
  shipping_cost: string;
  discount_amount: string;
  total_amount: string;
  shipping_method: ShippingMethod;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  shipping_address?: OrderAddress;
  payments?: unknown[];
  invoice?: unknown;
}

export interface CheckoutItem {
  product_id: number;
  variation_id: number | null;
  quantity: number;
  price: number;
  is_preorder?: boolean;
}

export interface GuestShippingAddress {
  address_line_1: string;
  city: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone: string;
}

export interface ShippingMethodsPayload {
  items: { product_id: number; variation_id: number | null; quantity: number }[];
  address_id?: number;
  subtotal: number;
}

export interface ShippingMethodOption {
  code: ShippingMethod;
  name: string;
  description: string;
  cost: number;
  delivery_time: string;
  free_shipping_min_order: number | null;
  is_free: boolean;
  recommended: boolean;
}

export interface CheckoutPreviewPayload {
  items: CheckoutItem[];
  shipping_address_id?: number;
  shipping_method: ShippingMethod;
  coupon_code?: string;
  is_preorder?: boolean;
  pay_deposit_only?: boolean;
}

export interface CheckoutPreview {
  subtotal: number;
  shipping_cost: number;
  promotion_discount: number;
  coupon_discount: number;
  total: number;
  is_preorder: boolean;
  deposit_amount: number | null;
  remaining_amount: number | null;
  payable_now: number;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;
  coupon_code?: string;
  notes?: string;
  is_preorder?: boolean;
  pay_deposit_only?: boolean;
  // Authenticated user
  shipping_address_id?: number;
  billing_address_id?: number;
  // Guest user
  guest_email?: string;
  guest_name?: string;
  guest_phone?: string;
  shipping_address?: GuestShippingAddress;
  create_account?: boolean;
}

export interface CheckoutResult {
  order: Order;
  payment: {
    gateway_url: string | null;
    session_key: string | null;
    status: string;
  };
  account_created: boolean;
}

export interface OrderFilters {
  per_page?: number;
  page?: number;
}

export interface CancelOrderPayload {
  reason: string;
}

export interface OrderStatusHistory {
  id: number;
  from_status: OrderStatus;
  to_status: OrderStatus;
  note: string | null;
  user_id: number;
  created_at: string;
}
