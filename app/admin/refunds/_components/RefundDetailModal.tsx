'use client';

import { useState } from 'react';
import { X, Loader2, Play, XCircle, Package, User, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAdminProcessRefund, useAdminCancelRefund } from '@/lib/hooks/admin/useAdminReturnsRefunds';
import type { AdminRefund, RefundStatus } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RefundStatus, { label: string; cls: string }> = {
  pending:    { label: 'Pending',    cls: 'bg-amber-50  text-amber-600  border border-amber-100'  },
  processing: { label: 'Processing', cls: 'bg-blue-50   text-blue-600   border border-blue-100'   },
  completed:  { label: 'Completed',  cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  failed:     { label: 'Failed',     cls: 'bg-red-50    text-red-500    border border-red-100'    },
  cancelled:  { label: 'Cancelled',  cls: 'bg-gray-100  text-gray-500   border border-gray-200'   },
};

const METHOD_LABELS: Record<string, string> = {
  original_payment: 'Original Payment',
  store_credit:     'Store Credit',
  bank_transfer:    'Bank Transfer',
};

function StatusBadge({ status }: { status: RefundStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  refund: AdminRefund | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RefundDetailModal({ open, onClose, refund }: Props) {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  const processRefund = useAdminProcessRefund();
  const cancelRefund  = useAdminCancelRefund();

  if (!open || !refund) return null;

  const r = refund;

  function handleProcess() {
    if (!confirm('Process this refund? This will initiate the payment reversal.')) return;
    processRefund.mutate(r.id, {
      onSuccess: () => { toast.success('Refund processed successfully'); onClose(); },
      onError:   () => toast.error('Failed to process refund'),
    });
  }

  function handleCancel() {
    if (!cancelReason.trim()) { toast.error('Cancellation reason is required'); return; }
    cancelRefund.mutate(
      { id: r.id, payload: { reason: cancelReason } },
      {
        onSuccess: () => {
          toast.success('Refund cancelled');
          setShowCancelForm(false);
          setCancelReason('');
          onClose();
        },
        onError: () => toast.error('Failed to cancel refund'),
      }
    );
  }

  const isPending = r.status === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900">Refund #{r.id}</h2>
            <StatusBadge status={r.status} />
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Amount highlight */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Refund Amount</p>
              <p className="text-2xl font-bold text-gray-900">${Number(r.amount).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 capitalize">{r.refund_type} refund</p>
              <p className="text-xs text-gray-500">{METHOD_LABELS[r.refund_method] ?? r.refund_method}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Order */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Package className="w-3.5 h-3.5" /> Order
              </div>
              <p className="text-sm font-semibold text-gray-800">{r.order?.order_number ?? `#${r.order_id}`}</p>
              {r.order?.total_amount && (
                <p className="text-xs text-gray-500">Total: ${Number(r.order.total_amount).toFixed(2)}</p>
              )}
              {r.return_id && (
                <p className="text-xs text-gray-400">Return #{r.return_id}</p>
              )}
            </div>

            {/* Customer */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" /> Customer
              </div>
              <p className="text-sm font-semibold text-gray-800">{r.user?.full_name ?? '—'}</p>
              <p className="text-xs text-gray-500">{r.user?.email ?? '—'}</p>
            </div>
          </div>

          {/* Transaction ID */}
          {r.transaction_id && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</p>
                <p className="text-sm font-mono text-gray-700">{r.transaction_id}</p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {r.processed_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Processed {new Date(r.processed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Notes */}
          {r.notes && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">{r.notes}</p>
            </div>
          )}

          {/* Cancel form */}
          {showCancelForm && (
            <div className="border border-red-200 rounded-xl p-4 space-y-3 bg-red-50/50">
              <p className="text-sm font-semibold text-gray-800">Cancel Refund</p>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (required)..."
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition placeholder:text-gray-400 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={cancelRefund.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition"
                >
                  {cancelRefund.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Cancel
                </button>
                <button onClick={() => setShowCancelForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Close
          </button>

          {isPending && !showCancelForm && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCancelForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
              >
                <XCircle className="w-4 h-4" /> Cancel Refund
              </button>
              <button
                onClick={handleProcess}
                disabled={processRefund.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
              >
                {processRefund.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Process Refund
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
