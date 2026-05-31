'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ListPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminVariationOptions,
  useAdminCreateVariationOption,
  useAdminUpdateVariationOption,
  useAdminDeleteVariationOption,
  useAdminBulkCreateVariationOptions,
} from '@/lib/hooks/admin/useAdminVariations';
import OptionModal, { type VariationOption } from './OptionModal';
import BulkOptionsModal from './BulkOptionsModal';
import type { CreateVariationOptionPayload } from '@/lib/types/admin';

interface Props {
  variationId: number;
  variationName: string;
}

export default function OptionsPanel({ variationId, variationName }: Props) {
  const { data: options = [], isLoading } = useAdminVariationOptions(variationId);

  const createOption = useAdminCreateVariationOption();
  const updateOption = useAdminUpdateVariationOption();
  const deleteOption = useAdminDeleteVariationOption();
  const bulkCreate = useAdminBulkCreateVariationOptions();

  const [optionModal, setOptionModal] = useState<{
    open: boolean;
    option: VariationOption | null;
  }>({ open: false, option: null });

  const [bulkModal, setBulkModal] = useState(false);

  function openAdd() {
    setOptionModal({ open: true, option: null });
  }

  function openEdit(option: VariationOption) {
    setOptionModal({ open: true, option });
  }

  function closeOptionModal() {
    setOptionModal({ open: false, option: null });
  }

  function handleOptionSubmit(payload: CreateVariationOptionPayload) {
    if (optionModal.option) {
      updateOption.mutate(
        { variationId, optionId: optionModal.option.id, payload },
        {
          onSuccess: () => {
            toast.success('Option updated');
            closeOptionModal();
          },
          onError: () => toast.error('Failed to update option'),
        },
      );
    } else {
      createOption.mutate(
        { variationId, payload },
        {
          onSuccess: () => {
            toast.success('Option added');
            closeOptionModal();
          },
          onError: () => toast.error('Failed to add option'),
        },
      );
    }
  }

  function handleDelete(option: VariationOption) {
    if (!confirm(`Delete option "${option.value}"?`)) return;
    deleteOption.mutate(
      { variationId, optionId: option.id },
      {
        onSuccess: () => toast.success('Option deleted'),
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? 'Cannot delete — option may be in use');
        },
      },
    );
  }

  function handleBulkSubmit(values: string[]) {
    bulkCreate.mutate(
      {
        variationId,
        payload: { options: values.map((value) => ({ value })) },
      },
      {
        onSuccess: () => {
          toast.success(`${values.length} options added`);
          setBulkModal(false);
        },
        onError: () => toast.error('Failed to bulk add options'),
      },
    );
  }

  const isMutating =
    createOption.isPending || updateOption.isPending || deleteOption.isPending;

  return (
    <div className="px-5 pb-4 pt-1">
      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        {/* Options header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Options
            {!isLoading && (
              <span className="ml-2 text-gray-400 font-normal normal-case">
                ({options.length})
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <ListPlus className="w-3.5 h-3.5" />
              Bulk Add
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Option
            </button>
          </div>
        </div>

        {/* Options list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
          </div>
        ) : options.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">No options yet.</p>
            <p className="text-xs text-gray-300 mt-1">
              Add options like &quot;Red&quot;, &quot;Small&quot;, etc.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(options as VariationOption[]).map((opt) => (
              <div
                key={opt.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Color swatch if value looks like a hex color */}
                  {/^#[0-9a-f]{3,6}$/i.test(opt.value) && (
                    <span
                      className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                      style={{ backgroundColor: opt.value }}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-800">{opt.value}</span>
                  {opt.label && opt.label !== opt.value && (
                    <span className="text-xs text-gray-400">({opt.label})</span>
                  )}
                  {opt.sort_order !== undefined && opt.sort_order !== null && (
                    <span className="text-[11px] text-gray-300 font-mono">#{opt.sort_order}</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Active badge */}
                  {opt.is_active === false && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-400 rounded-full mr-1">
                      Inactive
                    </span>
                  )}
                  <button
                    onClick={() => openEdit(opt)}
                    disabled={isMutating}
                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors disabled:opacity-40"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(opt)}
                    disabled={deleteOption.isPending}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Option modal */}
      <OptionModal
        open={optionModal.open}
        onClose={closeOptionModal}
        onSubmit={handleOptionSubmit}
        loading={createOption.isPending || updateOption.isPending}
        option={optionModal.option}
        variationName={variationName}
      />

      {/* Bulk modal */}
      <BulkOptionsModal
        open={bulkModal}
        onClose={() => setBulkModal(false)}
        onSubmit={handleBulkSubmit}
        loading={bulkCreate.isPending}
        variationName={variationName}
      />
    </div>
  );
}
