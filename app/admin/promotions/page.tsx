'use client';

import { useState, useCallback } from 'react';
import {
  useAdminPromotions,
  useAdminCreatePromotion,
  useAdminUpdatePromotion,
  useAdminDeletePromotion,
  useAdminTogglePromotion,
} from '@/lib/hooks/admin/useAdminPromotions';
import { useAdminProducts } from '@/lib/hooks/admin/useAdminProducts';
import { useAdminBrands } from '@/lib/hooks/admin/useAdminBrands';
import { useAdminCategoryTree } from '@/lib/hooks/admin/useAdminCategories';
import type { CreatePromotionPayload } from '@/lib/types/admin';
import type { Category } from '@/lib/types/catalog';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ToggleLeft,
  ToggleRight,
  Zap,
  Package,
  Layers,
  Tag,
} from 'lucide-react';
import { toast } from 'react-toastify';
import PromotionModal, { type AdminPromotion } from './_components/PromotionModal';
import PromotionDetailDrawer from './_components/PromotionDetailDrawer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

const PROMOTION_TYPE_CONFIG: Record<
  string,
  { label: string; cls: string }
> = {
  percentage:   { label: 'Percentage',   cls: 'bg-blue-50 text-blue-600 border-blue-100' },
  fixed_amount: { label: 'Fixed Amount', cls: 'bg-purple-50 text-purple-600 border-purple-100' },
  flash_sale:   { label: 'Flash Sale',   cls: 'bg-red-50 text-red-600 border-red-100' },
  combo_offer:  { label: 'Combo Offer',  cls: 'bg-orange-50 text-orange-600 border-orange-100' },
  free_delivery:{ label: 'Free Delivery',cls: 'bg-teal-50 text-teal-600 border-teal-100' },
};

const APPLIES_TO_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
  all_products:        { label: 'All Products',        icon: Zap },
  specific_products:   { label: 'Specific Products',   icon: Package },
  specific_brands:     { label: 'Specific Brands',     icon: Layers },
  specific_categories: { label: 'Specific Categories', icon: Tag },
};

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function discountLabel(p: AdminPromotion): string {
  if (p.promotion_type === 'free_delivery') return 'Free Delivery';
  const isPercent = p.promotion_type === 'percentage' || p.promotion_type === 'flash_sale';
  return isPercent
    ? `${p.discount_value}% off`
    : `$${Number(p.discount_value).toFixed(2)} off`;
}

function PromotionStatusBadge({ promotion }: { promotion: AdminPromotion }) {
  const now = new Date();
  const expired = promotion.ends_at && new Date(promotion.ends_at) < now;
  const notStarted = promotion.starts_at && new Date(promotion.starts_at) > now;

  if (!promotion.is_active) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        Inactive
      </span>
    );
  }
  if (expired) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
        Expired
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

