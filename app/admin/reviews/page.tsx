'use client';

import { useState, useCallback } from 'react';
import { Eye, ChevronLeft, ChevronRight, SlidersHorizontal, Star, BarChart2 } from 'lucide-react';
import {
  useAdminReviews,
  useAdminReviewStatistics,
} from '@/lib/hooks/admin/useAdminReviews';
import ReviewDetailModal from './_components/ReviewDetailModal';
import type { AdminReviewFilters } from '@/lib/types/admin';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface AdminReview {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  helpful_count: number;
  admin_response: string | null;
  created_at: string;
  user?: { id: number; first_name: string; last_name: string; email: string };
  product?: { id: number; name: string; slug: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReviewStatus, { label: string; cls: string }> = {
  pending:  { label: 'Pending',  cls: 'bg-amber-50  text-amber-600  border border-amber-100'  },
  approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  rejected: { label: 'Rejected', cls: 'bg-red-50    text-red-500    border border-red-100'    },
};

const STATUS_FILTERS = [
  { value: '',         label: 'All Statuses' },
  { value: 'pending',  label: 'Pending'      },
  { value: 'approved', label: 'Approved'     },
  { value: 'rejected', label: 'Rejected'     },
];

const RATING_FILTERS = [
  { value: '',  label: 'All Ratings' },
  { value: '5', label: '5 Stars'     },
  { value: '4', label: '4 Stars'     },
  { value: '3', label: '3 Stars'     },
  { value: '2', label: '2 Stars'     },
  { value: '1', label: '1 Star'      },
];

function StatusBadge({ status }: { status: ReviewStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-none text-gray-200'}`}
        />
      ))}
    </div>
  );
}

// ─── Stats cards ──────────────────────────────────────────────────────────────

function StatsBar() {
  const { data: stats } = useAdminReviewStatistics();
  if (!stats) return null;

  const cards = [
    { label: 'Total',    value: stats.total,    cls: 'text-gray-800'    },
    { label: 'Pending',  value: stats.pending,  cls: 'text-amber-600'   },
    { label: 'Approved', value: stats.approved, cls: 'text-emerald-600' },
    { label: 'Rejected', value: stats.rejected, cls: 'text-red-500'     },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
          <p className="text-xs text-gray-400 font-medium mb-0.5">{c.label}</p>
          <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

export default function AdminReviewsPage() {
  const [search, setSearch]         = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [ratingFilter, setRating]   = useState('');
  const [page, setPage]             = useState(1);
  const [selected, setSelected]     = useState<AdminReview | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebounced(val);
      setPage(1);
    }, 400);
  }, []);

  const filters: AdminReviewFilters = {
    search:   debouncedSearch || undefined,
    status:   (statusFilter as ReviewStatus) || undefined,
    rating:   ratingFilter ? Number(ratingFilter) : undefined,
    page,
    per_page: PER_PAGE,
  };

  const { data, isLoading, isFetching } = useAdminReviews(filters);

  const reviews: AdminReview[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number    = data?.data?.total ?? data?.pagination?.total ?? reviews.length;
  const lastPage: number = data?.data?.last_page ?? data?.pagination?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <StatsBar />

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Search */}
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {/* Rating filter */}
          <select
            value={ratingFilter}
            onChange={(e) => { setRating(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {RATING_FILTERS.map((f) => (
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
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Review</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading ? (
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-sm text-gray-400">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">#{r.id}</td>
                    <td className="px-4 py-4 text-gray-700 max-w-[160px]">
                      <span className="line-clamp-1 text-xs font-medium">{r.product?.name ?? '—'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="leading-tight">
                        <p className="text-xs font-medium text-gray-800">
                          {r.user ? `${r.user.first_name} ${r.user.last_name}` : '—'}
                        </p>
                        <p className="text-[11px] text-gray-400">{r.user?.email ?? ''}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay rating={r.rating} />
                    </td>
                    <td className="px-4 py-4 max-w-[220px]">
                      {r.title && (
                        <p className="text-xs font-semibold text-gray-800 mb-0.5 line-clamp-1">{r.title}</p>
                      )}
                      <p className="text-xs text-gray-500 line-clamp-2">{r.comment}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setSelected(r)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="View & manage"
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
              <span className="font-medium text-gray-600">{total.toLocaleString()} reviews</span>
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
      {selected && (
        <ReviewDetailModal
          open={!!selected}
          onClose={() => setSelected(null)}
          review={selected}
        />
      )}
    </div>
  );
}
