'use client';

import { useState, useCallback } from 'react';
import {
  useAdminCategoryTree,
  useAdminCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from '@/lib/hooks/admin/useAdminCategories';
import type { Category } from '@/lib/types/catalog';
import type { CreateCategoryPayload } from '@/lib/types/admin';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import CategoryModal from './_components/CategoryModal';
import CategoryTree from './_components/CategoryTree';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_PER_PAGE = 10;

function flattenTree(tree: Category[]): Category[] {
  const result: Category[] = [];
  function walk(nodes: Category[]) {
    for (const n of nodes) {
      result.push(n);
      if (n.children?.length) walk(n.children);
    }
  }
  walk(tree);
  return result;
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
      Inactive
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [selectedTreeId, setSelectedTreeId] = useState<number | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [presetParent, setPresetParent] = useState<Category | null>(null);

  // ── Data ──
  const { data: tree = [], isLoading: treeLoading } = useAdminCategoryTree();
  const { data: listData, isLoading: listLoading, isFetching } = useAdminCategories({
    search: debouncedSearch || undefined,
    page,
    per_page: perPage,
  });

  const createCategory = useAdminCreateCategory();
  const updateCategory = useAdminUpdateCategory();
  const deleteCategory = useAdminDeleteCategory();

  // Resolve list — handle both paginator shapes
  const categories: Category[] = Array.isArray(listData?.data)
    ? listData.data
    : (listData?.data?.data ?? []);
  const total: number = listData?.pagination?.total ?? listData?.data?.total ?? categories.length;
  const lastPage: number = listData?.pagination?.last_page ?? listData?.data?.last_page ?? Math.ceil(total / perPage);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  // Flat list for parent selector in modal
  const allFlat = flattenTree(tree);

  // ── Debounce search ──
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  }, []);

  // ── Open modal helpers ──
  function openCreate(parent?: Category) {
    setEditTarget(null);
    setPresetParent(parent ?? null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setPresetParent(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setPresetParent(null);
  }

  // ── Submit ──
  function handleSubmit(payload: CreateCategoryPayload) {
    const finalPayload = presetParent
      ? { ...payload, parent_id: presetParent.id }
      : payload;

    if (editTarget) {
      updateCategory.mutate(
        { id: editTarget.id, payload: finalPayload },
        {
          onSuccess: () => { toast.success('Category updated'); closeModal(); },
          onError: (e: any) => toast.error(e.response?.data?.message ?? 'Update failed'),
        },
      );
    } else {
      createCategory.mutate(finalPayload, {
        onSuccess: () => { toast.success('Category created'); closeModal(); },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Create failed'),
      });
    }
  }

  // ── Delete ──
  function handleDelete(cat: Category) {
    const hasChildren = (cat.children?.length ?? 0) > 0;
    const msg = hasChildren
      ? `"${cat.name}" has subcategories. Deleting it may also remove them. Continue?`
      : `Delete "${cat.name}"? This cannot be undone.`;
    if (!confirm(msg)) return;
    deleteCategory.mutate(cat.id, {
      onSuccess: () => toast.success('Category deleted'),
      onError: (e: any) => toast.error(e.response?.data?.message ?? 'Delete failed'),
    });
  }

  const isMutating = createCategory.isPending || updateCategory.isPending;

  // Build page number list with ellipsis markers (-1 = ellipsis)
  function buildPageNumbers(current: number, last: number): (number | -1)[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    const pages: (number | -1)[] = [1];
    if (current > 3) pages.push(-1);
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i);
    if (current < last - 2) pages.push(-1);
    pages.push(last);
    return pages;
  }
  const pageItems = buildPageNumbers(page, lastPage);

  return (
    <>
      <div className="flex gap-5 min-h-0">
        {/* ── Left: Category Tree ── */}
        <aside className="w-64 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col sticky top-0 self-start max-h-[calc(100vh-7rem)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Category Tree</h2>
            <button
              onClick={() => openCreate()}
              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Add top-level category"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {treeLoading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" style={{ marginLeft: `${(i % 3) * 12}px` }} />
                ))}
              </div>
            ) : (
              <CategoryTree
                tree={tree}
                selectedId={selectedTreeId}
                onSelect={setSelectedTreeId}
                onAddSub={(parent) => openCreate(parent)}
              />
            )}
          </div>
        </aside>

        {/* ── Right: Table ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => openCreate()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Parent</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Subcategories</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sort</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                  {listLoading ? (
                    Array.from({ length: perPage }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                            <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                          </div>
                        </td>
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                          </td>
                        ))}
                        <td className="px-5 py-4">
                          <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                          <RefreshCw className="w-8 h-8 opacity-30" />
                          <p className="text-sm">No categories found.</p>
                          <button
                            onClick={() => openCreate()}
                            className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                          >
                            Create your first category →
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => {
                      // Find parent name from flat tree
                      const parentName = cat.parent_id
                        ? allFlat.find((c) => c.id === cat.parent_id)?.name ?? `#${cat.parent_id}`
                        : null;
                      const subCount = cat.children?.length ?? 0;

                      return (
                        <tr
                          key={cat.id}
                          className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${
                            selectedTreeId === cat.id ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          {/* Name + icon */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 select-none">
                                {cat.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 leading-snug">{cat.name}</p>
                                {cat.description && (
                                  <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{cat.description}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Slug */}
                          <td className="px-4 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>

                          {/* Parent */}
                          <td className="px-4 py-4">
                            {parentName ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">
                                {parentName}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>

                          {/* Subcategory count */}
                          <td className="px-4 py-4">
                            {subCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                                {subCount} sub{subCount > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>

                          {/* Sort order */}
                          <td className="px-4 py-4 text-gray-500 text-xs">{cat.sort_order}</td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <StatusBadge active={cat.is_active} />
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openCreate(cat)}
                                title="Add subcategory"
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEdit(cat)}
                                title="Edit"
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(cat)}
                                title="Delete"
                                disabled={deleteCategory.isPending}
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

            {/* Pagination */}
            {!listLoading && total > 0 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400">
                    Showing {from}–{to} of{' '}
                    <span className="font-medium text-gray-600">{total.toLocaleString()} categories</span>
                  </p>
                  <select
                    value={perPage}
                    onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600 outline-none focus:ring-2 focus:ring-amber-200 cursor-pointer"
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>{n} / page</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="First page"
                  >
                    <ChevronLeft className="w-3 h-3" /><ChevronLeft className="w-3 h-3 -ml-1.5" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  {pageItems.map((n, idx) =>
                    n === -1 ? (
                      <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 select-none">
                        …
                      </span>
                    ) : (
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
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    disabled={page >= lastPage}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPage(lastPage)}
                    disabled={page >= lastPage}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Last page"
                  >
                    <ChevronRight className="w-3 h-3" /><ChevronRight className="w-3 h-3 -ml-1.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={isMutating}
        category={editTarget}
        allCategories={allFlat}
      />
    </>
  );
}
