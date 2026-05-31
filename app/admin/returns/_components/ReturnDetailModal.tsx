'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle, XCircle, RefreshCw, Package, User, Calendar, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminApproveReturn,
  useAdminRejectReturn,
  useAdminProcessReturn,
} from '@/lib/hooks/admin/useAdminReturnsRefunds';
import type { AdminReturn, ReturnStatus, ReturnReason } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReturnStatus, { label: string; cls: string }> = {
  requested: { label: 'Requested',  cls: 'bg-blue-50   text-blue-600   border border-blue-100'   },
  approved:  { label: 'Approved',   cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  rejected:  { label: 'Rejected',   cls: 'bg-red-50    text-red-500    border border-red-100'    },
  received:  { label: 'Received',   cls: 'bg-purple-50 text-purple-600 border border-purple-100' },
  processed: { label: 'Processed',  cls: 'bg-gray-100  text-gray-500   border border-gray-200'   },
};

const REASON_LABELS: Record<ReturnReason, string> = {
  defective:        'Defective / Damaged',
  wrong_item:       'Wrong Item Received',
  not_as_described: 'Not as Described',
  changed_mind:     'Changed Mind',
  other:            'Other',
};

function StatusBadge({ status }: { status: ReturnStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.requested;
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
  returnRequest: AdminReturn | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReturnDetailModal({ open, onClose, returnRequest }: Props) {
  const [rejectReason, setRejectReason] = useState('');
  const [approveNotes, setApproveNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);

  const approve  = useAdminApproveReturn();
  const reject   = useAdminRejectReturn();
  const process  = useAdminProcessReturn();

  if (!open || !returnRequest) return null;

  const r = returnRequest;
  const product = r.order_item?.product;
  const order   = r.order_item?.order;

  function handleApprove() {
    approve.mutate(
      { id: r.id, payload: { admin_notes: approveNotes || undefined } },
      {
        onSuccess: () => {
          toast.success('Return request approved');
          setShowApproveForm(false);
          setApproveNotes('');
          onClose();
        },
        onError: () => toast.error('Failed to approve return'),
      }
    );
  }

  function handleReject() {
    if (!rejectReason.trim()) { toast.error('Rejection reason is required'); return; }
    reject.mutate(
      { id: r.id, payload: { rejection_reason: rejectReason } },
      {
        onSuccess: () => {
          toast.success('Return request rejected');
          setShowRejectForm(false);
          setRejectReason('');
          onClose();
        },
        onError: () => toast.error('Failed to reject return'),
      }
    );
  }

  function handleProcess() {
    if (!confirm('Mark this return as processed and restore inventory?')) return;
    process.mutate(r.id, {
      onSuccess: () => { toast.success('Return processed — inventory restored'); onClose(); },
      onError:   () => toast.error('Failed to process return'),
    });
  }

  const isRequested = r.status === 'requested';
  const isApproved  = r.status === 'approved' || r.status === 'received';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900">Return #{r.id}</h2>
            <StatusBadge status={r.status} />
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Order */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Package className="w-3.5 h-3.5" /> Order
              </div>
              <p className="text-sm font-semibold text-gray-800">{order?.order_number ?? '—'}</p>
              <p className="text-xs text-gray-500">{product?.name ?? '—'}</p>
              {product?.sku && <p className="text-xs text-gray-400 font-mono">SKU: {product.sku}</p>}
              <p className="text-xs text-gray-500">Qty: <span className="font-medium text-gray-700">{r.quantity}</span></p>
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

          {/* Reason */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Return Reason</p>
            <p className="text-sm font-medium text-gray-800">{REASON_LABELS[r.reason] ?? r.reason}</p>
            {r.reason_details && (
              <p className="text-sm text-gray-600 leading-relaxed">{r.reason_details}</p>
            )}
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            Submitted {new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>

          {/* Admin notes (if any) */}
          {r.admin_notes && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" /> Admin Notes
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{r.admin_notes}</p>
            </div>
          )}

          {/* Linked refund */}
          {r.refund && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Linked Refund</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Refund #{r.refund.id}</span>
                <span className="text-sm font-semibold text-gray-800">${Number(r.refund.amount).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 capitalize">{r.refund.status} · {r.refund.refund_method.replace(/_/g, ' ')}</p>
            </div>
          )}

          {/* Approve form */}
          {showApproveForm && (
            <div className="border border-emerald-200 rounded-xl p-4 space-y-3 bg-emerald-50/50">
              <p className="text-sm font-semibold text-gray-800">Approve Return</p>
              <textarea
                rows={3}
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                placeholder="Optional notes for the customer..."
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={approve.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-60 transition"
                >
                  {approve.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Approve
                </button>
                <button onClick={() => setShowApproveForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reject form */}
          {showRejectForm && (
            <div className="border border-red-200 rounded-xl p-4 space-y-3 bg-red-50/50">
              <p className="text-sm font-semibold text-gray-800">Reject Return</p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (required)..."
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition placeholder:text-gray-400 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  disabled={reject.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition"
                >
                  {reject.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Reject
                </button>
                <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Cancel
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

          <div className="flex items-center gap-2">
            {isRequested && !showApproveForm && !showRejectForm && (
              <>
                <button
                  onClick={() => { setShowRejectForm(true); setShowApproveForm(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => { setShowApproveForm(true); setShowRejectForm(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              </>
            )}

            {isApproved && !showApproveForm && !showRejectForm && (
              <button
                onClick={handleProcess}
                disabled={process.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
              >
                {process.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Process Return
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
