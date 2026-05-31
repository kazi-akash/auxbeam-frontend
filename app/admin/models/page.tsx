'use client';

import { useState } from 'react';
import {
  useAdminProductModels,
  useAdminCreateProductModel,
  useAdminUpdateProductModel,
  useAdminDeleteProductModel,
} from '@/lib/hooks/admin/useAdminBrands';
import { useAdminBrands } from '@/lib/hooks/admin/useAdminBrands';
import type { Brand } from '@/lib/types/catalog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import ModelModal, { type ProductModel, type ProductModelPayload } from './_components/ModelModal';

const PER_PAGE = 10;

function StatusBadge({ active }: { active?: boolean }) {
  return active !== false ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">Active</span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">Inactive</span>
  );
}

export default function AdminModelsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProductModel | null>(null);

  const { data: modelsData, isLoading } = useAdminProductModels();
  const { data: brandsData } = useAdminBrands({ per_page: 100 });

  const createModel = useAdminCreateProductModel();
  const updateModel = useAdminUpdateProductModel();
  const deleteModel = useAdminDeleteProductModel();

  // Resolve models — handle both shapes
  const allModels: ProductModel[] = Array.isArray(modelsData?.data)
    ? modelsData.data
    : (modelsData?.data?.data ?? []);

  // Resolve brands for the modal dropdown
  const brands: Brand[] = Array.isArray(brandsData?.data)
    ? brandsData.data
    : (brandsData?.data?.data ?? []);

  // Client-side search filter (models endpoint may not support search param)
  const filtered = search.trim()
    ? allModels.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : allModels;

  function openCreate() { setEditTarget(null); setModalOpen(true); }
  function openEdit(m: ProductModel) { setEditTarget(m); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditTarget(null); }

  function handleSubmit(payload: ProductModelPayload) {
    if (editTarget) {
      updateModel.mutate({ id: editTarget.id, payload: payload as Record<string, unknown> }, {
        onSuccess: () => { toast.success('Model updated'); closeModal(); },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Update failed'),
      });
    } else {
      createModel.mutate(payload as Record<string, unknown>, {
        onSuccess: () => { toast.success('Model created'); closeModal(); },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Create failed'),
      });
    }
  }

  function handleDelete(m: ProductModel) {
    if (!confirm(`Delete model "${m.name}"? This cannot be undone.`)) return;
    deleteModel.mutate(m.id, {
      onSuccess: () => toast.success('Model deleted'),
      onError: (e: any) => toast.error(e.response?.data?.message ?? 'Delete failed'),
    });
  }

  const isMutating = createModel.isPending || updateModel.isPending;

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search models..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition">
            <Plus className="w-4 h-4" /> Add Model
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Model</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Brand</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sort</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse" />
                          <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </td>
                      {[...Array(3)].map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                      <td className="px-5 py-4"><div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <p className="text-sm">No models found.</p>
                        <button onClick={openCreate} className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors">
                          Create your first model →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((model) => {
                    const brandName = model.brand?.name
                      ?? brands.find((b) => b.id === model.brand_id)?.name
                      ?? null;

                    return (
                      <tr key={model.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        {/* Model name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 select-none">
                              {model.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{model.name}</p>
                              {model.description && (
                                <p className="text-[11px] text-gray-400 truncate max-w-[200px]">{model.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Brand */}
                        <td className="px-4 py-4">
                          {brandName ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">
                              {brandName}
                            </span>
                          ) : <span className="text-gray-400 text-xs">—</span>}
                        </td>
                        {/* Sort */}
                        <td className="px-4 py-4 text-gray-500 text-xs">{model.sort_order ?? 0}</td>
                        {/* Status */}
                        <td className="px-4 py-4"><StatusBadge active={model.is_active} /></td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(model)} title="Edit"
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(model)} title="Delete"
                              disabled={deleteModel.isPending}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40">
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

          {/* Count footer */}
          {!isLoading && filtered.length > 0 && (
            <div className="px-5 py-3.5 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filtered.length}</span> model{filtered.length !== 1 ? 's' : ''}
                {search && ` matching "${search}"`}
              </p>
            </div>
          )}
        </div>
      </div>

      <ModelModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={isMutating}
        model={editTarget}
        brands={brands}
      />
    </>
  );
}
