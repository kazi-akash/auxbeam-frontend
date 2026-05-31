'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAdminCreateRefund } from '@/lib/hooks/admin/useAdminReturnsRefunds';
import type { CreateRefundPayload, RefundMethod, RefundType } from '@/lib/types/admin';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY: CreateRefundPayload = {
  order_id: 0,
  return_id: null,
  amount: 0,
  refund_type: 'partial',
  refund_method: 'original_payment',
  reason: '',
};

export default function CreateRefundModal({ open, onClose }: Props) {
  const [form, setForm] = useState<CreateRefundPayload>(EMPTY);
  const createRefund = useAdminCreateRefund();

  function set<K extends keyof CreateRefundPayload>(key: K, value: CreateRefundPayload[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.order_id) { toast.error('Order ID is required'); return; }
    if (!form.amount || form.amount <= 0) { toast.error('Amount must be greater than 0'); return; }

    createRefund.mutate(
      { ...form, order_id: Number(form.order_id), amount: Number(form.amount) },
      {
        onSuccess: () => {
          toast.success('Refund created successfully');
          setForm(EMPTY);
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Failed to create refund';
          toast.error(msg);
        },
      }
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Create Refund</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Order ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Order ID <span className="text-red-400">*</span>
            </label>
            <input
              type="number" min={1} required
              value={form.order_id || ''}
              onChange={(e) => set('order_id', Number(e.target.value))}
              placeholder="e.g. 1042"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Return ID (optional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Return ID <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number" min={1}
              value={form.return_id ?? ''}
              onChange={(e) => set('return_id', e.target.value ? Number(e.target.value) : null)}
              placeholder="Link to a return request..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Amount ($) <span className="text-red-400">*</span>
            </label>
            <input
              type="number" min={0.01} step={0.01} required
              value={form.amount || ''}
              onChange={(e) => set('amount', Number(e.target.value))}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Refund type + method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Refund Type <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={form.refund_type}
                onChange={(e) => set('refund_type', e.target.value as RefundType)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                <option value="partial">Partial</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Refund Method <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={form.refund_method}
                onChange={(e) => set('refund_method', e.target.value as RefundMethod)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                <option value="original_payment">Original Payment</option>
                <option value="store_credit">Store Credit</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reason / Notes</label>
            <textarea
              rows={3}
              value={form.reason ?? ''}
              onChange={(e) => set('reason', e.target.value)}
              placeholder="Optional reason for this refund..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={createRefund.isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {createRefund.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Create Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
