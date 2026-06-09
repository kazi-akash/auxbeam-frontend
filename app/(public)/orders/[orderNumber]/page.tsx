'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  MapPin,
  Loader2,
  Download,
  Home,
} from 'lucide-react';
import { useOrderDetails } from '@/lib/hooks/public/useOrders';
import { useDownloadInvoice } from '@/lib/hooks/customer/useCustomerOrders';
import { useAuth } from '@/lib/context/AuthContext';
import type { Order, OrderStatus } from '@/lib/types';
import { toast } from 'react-toastify';

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClasses: string; icon: React.ElementType; step: number }
> = {
  pending:       { label: 'Pending',        badgeClasses: 'bg-gray-50 text-gray-600 border border-gray-200',       icon: Clock,        step: 0 },
  confirmed:     { label: 'Confirmed',      badgeClasses: 'bg-blue-50 text-blue-700 border border-blue-100',       icon: CheckCircle2, step: 1 },
  processing:    { label: 'Processing',     badgeClasses: 'bg-amber-50 text-amber-700 border border-amber-100',    icon: Clock,        step: 2 },
  ready_to_ship: { label: 'Ready to Ship', badgeClasses: 'bg-indigo-50 text-indigo-700 border border-indigo-100', icon: Package,      step: 3 },
  shipped:       { label: 'Shipped',        badgeClasses: 'bg-indigo-50 text-indigo-700 border border-indigo-100', icon: Truck,        step: 4 },
  delivered:     { label: 'Delivered',      badgeClasses: 'bg-green-50 text-green-700 border border-green-100',   icon: CheckCircle2, step: 5 },
  complete:      { label: 'Complete',       badgeClasses: 'bg-green-50 text-green-700 border border-green-100',   icon: CheckCircle2, step: 5 },
  cancelled:     { label: 'Cancelled',      badgeClasses: 'bg-red-50 text-red-600 border border-red-100',         icon: XCircle,      step: -1 },
  on_hold:       { label: 'On Hold',        badgeClasses: 'bg-amber-50 text-amber-700 border border-amber-100',   icon: Clock,        step: 1 },
};

const PROGRESS_STEPS = [
  { key: 'confirmed',  label: 'Confirmed',  icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped',    label: 'Shipped',    icon: Truck },
  { key: 'delivered',  label: 'Delivered',  icon: Package },
];

function fmtBDT(amount: string | number) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `৳${num.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const { user } = useAuth();
  const { data: order, isLoading, isError } = useOrderDetails(orderNumber);
  const downloadInvoice = useDownloadInvoice();

  function handleDownloadInvoice() {
    downloadInvoice.mutate(orderNumber, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      onError: () => {
        toast.error('Failed to download invoice. Please try again.');
      },
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gray-300 animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Loading order details…</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <XCircle className="w-12 h-12 text-red-300 mx-auto" />
          <h2 className="text-lg font-semibold text-gray-800">Order not found</h2>
          <p className="text-sm text-gray-500">
            We couldn&apos;t find order <strong>{orderNumber}</strong>.
            It may still be processing — check your email for confirmation.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FDDE35] text-gray-900 font-semibold rounded-lg text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const o = order as Order;
  const cfg = STATUS_CONFIG[o.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const isCancelled = o.status === 'cancelled';
  const currentStep = cfg.step;
  const discount = parseFloat(o.discount_amount ?? '0');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Order #{o.order_number}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Placed on {formatDateTime(o.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Download Invoice */}
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={downloadInvoice.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              {downloadInvoice.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Download className="w-4 h-4" />
              }
              Download Invoice
            </button>

            {/* Dashboard link if logged in */}
            {user && (
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                My Orders
              </Link>
            )}
          </div>
        </div>

        {/* ── Success banner ─────────────────────────────────────────────── */}
        {!isCancelled && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Order placed successfully!</p>
              <p className="text-xs text-green-600 mt-0.5">
                Thank you for your purchase. We&apos;ll send you updates via email.
              </p>
            </div>
          </div>
        )}

        {/* ── Status + Total card ────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
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
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{fmtBDT(o.total_amount)}</p>
          </div>
        </div>

        {/* ── Progress tracker ───────────────────────────────────────────── */}
        {!isCancelled && (
          <div className="bg-white rounded-xl border border-gray-100 px-5 py-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Order Progress</h3>
            <div className="flex items-center">
              {PROGRESS_STEPS.map((step, idx) => {
                const done = currentStep > idx;
                const active = currentStep === idx + 1;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                        done || active
                          ? 'border-[#FDDE35] bg-[#FDDE35]'
                          : 'border-gray-200 bg-white'
                      }`}>
                        <Icon className={`w-4 h-4 ${done || active ? 'text-gray-900' : 'text-gray-300'}`} />
                      </div>
                      <span className={`text-[10px] font-medium whitespace-nowrap ${
                        done || active ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < PROGRESS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-5 transition-colors ${
                        done ? 'bg-[#FDDE35]' : 'bg-gray-100'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Order items ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Order Items ({o.items?.length ?? 0})
            </h3>
          </div>
          <ul className="divide-y divide-gray-50">
            {(o.items ?? []).map((item) => {
              const image =
                item.product?.images?.find((i) => i.is_primary)?.full_url ??
                item.product?.images?.[0]?.full_url ??
                null;
              return (
                <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                    {image ? (
                      <Image
                        src={image}
                        alt={item.product_name}
                        width={56}
                        height={56}
                        unoptimized
                        className="object-contain"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                      {item.product_name}
                    </p>
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
                      {fmtBDT(item.unit_price)} × {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {fmtBDT(item.total_price)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Summary + Info grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Order summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Price Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{fmtBDT(o.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {parseFloat(o.shipping_cost) === 0
                    ? <span className="text-green-600 font-medium">Free</span>
                    : fmtBDT(o.shipping_cost)
                  }
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{fmtBDT(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>{fmtBDT(o.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Order info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Order Details</h3>

            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Payment</p>
                <p className={`text-sm font-medium mt-0.5 ${
                  o.payment_status === 'paid' ? 'text-green-600' :
                  o.payment_status === 'failed' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {o.payment_status.charAt(0).toUpperCase() + o.payment_status.slice(1)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Shipping Method</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">
                  {o.shipping_method?.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            {o.tracking_number && (
              <div className="flex items-start gap-2.5">
                <Package className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Tracking Number</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 font-mono">
                    {o.tracking_number}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5">
              <CalendarDays className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Order Date</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {formatDate(o.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Shipping address ───────────────────────────────────────────── */}
        {o.shipping_address && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>{o.shipping_address.address_line_1}</p>
              {o.shipping_address.address_line_2 && (
                <p>{o.shipping_address.address_line_2}</p>
              )}
              <p>
                {[o.shipping_address.city, o.shipping_address.state, o.shipping_address.zip_code]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* ── Footer actions ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#FDDE35] hover:bg-[#ffed4e] text-gray-900 font-semibold rounded-xl text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </Link>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            disabled={downloadInvoice.isPending}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            {downloadInvoice.isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Download className="w-4 h-4" />
            }
            Download Invoice
          </button>
          {user && (
            <Link
              href="/dashboard/orders"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              View All Orders
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
