'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CreateVariationTypePayload } from '@/lib/types/admin';

export interface VariationType {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  is_active?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVariationTypePayload) => void;
  loading: boolean;
  variation?: VariationType | null;
}

const EMPTY: CreateVariationTypePayload = {
  name: '',
  slug: '',
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function VariationModal({ open, onClose, onSubmit, loading, variation }: Props) {
  const [form, setForm] = useState<CreateVariationTypePayload>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open) {
      if (variation) {
        setForm({ name: variation.name, slug: variation.slug ?? '' });
        setSlugTouched(true);
      } else {
        setForm(EMPTY);
        setSlugTouched(false);
      }
    }
  }, [open, variation]);

  function set<K extends keyof CreateVariationTypePayload>(
    key: K,
    value: CreateVariationTypePayload[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleNameChange(name: string) {
    set('name', name);
    if (!slugTouched) set('slug', toSlug(name));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {variation ? 'Edit Variation Type' : 'Add Variation Type'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
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
              type="text"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Color, Size, Material"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug</label>
            <input
              type="text"
              value={form.slug ?? ''}
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', e.target.value);
              }}
              placeholder="auto-generated"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 font-mono"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Used internally to identify this variation type.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {variation ? 'Save Changes' : 'Create Variation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
