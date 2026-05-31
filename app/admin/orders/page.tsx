'use client';

import { useState, useCallback } from 'react';
import {
  Eye, ChevronLeft, ChevronRight, Search, Calendar,
  RefreshCw, ShoppingCart, SlidersHorizontal, Download,
} from 'lucide-react';
import { useAdminOrders } from '@/lib/hooks/admin/useAdminOrders';
import { OrderStatusBadge, PaymentStatusBadge } from './_components/OrderStatusBadge';
import OrderDetailModal from './_components/OrderDetailModal';
import type { AdminOrder, AdminOrderFilters } from '@/lib/types/admin';
import type { OrderStatus, PaymentStatus } from '@/lib/types/order';

// ─── Constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 15;

/** Status tabs shown at the top of the page */
const STATUS_TABS: { value: string; label: string; color?: string }[] = [
  { value: '',                    label: 'All Orders'           },
  { value: 'pending',             label: 'Pending'              },
  { value: 'processing',          label: 'Processing'           },
  { value: 'incomplete',          label: 'Incomplete'           },
  { value: 'good_but_no_response',label: 'Good but No Response' },
  { value: 'advance_payment',     label: 'Advance Payment'      },
  { value: 'on_hold',             label: 'On Hold'              },
  { value: 'ready_to_ship',       label: 'Ready to Ship'        },
  { value: 'complete',            label: 'Complete'             },
  { value: 'cancelled',           label: 'Cancelled'            },
];

const PAYMENT_FILTERS: { value: string; label: string }[] = [
  { value: '',         label: 'All Payments' },
  { value: 'pending',  label: 'Pending'      },
  { value: 'paid',     label: 'Paid'         },
  { value: 'failed',   label: 'Failed'       },
  { value: 'refunded', label: 'Refunded'     },
];

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: '',         label: 'All Types' },
  { value: 'online',   label: 'Online'    },
  { value: 'in_store', label: 'In-Store'  },
];

const SOURCE_FILTERS: { value: string; label: string }[] = [
  { value: '',           label: 'All Sources'  },
  { value: 'website',    label: 'Website'      },
  { value: 'facebook',   label: 'Facebook'     },
  { value: 'instagram',  label: 'Instagram'    },
  { value: 'whatsapp',   label: 'WhatsApp'     },
  { value: 'phone_call', label: 'Phone Call'   },
  { value: 'manual',     label: 'Manual'       },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function currency(val: string | number) {
  return '৳' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function fmtDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function customerName(o: AdminOrder) {
  if (o.user) return o.user.full_name || `${o.user.first_name} ${o.user.last_name}`.trim();
  return o.customer_name ?? 'Guest';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  // Tab / filter state
  const [activeTab, setActiveTab]     = useState('');
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [paymentFilter, setPayment]   = useState('');
  const [typeFilter, setType]         = useState('');
  const [sourceFilter, setSource]     = useState('');
  const [dateFrom, setDateFrom]       = useState('');
  const [dateTo, setDateTo]           = useState('');
  const [page, setPage]               = useState(1);
  const [selectedId, setSelectedId]   = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebounced(val);
      setPage(1);
    }, 400);
  }, []);

  const filters: AdminOrderFilters = {
    search:         debouncedSearch || undefined,
    status:         (activeTab as OrderStatus) || undefined,
    payment_status: (paymentFilter as PaymentStatus) || undefined,
    order_type:     (typeFilter as 'online' | 'in_store') || undefined,
    date_from:      dateFrom || undefined,
    date_to:        dateTo || undefined,
    page,
    per_page:       PER_PAGE,
    sort_by:        'created_at',
    sort_order:     'desc',
  };

  const { data, isLoading, isFetching, refetch } = useAdminOrders(filters);

  const orders: AdminOrder[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number    = data?.data?.total ?? data?.pagination?.total ?? orders.length;
  const lastPage: number = data?.data?.last_page ?? data?.pagination?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  function handleTabChange(val: string) {
    setActiveTab(val);
    setPage(1);
  }

  function clearFilters() {
    setPayment(''); setType(''); setSource('');
    setDateFrom(''); setDateTo('');
    setDebounced(''); setSearch('');
    setPage(1);
  }

  const hasActiveFilters = !!(paymentFilter || typeFilter || sourceFilter || dateFrom || dateTo || debouncedSearch);

  return (
    <div className="space-y-0">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-amber-500" />
          <h1 className="text-lg font-bold text-gray-900">Orders</h1>
          {total > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
              {total.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Status Tabs ── */}
      <div className="bg-white rounded-t-xl border border-b-0 border-gray-100 overflow-x-auto">
        <div className="flex min-w-max">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.value
                  ? 'border-amber-400 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border border-t-0 border-b-0 border-gray-100 px-4 py-3 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
          />
        </div>

        {/* Payment filter */}
        <select
          value={paymentFilter}
          onChange={(e) => { setPayment(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
        >
          {PAYMENT_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        {/* More filters toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition ${
            showFilters || hasActiveFilters
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
        </button>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 transition underline">
            Clear all
          </button>
        )}
      </div>

      {/* ── Extended filters ── */}
      {showFilters && (
        <div className="bg-gray-50 border border-t-0 border-b-0 border-gray-100 px-4 py-3 flex items-center gap-3 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {TYPE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => { setSource(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {SOURCE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
            />
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order #</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading ? (
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ShoppingCart className="w-8 h-8 opacity-30" />
                      <p className="text-sm">No orders found.</p>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs text-amber-600 hover:underline">
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedId(o.id)}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-mono text-xs font-semibold text-gray-800">{o.order_number}</p>
                        {o.tracking_number && (
                          <p className="font-mono text-[10px] text-gray-400 mt-0.5">{o.tracking_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="leading-tight">
                        <p className="text-xs font-semibold text-gray-800">{customerName(o)}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{o.user?.email ?? o.customer_email ?? ''}</p>
                        {o.customer_phone && (
                          <p className="text-[11px] text-gray-400">{o.customer_phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-xs">
                      {o.items?.length ?? '—'}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-gray-800">{currency(o.total_amount)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-4">
                      <PaymentStatusBadge status={o.payment_status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 capitalize">
                      {o.order_source?.replace(/_/g, ' ') ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {fmtDate(o.created_at)}
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedId(o.id)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="View order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400">
              Showing {from}–{to} of{' '}
              <span className="font-medium text-gray-600">{total.toLocaleString()} orders</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${
                    n === page
                      ? 'bg-amber-400 text-black border border-amber-400'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <OrderDetailModal
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        orderId={selectedId}
      />
    </div>
  );
}
