'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Truck, Package, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminShippingRates,
  useAdminCreateShippingRate,
  useAdminUpdateShippingRate,
  useAdminDeleteShippingRate,
  useAdminShippingClasses,
  useAdminCreateShippingClass,
  useAdminUpdateShippingClass,
  useAdminDeleteShippingClass,
} from '@/lib/hooks/admin/useAdminShipping';
import type { CreateShippingRatePayload } from '@/lib/types/admin';
import ShippingRateModal, {
  type ShippingRate,
  type ShippingClass,
} from './_components/ShippingRateModal';
import ShippingClassModal from './_components/ShippingClassModal';

type Tab = 'rates' | 'classes';

const METHOD_LABELS: Record<string, { label: string; color: string }> = {
  pathao_courier: {
    label: 'Pathao Courier',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  auxbeam_team: {
    label: 'Auxbeam Team',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  standard: {
    label: 'Standard',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
      Inactive
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const config = METHOD_LABELS[method] ?? {
    label: method,
    color: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.color}`}
    >
      {config.label}
    </span>
  );
}

export default function AdminShippingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('rates');

  // ── Rates state ──────────────────────────────────────────────────────────────
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [editRate, setEditRate] = useState<ShippingRate | null>(null);

  // ── Classes state ─────────────────────────────────────────────────────────────
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editClass, setEditClass] = useState<ShippingClass | null>(null);

  // ── Queries ───────────────────────────────────────────────────────────────────
  const { data: ratesData, isLoading: ratesLoading } = useAdminShippingRates();
  const { data: classesData, isLoading: classesLoading } = useAdminShippingClasses();

  const createRate = useAdminCreateShippingRate();
  const updateRate = useAdminUpdateShippingRate();
  const deleteRate = useAdminDeleteShippingRate();

  const createClass = useAdminCreateShippingClass();
  const updateClass = useAdminUpdateShippingClass();
  const deleteClass = useAdminDeleteShippingClass();

  // Normalise API shapes
  const rates: ShippingRate[] = Array.isArray(ratesData?.data)
    ? ratesData.data
    : (ratesData?.data?.data ?? []);

  const shippingClasses: ShippingClass[] = Array.isArray(classesData?.data)
    ? classesData.data
    : [];

  // ── Rate handlers ─────────────────────────────────────────────────────────────
  function handleRateSubmit(payload: CreateShippingRatePayload) {
    if (editRate) {
      updateRate.mutate(
        { id: editRate.id, payload },
        {
          onSuccess: () => {
            toast.success('Shipping rate updated');
            setRateModalOpen(false);
            setEditRate(null);
          },
          onError: (e: any) =>
            toast.error(e.response?.data?.message ?? 'Update failed'),
        },
      );
    } else {
      createRate.mutate(payload, {
        onSuccess: () => {
          toast.success('Shipping rate created');
          setRateModalOpen(false);
        },
        onError: (e: any) =>
          toast.error(e.response?.data?.message ?? 'Create failed'),
      });
    }
  }

  function handleDeleteRate(rate: ShippingRate) {
    if (!confirm(`Delete shipping rate "${rate.name}"? This cannot be undone.`)) return;
    deleteRate.mutate(rate.id, {
      onSuccess: () => toast.success('Shipping rate deleted'),
      onError: (e: any) =>
        toast.error(e.response?.data?.message ?? 'Delete failed'),
    });
  }

  // ── Class handlers ────────────────────────────────────────────────────────────
  function handleClassSubmit(payload: { name: string; description?: string }) {
    if (editClass) {
      updateClass.mutate(
        { id: editClass.id, payload },
        {
          onSuccess: () => {
            toast.success('Shipping class updated');
            setClassModalOpen(false);
            setEditClass(null);
          },
          onError: (e: any) =>
            toast.error(e.response?.data?.message ?? 'Update failed'),
        },
      );
    } else {
      createClass.mutate(payload, {
        onSuccess: () => {
          toast.success('Shipping class created');
          setClassModalOpen(false);
        },
        onError: (e: any) =>
          toast.error(e.response?.data?.message ?? 'Create failed'),
      });
    }
  }

  function handleDeleteClass(sc: ShippingClass) {
    if (!confirm(`Delete shipping class "${sc.name}"? This cannot be undone.`)) return;
    deleteClass.mutate(sc.id, {
      onSuccess: () => toast.success('Shipping class deleted'),
      onError: (e: any) =>
        toast.error(e.response?.data?.message ?? 'Delete failed'),
    });
  }

  const isRateMutating = createRate.isPending || updateRate.isPending;
  const isClassMutating = createClass.isPending || updateClass.isPending;

  return (
    <>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shipping</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage shipping rates and product shipping classes
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Truck,
              label: 'Total Rates',
              value: rates.length,
              color: 'text-blue-500 bg-blue-50',
            },
            {
              icon: Package,
              label: 'Shipping Classes',
              value: shippingClasses.length,
              color: 'text-purple-500 bg-purple-50',
            },
            {
              icon: DollarSign,
              label: 'Active Rates',
              value: rates.filter((r) => r.is_active).length,
              color: 'text-emerald-500 bg-emerald-50',
            },
            {
              icon: Clock,
              label: 'Inactive Rates',
              value: rates.filter((r) => !r.is_active).length,
              color: 'text-gray-400 bg-gray-100',
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {(
            [
              { key: 'rates', label: 'Shipping Rates' },
              { key: 'classes', label: 'Shipping Classes' },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Shipping Rates Tab ─────────────────────────────────────────────── */}
        {activeTab === 'rates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {rates.length} rate{rates.length !== 1 ? 's' : ''} configured
              </p>
              <button
                onClick={() => {
                  setEditRate(null);
                  setRateModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
              >
                <Plus className="w-4 h-4" /> Add Rate
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Rate Name
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Shipping Class
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Base Cost
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Free Shipping Min
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Delivery Time
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratesLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          {Array.from({ length: 8 }).map((_, j) => (
                            <td key={j} className="px-4 py-4">
                              <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : rates.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <Truck className="w-10 h-10 text-gray-200" />
                            <p className="text-sm">No shipping rates configured yet.</p>
                            <button
                              onClick={() => {
                                setEditRate(null);
                                setRateModalOpen(true);
                              }}
                              className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                            >
                              Add your first shipping rate →
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      rates.map((rate) => (
                        <tr
                          key={rate.id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">{rate.name}</p>
                            {rate.country && (
                              <p className="text-[11px] text-gray-400">{rate.country}</p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <MethodBadge method={rate.method} />
                          </td>
                          <td className="px-4 py-4 text-gray-500 text-xs">
                            {rate.shipping_class?.name ?? (
                              <span className="text-gray-300">All products</span>
                            )}
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            ৳{parseFloat(rate.base_cost).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-gray-500 text-xs">
                            {rate.free_shipping_min_order ? (
                              <span className="text-emerald-600 font-medium">
                                ৳{parseFloat(rate.free_shipping_min_order).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-gray-500 text-xs">
                            {rate.delivery_time ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge active={rate.is_active} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditRate(rate);
                                  setRateModalOpen(true);
                                }}
                                title="Edit"
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRate(rate)}
                                title="Delete"
                                disabled={deleteRate.isPending}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Shipping Classes Tab ───────────────────────────────────────────── */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {shippingClasses.length} class{shippingClasses.length !== 1 ? 'es' : ''}{' '}
                configured
              </p>
              <button
                onClick={() => {
                  setEditClass(null);
                  setClassModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
              >
                <Plus className="w-4 h-4" /> Add Class
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Class Name
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classesLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          {Array.from({ length: 4 }).map((_, j) => (
                            <td key={j} className="px-4 py-4">
                              <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : shippingClasses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <Package className="w-10 h-10 text-gray-200" />
                            <p className="text-sm">No shipping classes defined yet.</p>
                            <button
                              onClick={() => {
                                setEditClass(null);
                                setClassModalOpen(true);
                              }}
                              className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                            >
                              Create your first shipping class →
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      shippingClasses.map((sc) => (
                        <tr
                          key={sc.id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                                {sc.name.slice(0, 2).toUpperCase()}
                              </div>
                              <p className="font-medium text-gray-800">{sc.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-500 font-mono text-xs">
                            {sc.slug}
                          </td>
                          <td className="px-4 py-4 text-gray-500 text-xs max-w-xs truncate">
                            {sc.description ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditClass(sc);
                                  setClassModalOpen(true);
                                }}
                                title="Edit"
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClass(sc)}
                                title="Delete"
                                disabled={deleteClass.isPending}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">What are shipping classes?</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                Shipping classes group products with similar shipping requirements (e.g. "Heavy
                Equipment", "Fragile Items"). You can then assign different shipping rates per
                class so heavy products get the right carrier automatically.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ShippingRateModal
        open={rateModalOpen}
        onClose={() => {
          setRateModalOpen(false);
          setEditRate(null);
        }}
        onSubmit={handleRateSubmit}
        loading={isRateMutating}
        rate={editRate}
        shippingClasses={shippingClasses}
      />

      <ShippingClassModal
        open={classModalOpen}
        onClose={() => {
          setClassModalOpen(false);
          setEditClass(null);
        }}
        onSubmit={handleClassSubmit}
        loading={isClassMutating}
        shippingClass={editClass}
      />
    </>
  );
}
