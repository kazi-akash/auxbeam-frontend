'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { AdminService, CreateServicePayload, ServiceType } from '@/lib/types/admin';

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: 'home_service',   label: 'Home Service'         },
  { value: 'office_booking', label: 'Booking for Office'   },
  { value: 'home_delivery',  label: 'Home Delivery'        },
  { value: 'outlet_pickup',  label: 'Outlet Pickup'        },
];

const INPUT   = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400';
const SELECT  = INPUT + ' bg-white';
const TEXTAREA = INPUT + ' resize-none';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateServicePayload) => void;
  loading: boolean;
  initial?: AdminService | null;
}

const EMPTY: CreateServicePayload = {
  name: '',
  description: '',
  type: 'home_delivery',
  requires_scheduling: false,
  is_active: true,
  sort_order: 0,
};

export default function ServiceModal({ open, onClose, onSubmit, loading, initial }: Props) {
  const [form, setForm] = useState<CreateServicePayload>(EMPTY);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        description: initial.description ?? '',
        type: initial.type,
        requires_scheduling: initial.requires_scheduling,
        is_active: initial.is_active,
        sort_order: initial.sort_order,
      });
    } else {
      setForm(EMPTY);
    }
  }, [initial, open]);

  if (!open) return null;

  function set<K extends keyof CreateServicePayload>(key: K, value: CreateServicePayload[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {initial ? 'Edit Service' : 'Create Service'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Home Service"
              className={INPUT}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Type <span className="text-red-400">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value as ServiceType)}
              className={SELECT}
            >
              {SERVICE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description of the service..."
              className={TEXTAREA}
            />
          </div>

          {/* Sort order */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sort Order</label>
            <input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => set('sort_order', Number(e.target.value))}
              className={INPUT}
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-2.5 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.requires_scheduling}
                onChange={(e) => set('requires_scheduling', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300"
              />
              <span className="text-sm text-gray-700">
                Requires scheduling (date &amp; time)
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
