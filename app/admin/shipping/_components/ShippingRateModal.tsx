'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CreateShippingRatePayload } from '@/lib/types/admin';

export interface ShippingRate {
  id: number;
  name: string;
  method: string;
  shipping_class_id: number | null;
  shipping_class?: { id: number; name: string } | null;
  country: string | null;
  delivery_time: string | null;
  free_shipping_min_order: string | null;
  base_cost: string;
  is_active: boolean;
}

export interface ShippingClass {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateShippingRatePayload) => void;
  loading: boolean;
  rate?: ShippingRate | null;
  shippingClasses: ShippingClass[];
}

const EMPTY: CreateShippingRatePayload = {
  name: '',
  method: 'pathao_courier',
  shipping_class_id: null,
  country: 'Bangladesh',
  delivery_time: '',
  free_shipping_min_order: null,
  base_cost: 0,
  is_active: true,
};

const METHOD_OPTIONS = [
  { value: 'pathao_courier', label: 'Pathao Courier' },
  { value: 'auxbeam_team', label: 'Auxbeam Team Delivery' },
];

export default function ShippingRateModal({
  open,
  onClose,
  onSubmit,
  loading,
  rate,
  shippingClasses,
}: Props) {
  const [form, setForm] = useState<CreateShippingRatePayload>(EMPTY);

  useEffect(() => {
    if (open) {
      if (rate) {
        setForm({
          name: rate.name,
          method: rate.method,
          shipping_class_id: rate.shipping_class_id ?? null,
          country: rate.country ?? 'Bangladesh',
          delivery_time: rate.delivery_time ?? '',
          free_shipping_min_order: rate.free_shipping_min_order
            ? parseFloat(rate.free_shipping_min_order)
            : null,
          base_cost: parseFloat(rate.base_cost),
          is_active: rate.is_active,
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, rate]);

  function set<K extends keyof CreateShippingRatePayload>(
    key: K,
    value: CreateShippingRatePayload[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      base_cost: Number(form.base_cost),
      free_shipping_min_order: form.free_shipping_min_order
        ? Number(form.free_shipping_min_order)
        : null,
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {rate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
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
              Rate Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Pathao Standard Dhaka"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Shipping Method <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={form.method}
              onChange={(e) => set('method', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
            >
              {METHOD_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Shipping Class */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Shipping Class{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              value={form.shipping_class_id ?? ''}
              onChange={(e) =>
                set('shipping_class_id', e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
            >
              <option value="">— All products (no class) —</option>
              {shippingClasses.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Base Cost + Free Shipping Threshold */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Base Cost (BDT) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={form.base_cost}
                onChange={(e) => set('base_cost', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Free Shipping Min (BDT)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.free_shipping_min_order ?? ''}
                onChange={(e) =>
                  set(
                    'free_shipping_min_order',
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
                placeholder="e.g. 3000"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Delivery Time + Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Delivery Time
              </label>
              <input
                type="text"
                value={form.delivery_time ?? ''}
                onChange={(e) => set('delivery_time', e.target.value)}
                placeholder="e.g. 2-3 business days"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={form.country ?? ''}
                onChange={(e) => set('country', e.target.value)}
                placeholder="Bangladesh"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Status */}
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
              {rate ? 'Save Changes' : 'Create Rate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
