'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Loader2, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminVariations,
  useAdminCreateVariation,
  useAdminUpdateVariation,
  useAdminDeleteVariation,
} from '@/lib/hooks/admin/useAdminVariations';
import VariationModal, { type VariationType } from './_components/VariationModal';
import OptionsPanel from './_components/OptionsPanel';
import type { CreateVariationTypePayload } from '@/lib/types/admin';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VariationWithOptions extends VariationType {
  options?: { id: number; value: string; label?: string | null; sort_order?: number; is_active?: boolean }[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminVariationsPage() {
  const { data: variations = [], isLoading } = useAdminVariations();

  const createVariation = useAdminCreateVariation();
  const updateVariation = useAdminUpdateVariation();
  const deleteVariation = useAdminDeleteVariation();

  const [modal, setModal] = useState<{ open: boolean; variation: VariationType | null }>({
    open: false,
    variation: null,
  });

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');

  // ── Handlers ──────────────────────────────────────────────────────────────

  function openCreate() {
    setModal({ open: true, variation: null });
  }

  function openEdit(v: VariationType) {
    setModal({ open: true, variation: v });
  }

  function closeModal() {
    setModal({ open: false, variation: null });
  }

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit(payload: CreateVariationTypePayload) {
    if (modal.variation) {
      updateVariation.mutate(
        { id: modal.variation.id, payload },
        {
          onSuccess: () => {
            toast.success('Variation updated');
            closeModal();
          },
          onError: () => toast.error('Failed to update variation'),
        },
      );
    } else {
      createVariation.mutate(payload, {
        onSuccess: () => {
          toast.success('Variation created');
          closeModal();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? 'Failed to create variation');
        },
      });
    }
  }

  function handleDelete(v: VariationType) {
    if (!confirm(`Delete variation type "${v.name}"? This cannot be undone.`)) return;
    deleteVariation.mutate(v.id, {
      onSuccess: () => toast.success('Variation deleted'),
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(msg ?? 'Cannot delete — remove all options first');
      },
    });
  }

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = (variations as VariationWithOptions[]).filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()),
  );

  const isMutating =
    createVariation.isPending || updateVariation.isPending || deleteVariation.isPending;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search variations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
          >
            <Plus className="w-4 h-4" />
            Add Variation
          </button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed">
        <strong>Variation types</strong> define the kind of attribute (e.g. Color, Size).
        Each type has <strong>options</strong> (e.g. Red, Blue, Small, Large) that are assigned
        to product variants.
      </div>

      {/* ── Variations list ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Variation Type
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4">
            Options
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4">
            Status
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-4 pr-1 text-right">
            Actions
          </span>
        </div>

        {isLoading ? (
          /* Skeleton */
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-3.5 w-8 bg-gray-100 rounded animate-pulse mx-4" />
                <div className="h-5 w-14 bg-gray-100 rounded-full animate-pulse mx-4" />
                <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            {search ? 'No variations match your search.' : 'No variation types yet.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((v) => {
              const isOpen = expanded.has(v.id);
              const optionCount = v.options?.length ?? 0;

              return (
                <div key={v.id}>
                  {/* Row */}
                  <div
                    className={`grid grid-cols-[1fr_auto_auto_auto] items-center px-5 py-3.5 hover:bg-gray-50/50 transition-colors ${
                      isOpen ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Name + expand toggle */}
                    <button
                      onClick={() => toggleExpand(v.id)}
                      className="flex items-center gap-2.5 text-left group"
                    >
                      <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                          {v.name}
                        </span>
                        {v.slug && (
                          <span className="ml-2 text-xs text-gray-400 font-mono">{v.slug}</span>
                        )}
                      </div>
                    </button>

                    {/* Option count */}
                    <div className="px-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                        {optionCount}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="px-4">
                      {v.is_active === false ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                          Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 pl-4">
                      <button
                        onClick={() => openEdit(v)}
                        disabled={isMutating}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors disabled:opacity-40"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(v)}
                        disabled={deleteVariation.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        {deleteVariation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded options panel */}
                  {isOpen && (
                    <OptionsPanel variationId={v.id} variationName={v.name} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Variation modal ── */}
      <VariationModal
        open={modal.open}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={createVariation.isPending || updateVariation.isPending}
        variation={modal.variation}
      />
    </div>
  );
}
