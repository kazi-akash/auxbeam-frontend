'use client';

import Link from 'next/link';
import { use } from 'react';
import {
  ArrowLeft,
  X,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  Truck,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useOrderDetails } from '@/lib/hooks/public/useOrders';
import type { Order, OrderStatus } from '@/lib/types';

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClasses: string; icon: React.ElementType }
> = {
  confirmed:    { label: 'Confirmed',    badgeClasses: 'bg-blue-50 text-blue-700 border border-blue-100',     icon: CheckCircle2 },
  processing:   { label: 'Processing',   badgeClasses: 'bg-amber-50 text-amber-700 border border-amber-100',  icon: Clock        },
  shipped:      { label: 'Shipped',      badgeClasses: 'bg-indigo-50 text-indigo-700 border border-indigo-100', icon: Truck       },
  delivered:    { label: 'Delivered',    badgeClasses: 'bg-green-50 text-green-700 border border-green-100',  icon: CheckCircle2 },
  cancelled:    { label: 'Cancelled',    badgeClasses: 'bg-red-50 text-red-600 border border-red-100',        icon: XCircle      },
  pending:      { label: 'Pending',      badgeClasses: 'bg-gray-50 text-gray-600 border border-gray-200',     icon: Clock        },
  complete:     { label: 'Complete',     badgeClasses: 'bg-green-50 text-green-700 border border-green-100',  icon: CheckCircle2 },
  on_hold:      { label: 'On Hold',      badgeClasses: 'bg-amber-50 text-amber-700 border border-amber-100',  icon: Clock        },
  ready_to_ship:{ label: 'Ready to Ship',badgeClasses: 'bg-indigo-50 text-indigo-700 border border-indigo-100',icon: Truck       },
};

function fmt(amount: string | number, signed = false) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(num));
  if (signed && num < 0) return `-${formatted}`;
  return formatted;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

// ── Dummy fallback order ───────────────────────────────────────────────────────

const DUMMY_ORDER: Order = {
  id: 9999,
  order_number: 'SS20260328MPFC',
  status: 'processing' as OrderStatus,
  payment_status: 'paid',
  shipping_method: 'standard_shipping',
  subtotal: '259.98',
  shipping_cost: '9.99',
  discount_amount: '20.00',
  total_amount: '249.97',
  tracking_number: 'TRK-AU-882910',
  created_at: '2026-03-28T10:22:00.000000Z',
  updated_at: '2026-03-29T08:00:00.000000Z',
  items: [
    {
      id: 1,
      product_name: '30 Inch 6 Modes Series 180W Amber & White LED Light Bar',
      sku: 'ZD000654',
      unit_price: '129.99',
      total_price: '129.99',
      quantity: 1,
      product_variation: null,
      product: { images: [] },
    },
    {
      id: 2,
      product_name: '7 Inch 135W Starlight Flow Series DRL LED Headlights (Pair)',
      sku: 'ZD000712',
      unit_price: '129.99',
      total_price: '129.99',
      quantity: 1,
      product_variation: null,
      product: { images: [] },
    },
  ],
  shipping_address: {
    address_line_1: '42 Maple Street',
    address_line_2: 'Apt 3B',
    city: 'Austin',
    state: 'TX',
    zip_code: '78701',
  },
} as unknown as Order;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, isError } = useOrderDetails(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
      </div>
    );
  }

  const isFallback = isError || !order;
  const o = (isFallback ? { ...DUMMY_ORDER, order_number: id } : order) as Order;
  const cfg = STATUS_CONFIG[o.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const discount = parseFloat(o.discount_amount ?? '0');

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Order #{o.order_number}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Placed on {formatDate(o.created_at)}</p>
        </div>
        {o.status !== 'cancelled' && o.status !== 'delivered' && o.status !== 'complete' && (
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <X className="w-4 h-4" />
            Cancel Order
          </button>
        )}
      </div>

      {/* Status card */}
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
            <StatusIcon className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Order Status</p>
            <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.badgeClasses}`}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total Amount</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{fmt(o.total_amount)}</p>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Order Items ({o.items?.length ?? 0})
          </h3>
        </div>
        <ul className="divide-y divide-gray-50">
          {(o.items ?? []).map((item) => {
            const image = item.product?.images?.find((i) => i.is_primary)?.full_url
              ?? item.product?.images?.[0]?.full_url
              ?? null;
            return (
              <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {image ? (
                    <img src={image} alt={item.product_name} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                  {item.product_variation && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.product_variation.variation_values
                        .map((v) => `${v.variation_option.variation.name}: ${v.variation_option.value}`)
                        .join(' · ')}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">
                    {fmt(item.unit_price)} &times; {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {fmt(item.total_price)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Order information */}
        <div className="sm:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <InfoRow
                label="Payment Status"
                value={
                  <span className={
                    o.payment_status === 'paid' ? 'text-green-600' :
                    o.payment_status === 'failed' ? 'text-red-600' : 'text-amber-600'
                  }>
                    {o.payment_status.charAt(0).toUpperCase() + o.payment_status.slice(1)}
                  </span>
                }
              />
            </div>
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <InfoRow label="Shipping Method" value={o.shipping_method.replace(/_/g, ' ')} />
            </div>
            {o.tracking_number && (
              <div className="flex items-start gap-2.5 col-span-2">
                <Package className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <InfoRow label="Tracking Number" value={o.tracking_number} />
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <CalendarDays className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <InfoRow label="Last Updated" value={o.updated_at ? formatDate(o.updated_at) : '—'} />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span className="text-gray-900">{fmt(o.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping:</span>
              <span className="text-gray-900">{fmt(o.shipping_cost)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Discount:</span>
                <span className="text-green-600">-{fmt(discount)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2.5 flex justify-between font-semibold">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">{fmt(o.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {o.shipping_address && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Shipping Address</h3>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>{o.shipping_address.address_line_1}</p>
            {o.shipping_address.address_line_2 && <p>{o.shipping_address.address_line_2}</p>}
            <p>
              {[o.shipping_address.city, o.shipping_address.state, o.shipping_address.zip_code]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
