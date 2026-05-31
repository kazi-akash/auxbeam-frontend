'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { ShippingClass } from './ShippingRateModal';

interface ClassPayload {
  name: string;
  description?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ClassPayload) => void;
  loading: boolean;
  shippingClass?: ShippingClass | null;
}

const EMPTY: ClassPayload = { name: '', description: '' };

export default function ShippingClassModal({
  open,
  onClose,
  onSubmit,
  loading,
  shippingClass,
}: Props) {
  const [form, setForm] = useState<ClassPayload>(EMPTY);

  useEffect(() => {
    if (open) {
      if (shippingClass) {
        setForm({
          name: shippingClass.name,
          description: shippingClass.description ?? '',
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, shippingClass]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {shippingClass ? 'Edit Shipping Class' : 'Add Shipping Class'}
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
              Class Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Heavy Equipment"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Short description of this shipping class..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none"
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
              {shippingClass ? 'Save Changes' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
