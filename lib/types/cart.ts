// ─────────────────────────────────────────────────────────────────────────────
// Cart & coupon types
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItem {
  product_id: number;
  variation_id: number | null;
  quantity: number;
}

export interface CartSummaryItem {
  product_id: number;
  variation_id: number | null;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  discounted_price: number;
  promotion_discount: number;
}

export interface CartSummary {
  items: CartSummaryItem[];
  subtotal: number;
  promotion_discount: number;
  coupon_discount: number;
  coupon_error: string | null;
  total: number;
  errors: string[];
}

export interface CartSummaryPayload {
  items: CartItem[];
  coupon_code?: string;
}

export interface ValidateCouponPayload {
  code: string;
  items: CartItem[];
  subtotal: number;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
}

export interface AvailableCoupon extends Coupon {
  description: string | null;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  applies_to: string;
  expires_at: string | null;
  is_free_shipping: boolean;
}

export interface CheckAvailabilityPayload {
  product_id: number;
  variation_id: number | null;
  quantity: number;
}
