'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import type { AdminService, ServiceType } from '@/lib/types/admin';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LocalProductService {
  service_id: number;
  name: string;
  type: ServiceType;
  price: string;          // string for controlled input
  is_required: boolean;
  is_active: boolean;
  conditions: string;
}

interface Props {
  services: LocalProductService[];        // current list for this product
  availableServices: AdminService[];      // all global services admin can pick from
  onChange: (services: LocalProductService[]) => void;
}

const TYPE_LABELS: Record<ServiceType, string> = {
  home_service:   'Home Service',
  office_booking: 'Office Booking',
  home_delivery:  'Home Delivery',
  outlet_pickup:  'Outlet Pickup',
};

const TYPE_COLORS: Record<ServiceType, string> = {
  home_service:   'bg-purple-50 text-purple-700',
  office_booking: 'bg-blue-50 text-blue-700',
  home_delivery:  'bg-emerald-50 text-emerald-700',
  outlet_pickup:  'bg-amber-50 text-amber-700',
};

const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400';

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductServicesPanel({ services, availableServices, onChange }: Props) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  // IDs already attached to this product
  const attachedIds = new Set(services.map((s) => s.service_id));

  // Services the admin can still add (not already attached)
  const unattached = availableServices.filter((s) => s.is_active && !attachedIds.has(s.id));

  function addService() {
    const id = Number(selectedServiceId);
    if (!id) return;
    const svc = availableServices.find((s) => s.id === id);
    if (!svc) return;

    onChange([
      ...services,
      {
        service_id:  svc.id,
        name:        svc.name,
        type:        svc.type,
        price:       '0',
        is_required: false,
        is_active:   true,
        conditions:  '',
      },
    ]);
    setSelectedServiceId('');
  }

  function updateRow(index: number, patch: Partial<LocalProductService>) {
    onChange(services.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeRow(index: number) {
    onChange(services.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {/* Add row */}
      <div className="flex items-center gap-2">
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 bg-white transition"
        >
          <option value="">— Select a service to add —</option>
          {unattached.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({TYPE_LABELS[s.type]})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addService}
          disabled={!selectedServiceId}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {availableServices.length === 0 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          No services defined yet. Go to{' '}
          <a href="/admin/services" className="underline font-medium" target="_blank" rel="noreferrer">
            Services
          </a>{' '}
          to create some first.
        </div>
      )}

      {/* Attached services list */}
      {services.length > 0 && (
        <div className="space-y-3">
          {services.map((svc, i) => (
            <div
              key={svc.service_id}
              className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50"
            >
              {/* Row header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_COLORS[svc.type]}`}>
                    {TYPE_LABELS[svc.type]}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{svc.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-3">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Service Price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={svc.price}
                    onChange={(e) => updateRow(i, { price: e.target.value })}
                    placeholder="0.00"
                    className={INPUT}
                  />
                </div>

                {/* Conditions */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Conditions / Notes
                  </label>
                  <input
                    type="text"
                    value={svc.conditions}
                    onChange={(e) => updateRow(i, { conditions: e.target.value })}
                    placeholder="e.g. Available in Dhaka only"
                    className={INPUT}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={svc.is_required}
                    onChange={(e) => updateRow(i, { is_required: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300"
                  />
                  <span className="text-sm text-gray-700">Required (customer must select)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={svc.is_active}
                    onChange={(e) => updateRow(i, { is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300"
                  />
                  <span className="text-sm text-gray-700">Active on this product</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 && availableServices.length > 0 && (
        <p className="text-xs text-gray-400 text-center py-4">
          No services attached to this product yet.
        </p>
      )}
    </div>
  );
}