// Flatten category tree to flat list for the picker
function flattenCategories(tree: Category[]): Category[] {
  const result: Category[] = [];
  function walk(nodes: Category[]) {
    for (const n of nodes) {
      result.push(n);
      if (n.children?.length) walk(n.children);
    }
  }
  walk(tree ?? []);
  return result;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPromotionsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminPromotion | null>(null);

  // Detail drawer state
  const [detailId, setDetailId] = useState<number | null>(null);

  // ── Data ──
  const { data, isLoading, isFetching } = useAdminPromotions({
    search: debouncedSearch || undefined,
    page,
    per_page: PER_PAGE,
    ...(typeFilter ? { promotion_type: typeFilter } : {}),
  } as any);

  // Picker data — fetch all for the modal selectors
  const { data: productsData, isLoading: loadingProducts } = useAdminProducts({ per_page: 500 });
  const { data: brandsData, isLoading: loadingBrands } = useAdminBrands({ per_page: 500 });
  const { data: categoryTree, isLoading: loadingCategories } = useAdminCategoryTree();

  const createPromotion = useAdminCreatePromotion();
  const updatePromotion = useAdminUpdatePromotion();
  const deletePromotion = useAdminDeletePromotion();
  const togglePromotion = useAdminTogglePromotion();

  // Resolve paginator shape
  const promotions: AdminPromotion[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number = data?.pagination?.total ?? data?.data?.total ?? promotions.length;
  const lastPage: number =
    data?.pagination?.last_page ?? data?.data?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  // Flatten picker data
  const allProducts = Array.isArray(productsData?.data)
    ? productsData.data
    : (productsData?.data?.data ?? []);
  const allBrands = Array.isArray(brandsData?.data)
    ? brandsData.data
    : (brandsData?.data?.data ?? []);
  const allCategories = flattenCategories(categoryTree ?? []);

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

  function openEdit(promotion: AdminPromotion) {
    setDetailId(null); // close drawer if open
    setEditTarget(promotion);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  // ── Submit ──
  function handleSubmit(payload: CreatePromotionPayload) {
    if (editTarget) {
      updatePromotion.mutate(
        { id: editTarget.id, payload },
        {
          onSuccess: () => { toast.success('Promotion updated'); closeModal(); },
          onError: (e: any) => toast.error(e.response?.data?.message ?? 'Update failed'),
        },
      );
    } else {
      createPromotion.mutate(payload, {
        onSuccess: () => { toast.success('Promotion created'); closeModal(); },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Create failed'),
      });
    }
  }

  // ── Delete ──
  function handleDelete(promotion: AdminPromotion) {
    if (!confirm(`Delete "${promotion.name}"? This cannot be undone.`)) return;
    deletePromotion.mutate(promotion.id, {
      onSuccess: () => toast.success('Promotion deleted'),
      onError: (e: any) => toast.error(e.response?.data?.message ?? 'Delete failed'),
    });
  }

  // ── Toggle ──
  function handleToggle(promotion: AdminPromotion) {
    togglePromotion.mutate(promotion.id, {
      onSuccess: () =>
        toast.success(`Promotion ${promotion.is_active ? 'deactivated' : 'activated'}`),
      onError: (e: any) => toast.error(e.response?.data?.message ?? 'Toggle failed'),
    });
  }

  const isMutating = createPromotion.isPending || updatePromotion.isPending;

  // Page numbers
  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="space-y-4">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-64">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search promotions..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
              />
            </div>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
            >
              <option value="">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed_amount">Fixed Amount</option>
              <option value="flash_sale">Flash Sale</option>
              <option value="combo_offer">Combo Offer</option>
              <option value="free_delivery">Free Delivery</option>
            </select>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
          >
            <Plus className="w-4 h-4" />
            Add Promotion
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Promotion</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Discount</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Applies To</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                {isLoading ? (
                  Array.from({ length: PER_PAGE }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-4">
                        <div className="h-3.5 w-40 bg-gray-100 rounded animate-pulse" />
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
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Zap className="w-8 h-8 opacity-30" />
                        <p className="text-sm">No promotions found.</p>
                        <button
                          onClick={openCreate}
                          className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                        >
                          Create your first promotion →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  promotions.map((promotion) => {
                    const typeConfig = PROMOTION_TYPE_CONFIG[promotion.promotion_type];
                    const appliesToConfig = APPLIES_TO_CONFIG[promotion.applies_to];
                    const AppliesToIcon = appliesToConfig?.icon ?? Zap;

                    // Count assigned items
                    const assignedCount =
                      (promotion.products?.length ?? 0) +
                      (promotion.brands?.length ?? 0) +
                      (promotion.categories?.length ?? 0);

                    return (
                      <tr
                        key={promotion.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800 leading-snug line-clamp-1 max-w-[200px]">
                            {promotion.name}
                          </p>
                          {promotion.description && (
                            <p className="text-[11px] text-gray-400 truncate max-w-[200px] mt-0.5">
                              {promotion.description}
                            </p>
                          )}
                        </td>

                        {/* Type */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              typeConfig?.cls ?? 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            {typeConfig?.label ?? promotion.promotion_type}
                          </span>
                        </td>

                        {/* Discount */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                            {discountLabel(promotion)}
                          </span>
                          {Number(promotion.min_purchase_amount) > 0 && (
                            <p className="text-[10px] text-gray-400 mt-1">
                              Min ${Number(promotion.min_purchase_amount).toFixed(0)}
                            </p>
                          )}
                        </td>

                        {/* Applies To */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <AppliesToIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-600">
                              {appliesToConfig?.label ?? promotion.applies_to}
                            </span>
                          </div>
                          {assignedCount > 0 && promotion.applies_to !== 'all_products' && (
                            <p className="text-[10px] text-amber-600 mt-0.5 pl-5">
                              {assignedCount} assigned
                            </p>
                          )}
                        </td>

                        {/* Duration */}
                        <td className="px-4 py-4">
                          <p className="text-xs text-gray-600">{formatDate(promotion.starts_at)}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">→ {formatDate(promotion.ends_at)}</p>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                            {promotion.priority}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <PromotionStatusBadge promotion={promotion} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDetailId(promotion.id)}
                              title="View details"
                              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggle(promotion)}
                              title={promotion.is_active ? 'Deactivate' : 'Activate'}
                              disabled={togglePromotion.isPending}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors disabled:opacity-40"
                            >
                              {promotion.is_active
                                ? <ToggleRight className="w-4 h-4 text-emerald-500" />
                                : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => openEdit(promotion)}
                              title="Edit"
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(promotion)}
                              title="Delete"
                              disabled={deletePromotion.isPending}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!isLoading && total > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-400">
                Showing {from}–{to} of{' '}
                <span className="font-medium text-gray-600">{total.toLocaleString()} promotions</span>
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
      <PromotionModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={isMutating}
        promotion={editTarget}
        allProducts={allProducts}
        allBrands={allBrands}
        allCategories={allCategories}
        loadingProducts={loadingProducts}
        loadingBrands={loadingBrands}
        loadingCategories={loadingCategories}
      />

      {/* ── Detail Drawer ── */}
      <PromotionDetailDrawer
        promotionId={detailId}
        onClose={() => setDetailId(null)}
        onEdit={(p) => {
          setDetailId(null);
          openEdit(p);
        }}
      />
    </>
  );
}
