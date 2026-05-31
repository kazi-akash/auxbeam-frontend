'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Brand } from '@/lib/types/catalog';

export interface ProductModel {
  id: number;
  name: string;
  brand_id?: number | null;
  brand?: Pick<Brand, 'id' | 'name'> | null;
  is_active?: boolean;
  sort_order?: number;
  description?: string | null;
}

export interface ProductModelPayload {
  name: string;
  brand_id?: number | null;
  is_active?: boolean;
  sort_order?: number;
  description?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductModelPayload) => void;
  loading: boolean;
  model?: ProductModel | null;
  brands: Brand[];
}

const EMPTY: ProductModelPayload = {
  name: '',
  brand_id: null,
  is_active: true,
  sort_order: 0,
  description: '',
};

export default function ModelModal({ open, onClose, onSubmit, loading, model, brands }: Props) {
  const [form, setForm] = useState<ProductModelPayload>(EMPTY);

  useEffect(() => {
    if (open) {
      if (model) {
        setForm({
          name: model.name,
          brand_id: model.brand_id ?? null,
          is_active: model.is_active ?? true,
          sort_order: model.sort_order ?? 0,
          description: model.description ?? '',
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, model]);

  function set<K extends keyof ProductModelPayload>(key: K, value: ProductModelPayload[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload: ProductModelPayload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
      brand_id: Number(form.brand_id), // always a number — field is required by backend
    };
    onSubmit(payload);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {model ? 'Edit Model' : 'Add Model'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Model Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text" required value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. GX Series"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Brand <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={form.brand_id ?? ''}
              onChange={(e) => set('brand_id', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
            >
              <option value="" disabled>— Select a brand —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={3} value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Sort order + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sort Order</label>
              <input
                type="number" min={0} value={form.sort_order ?? 0}
                onChange={(e) => set('sort_order', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
              <select
                value={form.is_active ? 'active' : 'inactive'}
                onChange={(e) => set('is_active', e.target.value === 'active')}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {model ? 'Save Changes' : 'Create Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
