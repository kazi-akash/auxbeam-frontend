'use client';

import { useState } from 'react';
import {
  useAdminServices,
  useAdminCreateService,
  useAdminUpdateService,
  useAdminDeleteService,
  useAdminToggleService,
} from '@/lib/hooks/admin/useAdminServices';
import type { AdminService, CreateServicePayload, ServiceType } from '@/lib/types/admin';
import { Plus, Pencil, Trash2, ConciergeBell, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'react-toastify';
import ServiceModal from './_components/ServiceModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<ServiceType, string> = {
  home_service:   'Home Service',
  office_booking: 'Office Booking',
  home_delivery:  'Home Delivery',
  outlet_pickup:  'Outlet Pickup',
};

const TYPE_COLORS: Record<ServiceType, string> = {
  home_service:   'bg-purple-50 text-purple-700 border-purple-100',
  office_booking: 'bg-blue-50 text-blue-700 border-blue-100',
  home_delivery:  'bg-emerald-50 text-emerald-700 border-emerald-100',
  outlet_pickup:  'bg-amber-50 text-amber-700 border-amber-100',
};

function TypeBadge({ type }: { type: ServiceType }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${TYPE_COLORS[type]}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminService | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: services = [], isLoading } = useAdminServices();
  const createService = useAdminCreateService();
  const updateService = useAdminUpdateService();
  const deleteService = useAdminDeleteService();
  const toggleService = useAdminToggleService();

  function openCreate() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(service: AdminService) {
    setEditTarget(service);
    setModalOpen(true);
  }

  function handleModalSubmit(payload: CreateServicePayload) {
    if (editTarget) {
      updateService.mutate(
        { id: editTarget.id, payload },
        {
          onSuccess: () => {
            toast.success('Service updated.');
            setModalOpen(false);
          },
          onError: () => toast.error('Failed to update service.'),
        },
      );
    } else {
      createService.mutate(payload, {
        onSuccess: () => {
          toast.success('Service created.');
          setModalOpen(false);
        },
        onError: () => toast.error('Failed to create service.'),
      });
    }
  }

  function handleDelete(id: number) {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success('Service deleted.');
        setDeleteId(null);
      },
      onError: () => toast.error('Failed to delete service.'),
    });
  }

  function handleToggle(id: number) {
    toggleService.mutate(id, {
      onError: () => toast.error('Failed to toggle service.'),
    });
  }

  const isSubmitting = createService.isPending || updateService.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage service types that can be attached to products.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-40" />
                  <div className="h-3 bg-gray-100 rounded w-64" />
                </div>
                <div className="h-6 bg-gray-100 rounded-full w-24" />
                <div className="h-6 bg-gray-100 rounded-full w-16" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ConciergeBell className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No services yet</p>
            <p className="text-xs text-gray-400 mt-1">Click &ldquo;Add Service&rdquo; to create one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Scheduling</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{service.name}</p>
                    {service.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <TypeBadge type={service.type} />
                  </td>
                  <td className="px-4 py-4">
                    {service.requires_scheduling ? (
                      <span className="text-xs font-medium text-blue-600">Required</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge active={service.is_active} />
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs">{service.sort_order}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Toggle active */}
                      <button
                        onClick={() => handleToggle(service.id)}
                        title={service.is_active ? 'Deactivate' : 'Activate'}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        {service.is_active
                          ? <ToggleRight className="w-4.5 h-4.5" />
                          : <ToggleLeft className="w-4.5 h-4.5" />}
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(service)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Delete */}
                      {deleteId === service.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(service.id)}
                            disabled={deleteService.isPending}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-60"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(service.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <ServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={isSubmitting}
        initial={editTarget}
      />
    </div>
  );
}
