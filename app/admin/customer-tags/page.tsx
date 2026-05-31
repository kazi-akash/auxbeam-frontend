'use client';

import { useState } from 'react';
import { Plus, Tag, Edit2, Trash2, Users } from 'lucide-react';
import {
  useAdminCustomerTags,
  useAdminDeleteCustomerTag,
} from '@/lib/hooks/admin/useAdminCustomerTags';
import type { CustomerTag } from '@/lib/types/admin';
import TagFormModal from './_components/TagFormModal';
import TagCustomersModal from './_components/TagCustomersModal';

function fmt(n: number | undefined | null) {
  if (n == null) return '0';
  return n.toLocaleString();
}

export default function AdminCustomerTagsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CustomerTag | null>(null);
  const [viewTarget, setViewTarget] = useState<CustomerTag | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: tags, isLoading } = useAdminCustomerTags();
  const deleteTag = useAdminDeleteCustomerTag();

  function openCreate() { setEditTarget(null); setFormOpen(true); }
  function openEdit(t: CustomerTag) { setEditTarget(t); setFormOpen(true); }

  async function handleDelete(id: number) {
    await deleteTag.mutateAsync(id);
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customer Tags</h1>
          <p className="text-sm text-gray-400 mt-0.5">Label and categorize customers with custom tags</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition">
          <Plus className="w-4 h-4" /> New Tag
        </button>
      </div>

      {/* Tags grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
      ) : !tags || (tags as CustomerTag[]).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-3">
          <Tag className="w-10 h-10 text-gray-200" />
          <p className="text-sm text-gray-400">No tags yet.</p>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition">
            <Plus className="w-4 h-4" /> Create first tag
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(tags as CustomerTag[]).map((tag) => (
            <div key={tag.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {tag.color && <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />}
                  <span className="text-sm font-semibold text-gray-800">{tag.name}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  tag.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>{tag.is_active ? 'Active' : 'Off'}</span>
              </div>

              {tag.description && <p className="text-xs text-gray-400 line-clamp-2">{tag.description}</p>}

              <button onClick={() => setViewTarget(tag)}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                <Users className="w-3.5 h-3.5" />
                {fmt(tag.customers_count)} customers
              </button>

              <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                <button onClick={() => openEdit(tag)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                {deleteConfirm === tag.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(tag.id)} disabled={deleteTag.isPending}
                      className="px-2 py-1 text-[11px] font-semibold text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50">Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(tag.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <TagFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditTarget(null); }} tag={editTarget} />
      <TagCustomersModal open={!!viewTarget} onClose={() => setViewTarget(null)} tag={viewTarget} />
    </div>
  );
}
