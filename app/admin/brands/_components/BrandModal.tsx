'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Brand } from '@/lib/types/catalog';
import type { CreateBrandPayload } from '@/lib/types/admin';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBrandPayload) => void;
  loading: boolean;
  brand?: Brand | null;
}

const EMPTY: CreateBrandPayload = {
  name: '',
  slug: '',
  description: '',
  website: '',
  is_active: true,
  sort_order: 0,
  meta_title: '',
  meta_description: '',
};

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function BrandModal({ open, onClose, onSubmit, loading, brand }: Props) {
  const [form, setForm] = useState<CreateBrandPayload>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open) {
      if (brand) {
        setForm({
          name: brand.name,
          slug: brand.slug,
          description: brand.description ?? '',
          website: brand.website ?? '',
          is_active: brand.is_active,
          sort_order: brand.sort_order,
          meta_title: '',
          meta_description: '',
        });
        setSlugTouched(true);
      } else {
        setForm(EMPTY);
        setSlugTouched(false);
      }
    }
  }, [open, brand]);

  function set<K extends keyof CreateBrandPayload>(key: K, value: CreateBrandPayload[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleNameChange(name: string) {
    set('name', name);
    if (!slugTouched) set('slug', toSlug(name));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ ...form, sort_order: Number(form.sort_order) || 0 });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {brand ? 'Edit Brand' : 'Add Brand'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text" required value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Auxbeam"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug</label>
            <input
              type="text" value={form.slug}
              onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }}
              placeholder="auto-generated"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 font-mono"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Website</label>
            <input
              type="url" value={form.website ?? ''}
              onChange={(e) => set('website', e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={3} value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short brand description..."
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

          {/* SEO */}
          <details className="group">
            <summary className="text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700 transition-colors list-none flex items-center gap-1">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              SEO (optional)
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Meta Title</label>
                <input type="text" value={form.meta_title ?? ''} onChange={(e) => set('meta_title', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Meta Description</label>
                <textarea rows={2} value={form.meta_description ?? ''} onChange={(e) => set('meta_description', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition resize-none" />
              </div>
            </div>
          </details>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {brand ? 'Save Changes' : 'Create Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
