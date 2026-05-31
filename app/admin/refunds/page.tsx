'use client';

import { useState } from 'react';
import { Plus, Eye, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useAdminRefunds } from '@/lib/hooks/admin/useAdminReturnsRefunds';
import CreateRefundModal from './_components/CreateRefundModal';
import RefundDetailModal from './_components/RefundDetailModal';
import type { AdminRefund, RefundStatus, RefundMethod } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RefundStatus, { label: string; cls: string }> = {
  pending:    { label: 'Pending',    cls: 'bg-amber-50  text-amber-600  border border-amber-100'  },
  processing: { label: 'Processing', cls: 'bg-blue-50   text-blue-600   border border-blue-100'   },
  completed:  { label: 'Completed',  cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  failed:     { label: 'Failed',     cls: 'bg-red-50    text-red-500    border border-red-100'    },
  cancelled:  { label: 'Cancelled',  cls: 'bg-gray-100  text-gray-500   border border-gray-200'   },
};

const METHOD_LABELS: Record<string, string> = {
  original_payment: 'Original Payment',
  store_credit:     'Store Credit',
  bank_transfer:    'Bank Transfer',
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '',           label: 'All Statuses'  },
  { value: 'pending',    label: 'Pending'       },
  { value: 'processing', label: 'Processing'    },
  { value: 'completed',  label: 'Completed'     },
  { value: 'failed',     label: 'Failed'        },
  { value: 'cancelled',  label: 'Cancelled'     },
];

const METHOD_FILTERS: { value: string; label: string }[] = [
  { value: '',                  label: 'All Methods'       },
  { value: 'original_payment',  label: 'Original Payment'  },
  { value: 'store_credit',      label: 'Store Credit'      },
  { value: 'bank_transfer',     label: 'Bank Transfer'     },
];

function StatusBadge({ status }: { status: RefundStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

export default function AdminRefundsPage() {
  const [statusFilter, setStatus]   = useState('');
  const [methodFilter, setMethod]   = useState('');
  const [page, setPage]             = useState(1);
  const [selected, setSelected]     = useState<AdminRefund | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isFetching } = useAdminRefunds({
    status:        (statusFilter as RefundStatus) || undefined,
    refund_method: (methodFilter as RefundMethod) || undefined,
    page,
    per_page: PER_PAGE,
  });

  const refunds: AdminRefund[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number    = data?.data?.total ?? data?.pagination?.total ?? refunds.length;
  const lastPage: number = data?.data?.last_page ?? data?.pagination?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  // Summary stats
  const pendingCount   = refunds.filter((r) => r.status === 'pending').length;
  const completedTotal = refunds
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="space-y-4">
      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Refunds</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Completed (page)</p>
          <p className="text-2xl font-bold text-emerald-700">${completedTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={methodFilter}
            onChange={(e) => { setMethod(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {METHOD_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
        >
          <Plus className="w-4 h-4" />
          Create Refund
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Refund #</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Method</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
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
              ) : refunds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-sm text-gray-400">
                    No refunds found.
                  </td>
                </tr>
              ) : (
                refunds.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">#{r.id}</td>
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {r.order?.order_number ?? `#${r.order_id}`}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div className="leading-tight">
                        <p className="font-medium text-gray-800 text-xs">{r.user?.full_name ?? '—'}</p>
                        <p className="text-gray-400 text-[11px]">{r.user?.email ?? ''}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-800">
                      ${Number(r.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-gray-600 capitalize text-xs">{r.refund_type}</td>
                    <td className="px-4 py-4 text-gray-600 text-xs">
                      {METHOD_LABELS[r.refund_method] ?? r.refund_method}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setSelected(r)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="View details"
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
              Showing {from}–{to} of <span className="font-medium text-gray-600">{total.toLocaleString()} refunds</span>
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

      {/* Modals */}
      <CreateRefundModal open={showCreate} onClose={() => setShowCreate(false)} />
      <RefundDetailModal open={!!selected} onClose={() => setSelected(null)} refund={selected} />
    </div>
  );
}
