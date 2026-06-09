'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Download,
  SlidersHorizontal,
  Search,
  Loader2,
} from 'lucide-react';
import { useMyOrders } from '@/lib/hooks/customer/useCustomerOrders';
import type { Order, OrderStatus } from '@/lib/types';

// ─── Status config ────────────────────────────────────────────────────────────

type StatusMeta = {
  label: string;
  badge: string;        // pill classes
  icon: React.ElementType;
};

const STATUS_CONFIG: Record<string, StatusMeta> = {
  pending:       { label: 'Pending',        badge: 'bg-gray-100 text-gray-600 border-gray-200',           icon: Clock        },
  confirmed:     { label: 'Confirmed',      badge: 'bg-blue-50 text-blue-700 border-blue-200',            icon: Clock        },
  processing:    { label: 'Processing',     badge: 'bg-orange-50 text-orange-600 border-orange-200',      icon: Clock        },
  shipped:       { label: 'In transit',     badge: 'bg-sky-50 text-sky-700 border-sky-200',               icon: Truck        },
  delivered:     { label: 'Delivered',      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',   icon: CheckCircle2 },
  complete:      { label: 'Delivered',      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',   icon: CheckCircle2 },
  cancelled:     { label: 'Cancelled',      badge: 'bg-red-50 text-red-600 border-red-200',               icon: XCircle      },
  on_hold:       { label: 'On Hold',        badge: 'bg-amber-50 text-amber-600 border-amber-200',         icon: Clock        },
  ready_to_ship: { label: 'Ready to Ship',  badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',      icon: Package      },
};

function getStatus(status: OrderStatus): StatusMeta {
  return STATUS_CONFIG[status] ?? { label: status, badge: 'bg-gray-100 text-gray-600 border-gray-200', icon: Package };
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const VISIBLE_TABS = [
  { key: 'all',       label: 'All'        },
  { key: 'pending',   label: 'Pending'    },
  { key: 'processing',label: 'Processing' },
  { key: 'shipped',   label: 'In transit' },
  { key: 'delivered', label: 'Delivered'  },
  { key: 'cancelled', label: 'Cancelled'  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: string | number) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = getStatus(status);
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.badge}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: Order }) {
  const firstItem = order.items?.[0];
  const productName = firstItem?.product?.name ?? firstItem?.product_name ?? `Order #${order.order_number}`;
  const variantParts =
    firstItem?.product_variation?.variation_values?.map(
      (v) => v.variation_option?.value
    ).filter(Boolean) ?? [];

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/70 transition-colors group border-b border-gray-100 last:border-0">
      {/* Icon box */}
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-gray-400" />
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{productName}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          #{order.order_number}
          {variantParts.length > 0 && <> &middot; {variantParts.join(' · ')}</>}
          {order.items && order.items.length > 0 && (
            <> &middot; Qty {order.items.reduce((s, i) => s + (i.quantity ?? 1), 0)}</>
          )}
        </p>
      </div>

      {/* Date */}
      <div className="hidden md:block w-32 shrink-0">
        <p className="text-xs text-gray-400">Date</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(order.created_at)}</p>
      </div>

      {/* Total */}
      <div className="hidden sm:block w-24 shrink-0">
        <p className="text-xs text-gray-400">Total</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">{formatCurrency(order.total_amount)}</p>
      </div>

      {/* Status */}
      <div className="hidden lg:block w-36 shrink-0">
        <StatusBadge status={order.status} />
      </div>

      {/* CTA */}
      <Link
        href={`/dashboard/orders/${order.order_number}`}
        className="shrink-0 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3.5 py-1.5 hover:bg-gray-100 transition-colors"
      >
        Details
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { data, isLoading, isError } = useMyOrders();
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');

  const orders: Order[] = data?.data ?? data ?? [];

  const filtered = useMemo(() => {
    let list = orders;

    if (activeTab !== 'all') {
      // "delivered" tab covers both delivered + complete
      if (activeTab === 'delivered') {
        list = list.filter((o) => o.status === 'delivered' || o.status === 'complete');
      } else {
        list = list.filter((o) => o.status === activeTab);
      }
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          String(o.order_number).toLowerCase().includes(q) ||
          o.items?.some((i) => i.product?.name?.toLowerCase().includes(q))
      );
    }

    return list;
  }, [orders, activeTab, query]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="py-16 text-center text-sm text-red-500">
        Failed to load orders. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order history</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track every parcel, manage returns, and download invoices in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <Link
            href="/track-order"
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-500 rounded-xl px-4 py-2 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Track parcel</span>
          </Link>
        </div>
      </div>

      {/* ── Search + filter bar ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order ID or product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* ── Main card ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Status tabs */}
        <div className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-gray-100 overflow-x-auto no-scrollbar">
          {VISIBLE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              {query ? 'No orders match your search.' : 'No orders yet.'}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
