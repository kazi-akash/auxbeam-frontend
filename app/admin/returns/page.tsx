'use client';

import { useState, useCallback } from 'react';
import { Eye, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useAdminReturns } from '@/lib/hooks/admin/useAdminReturnsRefunds';
import ReturnDetailModal from './_components/ReturnDetailModal';
import type { AdminReturn, ReturnStatus } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReturnStatus, { label: string; cls: string }> = {
  requested: { label: 'Requested',  cls: 'bg-blue-50   text-blue-600   border border-blue-100'   },
  approved:  { label: 'Approved',   cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  rejected:  { label: 'Rejected',   cls: 'bg-red-50    text-red-500    border border-red-100'    },
  received:  { label: 'Received',   cls: 'bg-purple-50 text-purple-600 border border-purple-100' },
  processed: { label: 'Processed',  cls: 'bg-gray-100  text-gray-500   border border-gray-200'   },
};

const REASON_LABELS: Record<string, string> = {
  defective:        'Defective',
  wrong_item:       'Wrong Item',
  not_as_described: 'Not as Described',
  changed_mind:     'Changed Mind',
  other:            'Other',
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '',          label: 'All Statuses' },
  { value: 'requested', label: 'Requested'    },
  { value: 'approved',  label: 'Approved'     },
  { value: 'rejected',  label: 'Rejected'     },
  { value: 'received',  label: 'Received'     },
  { value: 'processed', label: 'Processed'    },
];

function StatusBadge({ status }: { status: ReturnStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.requested;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

export default function AdminReturnsPage() {
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [statusFilter, setStatus]     = useState('');
  const [page, setPage]               = useState(1);
  const [selected, setSelected]       = useState<AdminReturn | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebounced(val);
      setPage(1);
    }, 400);
  }, []);

  const { data, isLoading, isFetching } = useAdminReturns({
    search:   debouncedSearch || undefined,
    status:   (statusFilter as ReturnStatus) || undefined,
    page,
    per_page: PER_PAGE,
  });

  // Support both paginator shapes
  const returns: AdminReturn[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number    = data?.data?.total ?? data?.pagination?.total ?? returns.length;
  const lastPage: number = data?.data?.last_page ?? data?.pagination?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Search */}
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
          />
        </div>

        {/* Status filter */}
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
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Return #</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Reason</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Qty</th>
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
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-sm text-gray-400">
                    No return requests found.
                  </td>
                </tr>
              ) : (
                returns.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">#{r.id}</td>
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {r.order_item?.order?.order_number ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-gray-600 max-w-[160px]">
                      <span className="line-clamp-1">{r.order_item?.product?.name ?? '—'}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div className="leading-tight">
                        <p className="font-medium text-gray-800 text-xs">{r.user?.full_name ?? '—'}</p>
                        <p className="text-gray-400 text-[11px]">{r.user?.email ?? ''}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-xs">
                      {REASON_LABELS[r.reason] ?? r.reason}
                    </td>
                    <td className="px-4 py-4 text-gray-700 font-medium">{r.quantity}</td>
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
              Showing {from}–{to} of <span className="font-medium text-gray-600">{total.toLocaleString()} returns</span>
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
      <ReturnDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        returnRequest={selected}
      />
    </div>
  );
}
