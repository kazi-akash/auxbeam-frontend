'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CreateVariationOptionPayload } from '@/lib/types/admin';

export interface VariationOption {
  id: number;
  value: string;
  label?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVariationOptionPayload) => void;
  loading: boolean;
  option?: VariationOption | null;
  variationName: string;
}

const EMPTY: CreateVariationOptionPayload = {
  value: '',
  sort_order: 0,
};

export default function OptionModal({
  open,
  onClose,
  onSubmit,
  loading,
  option,
  variationName,
}: Props) {
  const [form, setForm] = useState<CreateVariationOptionPayload>(EMPTY);

  useEffect(() => {
    if (open) {
      if (option) {
        setForm({
          value: option.value,
          sort_order: option.sort_order ?? 0,
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, option]);

  function set<K extends keyof CreateVariationOptionPayload>(
    key: K,
    value: CreateVariationOptionPayload[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ ...form, sort_order: Number(form.sort_order) || 0 });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {option ? 'Edit Option' : 'Add Option'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Variation: <span className="font-medium text-gray-600">{variationName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Value */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Value <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.value}
              onChange={(e) => set('value', e.target.value)}
              placeholder="e.g. Red, Small, Cotton"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sort Order</label>
            <input
              type="number"
              min={0}
              value={form.sort_order ?? 0}
              onChange={(e) => set('sort_order', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
            />
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
              {option ? 'Save Changes' : 'Add Option'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
