'use client';

import { useState, useCallback } from 'react';
import {
  useAdminBrands,
  useAdminCreateBrand,
  useAdminUpdateBrand,
  useAdminDeleteBrand,
} from '@/lib/hooks/admin/useAdminBrands';
import type { Brand } from '@/lib/types/catalog';
import type { CreateBrandPayload } from '@/lib/types/admin';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import BrandModal from './_components/BrandModal';

const PER_PAGE = 10;

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">Active</span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">Inactive</span>
  );
}

export default function AdminBrandsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => { setDebouncedSearch(val); setPage(1); }, 400);
  }, []);

  const { data, isLoading, isFetching } = useAdminBrands({
    search: debouncedSearch || undefined,
    page,
    per_page: PER_PAGE,
  });

  const createBrand = useAdminCreateBrand();
  const updateBrand = useAdminUpdateBrand();
  const deleteBrand = useAdminDeleteBrand();

  // Handle both paginator shapes
  const brands: Brand[] = Array.isArray(data?.data) ? data.data : (data?.data?.data ?? []);
  const total: number = data?.pagination?.total ?? data?.data?.total ?? brands.length;
  const lastPage: number = data?.pagination?.last_page ?? data?.data?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  function openCreate() { setEditTarget(null); setModalOpen(true); }
  function openEdit(b: Brand) { setEditTarget(b); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditTarget(null); }

  function handleSubmit(payload: CreateBrandPayload) {
    if (editTarget) {
      updateBrand.mutate({ id: editTarget.id, payload }, {
        onSuccess: () => { toast.success('Brand updated'); closeModal(); },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Update failed'),
      });
    } else {
      createBrand.mutate(payload, {
        onSuccess: () => { toast.success('Brand created'); closeModal(); },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Create failed'),
      });
    }
  }

  function handleDelete(b: Brand) {
    if (!confirm(`Delete brand "${b.name}"? This cannot be undone.`)) return;
    deleteBrand.mutate(b.id, {
      onSuccess: () => toast.success('Brand deleted'),
      onError: (e: any) => toast.error(e.response?.data?.message ?? 'Delete failed'),
    });
  }

  const isMutating = createBrand.isPending || updateBrand.isPending;

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) pageNumbers.push(i);

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search brands..." value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition">
            <Plus className="w-4 h-4" /> Add Brand
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Brand</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Website</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sort</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                {isLoading ? (
                  Array.from({ length: PER_PAGE }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse" />
                          <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </td>
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                      <td className="px-5 py-4"><div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <p className="text-sm">No brands found.</p>
                        <button onClick={openCreate} className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors">
                          Create your first brand →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr key={brand.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      {/* Brand name + avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 select-none">
                            {brand.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{brand.name}</p>
                            {brand.description && (
                              <p className="text-[11px] text-gray-400 truncate max-w-[200px]">{brand.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Slug */}
                      <td className="px-4 py-4 text-gray-500 font-mono text-xs">{brand.slug}</td>
                      {/* Website */}
                      <td className="px-4 py-4">
                        {brand.website ? (
                          <a href={brand.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            {brand.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      {/* Sort */}
                      <td className="px-4 py-4 text-gray-500 text-xs">{brand.sort_order}</td>
                      {/* Status */}
                      <td className="px-4 py-4"><StatusBadge active={brand.is_active} /></td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(brand)} title="Edit"
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(brand)} title="Delete"
                            disabled={deleteBrand.isPending}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40">
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

          {/* Pagination */}
          {!isLoading && total > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {from}–{to} of <span className="font-medium text-gray-600">{total.toLocaleString()} brands</span>
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                {pageNumbers.map((n) => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${n === page ? 'bg-amber-400 text-black border border-amber-400' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page >= lastPage}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BrandModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={isMutating}
        brand={editTarget}
      />
    </>
  );
}
