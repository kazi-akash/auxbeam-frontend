// ─────────────────────────────────────────────────────────────────────────────
// Admin-specific types
// ─────────────────────────────────────────────────────────────────────────────

import type { PaginationParams, SortParams } from './api';
import type { OrderStatus, PaymentStatus, ShippingMethod } from './order';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface AdminDashboard {
  today: { orders: number; revenue: number };
  this_month: { orders: number; revenue: number };
  pending: { orders: number; reviews: number; returns: number };
  low_stock_count: number;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface AdminUserFilters extends PaginationParams, SortParams {
  search?: string;
  user_type?: 'customer' | 'admin';
  status?: 0 | 1;
  verified?: boolean | string;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  user_type: 'customer' | 'admin';
  status?: boolean;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  parent_id?: number | null;
  description?: string;
  image?: string;
  sort_order?: number;
  is_active?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// ─── Products ─────────────────────────────────────────────────────────────────

export interface AdminProductFilters extends PaginationParams, SortParams {
  search?: string;
  category_id?: number;
  brand_id?: number;
  status?: 'active' | 'inactive' | 'draft';
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
}

export interface ProductImagePayload {
  path?: string;
  file?: File;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface ProductVariationPayload {
  sku: string;
  price: number;
  quantity: number;
  is_default?: boolean;
  variation_values: number[];
}

export interface CreateProductPayload {
  name: string;
  category_id: number;
  brand_id?: number | null;
  model_id?: number | null;
  shipping_class_id?: number | null;
  sku?: string;
  short_description?: string;
  description?: string;
  price: number;
  compare_price?: number | null;
  cost_price?: number | null;
  quantity?: number;
  low_stock_threshold?: number;
  weight?: number | null;
  weight_unit?: 'g' | 'kg' | 'lb' | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  shipping_type?: 'default' | 'free' | 'fixed' | 'per_item';
  shipping_cost?: number | null;
  requires_shipping?: boolean;
  separate_shipping?: boolean;
  shipping_notes?: string | null;
  is_featured?: boolean;
  is_trending?: boolean;
  status?: 'active' | 'inactive' | 'draft';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_preorder?: boolean;
  preorder_release_date?: string | null;
  preorder_limit?: number | null;
  preorder_deposit_amount?: number | null;
  preorder_deposit_type?: 'percentage' | 'fixed' | null;
  images?: ProductImagePayload[];
  variations?: ProductVariationPayload[];
}

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  deleted_variation_ids?: number[];
};

export interface UpdateVariationPayload {
  sku?: string;
  price?: number;
  quantity?: number;
  is_default?: boolean;
  shipping_type?: string;
  shipping_cost?: number | null;
  reason?: string;
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export interface CreateBrandPayload {
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  website?: string;
  is_active?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
}

export type UpdateBrandPayload = Partial<CreateBrandPayload>;

// ─── Variations ───────────────────────────────────────────────────────────────

export interface CreateVariationTypePayload {
  name: string;
  slug?: string;
}

export interface CreateVariationOptionPayload {
  value: string;
  slug?: string;
  sort_order?: number;
}

export interface BulkCreateVariationOptionsPayload {
  options: CreateVariationOptionPayload[];
}

// ─── Services ─────────────────────────────────────────────────────────────────

export type ServiceType = 'home_service' | 'office_booking' | 'home_delivery' | 'outlet_pickup';

export interface AdminService {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: ServiceType;
  requires_scheduling: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateServicePayload {
  name: string;
  slug?: string;
  description?: string;
  type: ServiceType;
  requires_scheduling?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

export interface ProductServicePivot {
  service_id: number;
  price: number;
  is_required: boolean;
  is_active: boolean;
  conditions: string | null;
}

export interface ProductServiceItem extends AdminService {
  price: number;
  is_required: boolean;
  conditions: string | null;
}

export interface AttachServicePayload {
  service_id: number;
  price: number;
  is_required?: boolean;
  is_active?: boolean;
  conditions?: string;
}

export interface SyncServicesPayload {
  services: AttachServicePayload[];
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderSource = 'website' | 'facebook' | 'instagram' | 'whatsapp' | 'phone_call' | 'manual';
export type NoteType = 'internal' | 'customer' | 'system';

export interface AdminOrderFilters extends PaginationParams, SortParams {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  order_type?: 'online' | 'in_store';
  shipping_method?: ShippingMethod;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface AdminOrderUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name?: string;
}

export interface AdminOrderAddress {
  id: number;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state?: string | null;
  zip_code?: string | null;
  phone?: string | null;
}

export interface AdminOrderItemProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;
  images?: { full_url: string; is_primary: boolean }[];
}

export interface AdminOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variation_id?: number | null;
  product_name: string;
  variation_details?: Record<string, string> | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  product?: AdminOrderItemProduct;
  product_variation?: {
    id: number;
    sku: string;
    variation_values?: { variation_option: { value: string; variation: { name: string } } }[];
  } | null;
}

export interface AdminOrderNote {
  id: number;
  order_id: number;
  user_id?: number | null;
  note: string;
  note_type: NoteType;
  is_customer_notified: boolean;
  created_at: string;
  updated_at: string;
  user?: AdminOrderUser | null;
}

export interface AdminOrderReminder {
  id: number;
  order_id: number;
  created_by: number;
  assigned_to?: number | null;
  title: string;
  description?: string | null;
  remind_at: string;
  is_completed: boolean;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  creator?: AdminOrderUser | null;
  assignee?: AdminOrderUser | null;
}

export interface AdminOrderStatusHistory {
  id: number;
  order_id: number;
  user_id?: number | null;
  from_status?: OrderStatus | null;
  to_status: OrderStatus;
  note?: string | null;
  created_at: string;
  user?: AdminOrderUser | null;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  order_type: 'online' | 'in_store';
  order_source: OrderSource;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_method?: ShippingMethod | null;
  tracking_number?: string | null;
  subtotal: string;
  shipping_cost: string;
  discount_amount: string;
  tax_amount?: string;
  total_amount: string;
  notes?: string | null;
  follow_up_at?: string | null;
  follow_up_completed: boolean;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  created_at: string;
  updated_at: string;
  user?: AdminOrderUser | null;
  items?: AdminOrderItem[];
  shipping_address?: AdminOrderAddress | null;
  billing_address?: AdminOrderAddress | null;
  coupon?: { id: number; code: string } | null;
  payments?: unknown[];
  invoice?: unknown;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface AssignTrackingPayload {
  tracking_number: string;
}

export interface UpdateOrderNotesPayload {
  notes: string;
}

export interface OrderNotePayload {
  note: string;
  note_type: NoteType;
  is_customer_notified?: boolean;
}

export interface OrderReminderPayload {
  title: string;
  description?: string;
  remind_at: string;
  assigned_to?: number;
}

export interface SetFollowUpPayload {
  follow_up_at: string;
}

export interface CancelOrderPayload {
  reason: string;
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export interface CreatePromotionPayload {
  name: string;
  description?: string;
  promotion_type: 'percentage' | 'fixed_amount' | 'flash_sale' | 'combo_offer' | 'free_delivery';
  discount_value: number;
  applies_to: 'all_products' | 'specific_products' | 'specific_brands' | 'specific_categories';
  apply_level?: 'product' | 'cart';
  min_purchase_amount?: number;
  max_discount_amount?: number;
  starts_at: string;
  ends_at: string;
  priority?: number;
  is_active?: boolean;
  product_ids?: number[];
  brand_ids?: number[];
  category_ids?: number[];
}

export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;

// ─── Coupons ──────────────────────────────────────────────────────────────────

export interface CreateCouponPayload {
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_shipping';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  applies_to?: 'all_products' | 'specific_products' | 'specific_brands' | 'specific_categories';
  product_ids?: number[];
  brand_ids?: number[];
  category_ids?: number[];
  starts_at?: string;
  expires_at?: string;
  is_active?: boolean;
  once_per_customer?: boolean;
}

export type UpdateCouponPayload = Partial<CreateCouponPayload>;

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface AdjustInventoryPayload {
  quantity: number;
  reason: string;
  notes?: string | null;
  variation_id?: number | null;
}

export interface BulkAdjustInventoryPayload {
  adjustments: {
    product_id: number;
    quantity: number;
    reason: string;
    variation_id?: number | null;
  }[];
  reason: string;
  notes?: string | null;
}

// ─── Returns & Refunds ────────────────────────────────────────────────────────

export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'received' | 'processed';
export type ReturnReason = 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'other';
export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type RefundType = 'full' | 'partial';
export type RefundMethod = 'original_payment' | 'store_credit' | 'bank_transfer';

export interface AdminReturn {
  id: number;
  order_id: number;
  order_item_id: number;
  user_id: number;
  quantity: number;
  reason: ReturnReason;
  reason_details: string | null;
  status: ReturnStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  order_item?: {
    id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    product?: { id: number; name: string; sku: string | null };
    product_variation?: { id: number; sku: string } | null;
    order?: { id: number; order_number: string };
  };
  user?: { id: number; full_name: string; email: string };
  refund?: AdminRefund | null;
}

export interface AdminRefund {
  id: number;
  order_id: number;
  return_id: number | null;
  user_id: number;
  amount: number;
  refund_type: RefundType;
  refund_method: RefundMethod;
  status: RefundStatus;
  transaction_id: string | null;
  notes: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  order?: { id: number; order_number: string; total_amount: number };
  user?: { id: number; full_name: string; email: string };
  return_request?: AdminReturn | null;
}

export interface AdminReturnFilters extends PaginationParams, SortParams {
  status?: ReturnStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface AdminRefundFilters extends PaginationParams, SortParams {
  status?: RefundStatus;
  refund_method?: RefundMethod;
  search?: string;
}

export interface RejectReturnPayload {
  rejection_reason: string;
}

export interface ApproveReturnPayload {
  admin_notes?: string;
}

export interface CreateRefundPayload {
  order_id: number;
  return_id?: number | null;
  amount: number;
  refund_type: RefundType;
  refund_method: RefundMethod;
  reason?: string;
}

export interface CancelRefundPayload {
  reason: string;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface AdminReviewFilters extends PaginationParams {
  status?: 'pending' | 'approved' | 'rejected';
  product_id?: number;
  user_id?: number;
  rating?: number;
}

export interface RespondToReviewPayload {
  response: string;
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
export type CampaignType = 'promotional' | 'abandoned_cart' | 'order_update' | 'newsletter';
export type CampaignTargetType = 'all_customers' | 'specific_customers' | 'customer_group';
export type CampaignRecipientStatus = 'pending' | 'sent' | 'opened' | 'clicked';

export interface AdminCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  campaign_type: CampaignType;
  target_type: CampaignTargetType;
  target_criteria: Record<string, unknown> | null;
  scheduled_at: string | null;
  sent_at: string | null;
  status: CampaignStatus;
  total_recipients: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  open_rate?: number;
  click_rate?: number;
  recipients_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCampaignRecipient {
  id: number;
  campaign_id: number;
  user_id: number | null;
  email: string;
  status: CampaignRecipientStatus;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
  user?: { id: number; first_name: string; last_name: string; email: string } | null;
}

export interface AdminCampaignStatistics {
  total_recipients: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  open_rate: number;
  click_rate: number;
  pending_count?: number;
}

export interface AdminCampaignFilters {
  search?: string;
  status?: CampaignStatus;
  campaign_type?: CampaignType;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CreateCampaignPayload {
  name: string;
  subject: string;
  content: string;
  campaign_type: CampaignType;
  target_type: CampaignTargetType;
  target_criteria?: Record<string, unknown> | null;
  scheduled_at?: string | null;
}

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

export interface PreviewRecipientsPayload {
  target_type: CampaignTargetType;
  target_criteria?: Record<string, unknown> | null;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  group_by?: 'day' | 'week' | 'month' | 'year';
  limit?: number;
}

// ─── Flash Deals ──────────────────────────────────────────────────────────────

export interface CreateFlashDealPayload {
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  is_active?: boolean;
  priority?: number;
  product_ids?: number[];
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export interface AdminShippingClass {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminShippingRate {
  id: number;
  name: string;
  method: string;
  shipping_class_id: number | null;
  shipping_class?: AdminShippingClass | null;
  country: string | null;
  delivery_time: string | null;
  free_shipping_min_order: string | null;
  base_cost: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateShippingRatePayload {
  name: string;
  shipping_class_id?: number | null;
  method: string;
  country?: string;
  delivery_time?: string;
  free_shipping_min_order?: number | null;
  base_cost: number;
  is_active?: boolean;
}

// ─── RBAC ─────────────────────────────────────────────────────────────────────

export interface CreateRolePayload {
  name: string;
  display_name: string;
  description?: string;
  permissions?: number[];
}

export interface AssignUsersToRolePayload {
  user_ids: number[];
}

// ─── POS ──────────────────────────────────────────────────────────────────────

export interface PosCalculatePayload {
  items: { product_id: number; variation_id: number | null; quantity: number }[];
  coupon_code?: string;
  discount_amount?: number;
}

export interface CreatePosOrderPayload {
  customer_name: string;
  customer_phone?: string;
  items: { product_id: number; variation_id: number | null; quantity: number; price: number }[];
  payment_method: string;
  coupon_code?: string;
  discount_amount?: number;
  notes?: string;
}

// ─── Content ──────────────────────────────────────────────────────────────────

export interface CreatePolicyPayload {
  type: string;
  title: string;
  content: string;
  is_active?: boolean;
}

export interface CreateBannerPayload {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: string;
  is_active?: boolean;
  sort_order?: number;
  starts_at?: string;
  ends_at?: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsDateFilters {
  date_from?: string;
  date_to?: string;
}

export interface AnalyticsDashboard {
  visitors: {
    total_visitors: number;
    unique_visitors: number;
    authenticated_visitors: number;
    guest_visitors: number;
    avg_session_duration: number;
    by_device: Record<string, number>;
  };
  page_views: {
    total_page_views: number;
    unique_page_views: number;
    avg_time_on_page: number;
    by_page_type: Record<string, number>;
  };
  products: {
    total_product_views: number;
    unique_products_viewed: number;
    avg_time_per_product: number;
    view_to_cart_rate: number;
    view_to_purchase_rate: number;
    top_viewed_products: ProductViewStat[];
  };
  checkout_funnel: {
    total_checkouts: number;
    completed_checkouts: number;
    abandoned_checkouts: number;
    conversion_rate: number;
    abandonment_rate: number;
    avg_cart_value: number;
    total_abandoned_value: number;
    by_status: Record<string, number>;
  };
  cart_events: {
    total_events: number;
    items_added: number;
    items_removed: number;
    by_event_type: Record<string, number>;
    most_added_products: CartEventProductStat[];
  };
  search: {
    total_searches: number;
    unique_queries: number;
    avg_results: number;
    no_results_count: number;
    click_through_rate: number;
    top_searches: { query: string; count: number }[];
  };
}

export interface ProductViewStat {
  product_id: number;
  total_views: number;
  product?: { id: number; name: string; slug: string; price: string };
}

export interface CartEventProductStat {
  product_id: number;
  total_quantity: number;
  product?: { id: number; name: string; slug: string; price: string };
}

export interface VisitorSession {
  id: number;
  session_id: string;
  user_id: number | null;
  ip_address: string;
  device_type: string;
  browser: string;
  platform: string;
  page_views: number;
  duration_seconds: number;
  first_visit_at: string;
  last_activity_at: string;
  user?: { id: number; first_name: string; last_name: string; email: string } | null;
}

export interface VisitorSessionFilters extends AnalyticsDateFilters {
  device_type?: string;
  authenticated?: 'true' | 'false';
  per_page?: number;
  page?: number;
}

export interface PageViewStat {
  page_type: string;
  page_url: string;
  view_count: number;
  avg_time_spent: number;
  unique_visitors: number;
}

export interface PageViewFilters extends AnalyticsDateFilters {
  page_type?: string;
  per_page?: number;
  page?: number;
}

export interface CartEvent {
  id: number;
  session_id: string;
  user_id: number | null;
  product_id: number;
  product_variation_id: number | null;
  event_type: 'added' | 'removed' | 'updated' | 'cleared';
  quantity: number;
  price: string;
  event_at: string;
  product?: { id: number; name: string; slug: string; price: string };
  user?: { id: number; first_name: string; last_name: string; email: string } | null;
}

export interface CartEventFilters extends AnalyticsDateFilters {
  event_type?: string;
  per_page?: number;
  page?: number;
}

export interface CheckoutFunnel {
  id: number;
  session_id: string;
  user_id: number | null;
  order_id: number | null;
  status: 'initiated' | 'address_added' | 'shipping_selected' | 'payment_initiated' | 'order_completed' | 'abandoned';
  items_count: number;
  cart_total: string;
  completed_at: string | null;
  abandoned_at: string | null;
  created_at: string;
  user?: { id: number; first_name: string; last_name: string; email: string } | null;
  order?: { id: number; order_number: string } | null;
}

export interface CheckoutFunnelFilters extends AnalyticsDateFilters {
  status?: string;
  min_value?: number;
  per_page?: number;
  page?: number;
}

// ─── Customer Segments ────────────────────────────────────────────────────────

export interface CustomerSegment {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  criteria: Record<string, unknown> | null;
  is_active: boolean;
  priority: number;
  customers_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerSegmentPayload {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  criteria?: Record<string, unknown>;
  is_active?: boolean;
  priority?: number;
}

export type UpdateCustomerSegmentPayload = Partial<CreateCustomerSegmentPayload>;

export interface AssignCustomersToSegmentPayload {
  customer_ids: number[];
  notes?: string;
}

export interface RemoveCustomersFromSegmentPayload {
  customer_ids: number[];
}

// ─── Customer Tags ────────────────────────────────────────────────────────────

export interface CustomerTag {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  is_active: boolean;
  customers_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerTagPayload {
  name: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

export type UpdateCustomerTagPayload = Partial<CreateCustomerTagPayload>;

export interface AssignTagToCustomersPayload {
  customer_ids: number[];
}

// ─── Customer Analytics ───────────────────────────────────────────────────────

export interface CustomerAnalyticsSummary {
  total_customers: number;
  vip_customers: number;
  high_risk_customers: number;
  repeat_customers: number;
  new_customers: number;
}

export interface CustomerWithAnalytics {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  analytics?: {
    total_spent: number;
    lifetime_value: number;
    completed_orders: number;
    cod_orders: number;
    is_vip: boolean;
    risk_level: 'low' | 'medium' | 'high';
  } | null;
}

export interface CustomerAnalyticsDashboard {
  summary: CustomerAnalyticsSummary;
  top_spenders: CustomerWithAnalytics[];
  recent_vips: CustomerWithAnalytics[];
}

export interface CustomerGrowthReport {
  monthly_growth: { month: string; count: number }[];
  retention_rate: number;
  total_customers: number;
  repeat_customers: number;
}

export interface CustomerLtvDistribution {
  '0-5000': number;
  '5001-10000': number;
  '10001-20000': number;
  '20001-50000': number;
  '50001+': number;
}

export interface CustomerSpendingSummary {
  total_spent: number;
  lifetime_value: number;
  completed_orders: number;
  average_order_value: number;
  first_order_date: string | null;
  last_order_date: string | null;
  is_vip: boolean;
  risk_level: 'low' | 'medium' | 'high';
  cod_orders: number;
  cancelled_orders: number;
}

// ─── Meta Pixel & Marketing ───────────────────────────────────────────────────

export type MetaPixelEventName = 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
export type MetaPixelEventSource = 'browser' | 'server';

export interface MetaPixelConfiguration {
  id: number;
  pixel_id: string;
  /** access_token is hidden server-side; only a boolean presence indicator is returned */
  has_access_token?: boolean;
  is_active: boolean;
  enable_pixel: boolean;
  enable_conversion_api: boolean;
  events_to_track: MetaPixelEventName[] | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface SaveMetaPixelConfigPayload {
  pixel_id: string;
  access_token?: string;
  is_active?: boolean;
  enable_pixel?: boolean;
  enable_conversion_api?: boolean;
  events_to_track?: MetaPixelEventName[];
  settings?: Record<string, unknown>;
}

export interface MetaPixelEvent {
  id: number;
  user_id: number | null;
  order_id: number | null;
  event_name: MetaPixelEventName;
  event_id: string;
  event_data: Record<string, unknown>;
  source: MetaPixelEventSource;
  sent_to_facebook: boolean;
  facebook_response: string | null;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
  user?: { id: number; first_name: string; last_name: string; email: string } | null;
  order?: { id: number; order_number: string } | null;
}

export interface MetaPixelEventFilters {
  event_name?: MetaPixelEventName;
  source?: MetaPixelEventSource;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface MetaPixelFunnel {
  ViewContent: number;
  AddToCart: number;
  InitiateCheckout: number;
  Purchase: number;
  view_to_cart_rate: number;
  cart_to_checkout_rate: number;
  checkout_to_purchase_rate: number;
  overall_conversion_rate: number;
}

export interface MetaPixelUtmRow {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface MetaPixelStatistics {
  event_counts: Partial<Record<MetaPixelEventName, number>>;
  source_counts: { browser?: number; server?: number };
  daily_trend: Record<string, Partial<Record<MetaPixelEventName, number>>>;
  funnel: MetaPixelFunnel;
  utm_performance: MetaPixelUtmRow[];
  total_events: number;
  date_from: string;
  date_to: string;
}
