'use client';

import { useState, useCallback } from 'react';
import {
  useAdminCoupons,
  useAdminCreateCoupon,
  useAdminUpdateCoupon,
  useAdminDeleteCoupon,
} from '@/lib/hooks/admin/useAdminPromotions';
import type { CreateCouponPayload } from '@/lib/types/admin';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Copy,
  Check,
  Tag,
} from 'lucide-react';
import { toast } from 'react-toastify';
import CouponModal, { type AdminCoupon } from './_components/CouponModal';
import CouponUsageDrawer from './_components/CouponUsageDrawer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function discountLabel(coupon: AdminCoupon): string {
  if (coupon.discount_type === 'free_shipping') return 'Free Shipping';
  if (coupon.discount_type === 'percentage') return `${coupon.discount_value}% off`;
  return `$${Number(coupon.discount_value).toFixed(2)} off`;
}

function appliesToLabel(v: string): string {
  const map: Record<string, string> = {
    all_products: 'All Products',
    specific_products: 'Specific Products',
    specific_brands: 'Specific Brands',
    specific_categories: 'Specific Categories',
  };
  return map[v] ?? v;
}

function CouponStatusBadge({ coupon }: { coupon: AdminCoupon }) {
  const now = new Date();
  const expired = coupon.expires_at && new Date(coupon.expires_at) < now;
  const notStarted = coupon.starts_at && new Date(coupon.starts_at) > now;
  const limitReached = coupon.usage_limit && coupon.usage_count >= coupon.usage_limit;

  if (!coupon.is_active) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        Inactive
      </span>
    );
  }
  if (expired || limitReached) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
        {expired ? 'Expired' : 'Limit Reached'}
      </span>
    );
  }
  if (notStarted) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-500 border border-blue-100">
        Scheduled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      Active
    </span>
  );
}

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      className="ml-1.5 p-1 text-gray-300 hover:text-gray-500 transition-colors rounded"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCouponsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCoupon | null>(null);

  // Usage drawer state
  const [usageCoupon, setUsageCoupon] = useState<AdminCoupon | null>(null);

  // ── Data ──
  const { data, isLoading, isFetching } = useAdminCoupons({
    search: debouncedSearch || undefined,
    page,
    per_page: PER_PAGE,
  });

  const createCoupon = useAdminCreateCoupon();
  const updateCoupon = useAdminUpdateCoupon();
  const deleteCoupon = useAdminDeleteCoupon();

  // Resolve paginator shape
  const coupons: AdminCoupon[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number = data?.pagination?.total ?? data?.data?.total ?? coupons.length;
  const lastPage: number =
    data?.pagination?.last_page ?? data?.data?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  // ── Debounce search ──
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  }, []);

  // ── Modal helpers ──
  function openCreate() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(coupon: AdminCoupon) {
    setEditTarget(coupon);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  // ── Submit ──
  function handleSubmit(payload: CreateCouponPayload) {
    if (editTarget) {
      updateCoupon.mutate(
        { id: editTarget.id, payload },
        {
          onSuccess: () => { toast.success('Coupon updated'); closeModal(); },
          onError: (e: any) => toast.error(e.response?.data?.message ?? 'Update failed'),
        },
      );
    } else {
      createCoupon.mutate(payload, {
        onSuccess: () => { toast.success('Coupon created'); closeModal(); },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Create failed'),
      });
    }
  }

  // ── Delete ──
  function handleDelete(coupon: AdminCoupon) {
    if (!confirm(`Delete coupon "${coupon.code}"? This cannot be undone.`)) return;
    deleteCoupon.mutate(coupon.id, {
      onSuccess: () => toast.success('Coupon deleted'),
      onError: (e: any) => toast.error(e.response?.data?.message ?? 'Delete failed'),
    });
  }

  const isMutating = createCoupon.isPending || updateCoupon.isPending;

  // Page numbers
  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="space-y-4">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by code..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
            />
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Discount</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Applies To</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Usage</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Expires</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                {isLoading ? (
                  Array.from({ length: PER_PAGE }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-4">
                        <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
                      </td>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                      <td className="px-5 py-4">
                        <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Tag className="w-8 h-8 opacity-30" />
                        <p className="text-sm">No coupons found.</p>
                        <button
                          onClick={openCreate}
                          className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                        >
                          Create your first coupon →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md tracking-wider">
                            {coupon.code}
                          </span>
                          <CopyCodeButton code={coupon.code} />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-800 leading-snug line-clamp-1 max-w-[160px]">
                          {coupon.name}
                        </p>
                        {coupon.description && (
                          <p className="text-[11px] text-gray-400 truncate max-w-[160px] mt-0.5">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                          {discountLabel(coupon)}
                        </span>
                        {coupon.min_order_amount > 0 && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            Min ${Number(coupon.min_order_amount).toFixed(0)}
                          </p>
                        )}
                      </td>

                      {/* Applies To */}
                      <td className="px-4 py-4 text-xs text-gray-600">
                        {appliesToLabel(coupon.applies_to)}
                      </td>

                      {/* Usage */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-gray-700">
                            {coupon.usage_count}
                          </span>
                          <span className="text-xs text-gray-400">
                            / {coupon.usage_limit ?? '∞'}
                          </span>
                        </div>
                        {coupon.usage_limit && (
                          <div className="mt-1.5 w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (coupon.usage_count / coupon.usage_limit) * 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Expires */}
                      <td className="px-4 py-4 text-xs text-gray-500">
                        {formatDate(coupon.expires_at)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <CouponStatusBadge coupon={coupon} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setUsageCoupon(coupon)}
                            title="View usage"
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <BarChart2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(coupon)}
                            title="Edit"
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon)}
                            title="Delete"
                            disabled={deleteCoupon.isPending}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!isLoading && total > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-400">
                Showing {from}–{to} of{' '}
                <span className="font-medium text-gray-600">{total.toLocaleString()} coupons</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
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
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      <CouponModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={isMutating}
        coupon={editTarget}
      />

      {/* ── Usage Drawer ── */}
      <CouponUsageDrawer
        coupon={usageCoupon}
        onClose={() => setUsageCoupon(null)}
      />
    </>
  );
}
