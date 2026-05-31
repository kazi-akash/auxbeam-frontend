'use client';

import { useState } from 'react';
import {
  X,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  User,
  Package,
  Calendar,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminApproveReview,
  useAdminRejectReview,
  useAdminRespondToReview,
  useAdminDeleteReview,
} from '@/lib/hooks/admin/useAdminReviews';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface AdminReview {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  helpful_count: number;
  admin_response: string | null;
  created_at: string;
  user?: { id: number; first_name: string; last_name: string; email: string };
  product?: { id: number; name: string; slug: string };
}

interface Props {
  open: boolean;
  onClose: () => void;
  review: AdminReview;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReviewStatus, { label: string; cls: string }> = {
  pending:  { label: 'Pending',  cls: 'bg-amber-50  text-amber-600  border border-amber-100'  },
  approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  rejected: { label: 'Rejected', cls: 'bg-red-50    text-red-500    border border-red-100'    },
};

function StatusBadge({ status }: { status: ReviewStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-none text-gray-200'}`}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewDetailModal({ open, onClose, review }: Props) {
  const [responseText, setResponseText] = useState(review.admin_response ?? '');
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const approve  = useAdminApproveReview();
  const reject   = useAdminRejectReview();
  const respond  = useAdminRespondToReview();
  const destroy  = useAdminDeleteReview();

  if (!open) return null;

  const r = review;
  const customerName = r.user ? `${r.user.first_name} ${r.user.last_name}` : 'Unknown';

  function handleApprove() {
    approve.mutate(r.id, {
      onSuccess: () => {
        toast.success('Review approved and published');
        onClose();
      },
      onError: () => toast.error('Failed to approve review'),
    });
  }

  function handleReject() {
    reject.mutate(r.id, {
      onSuccess: () => {
        toast.success('Review rejected');
        onClose();
      },
      onError: () => toast.error('Failed to reject review'),
    });
  }

  function handleRespond() {
    if (!responseText.trim()) { toast.error('Response cannot be empty'); return; }
    respond.mutate(
      { id: r.id, payload: { response: responseText } },
      {
        onSuccess: () => {
          toast.success('Response saved');
          setShowResponseForm(false);
        },
        onError: () => toast.error('Failed to save response'),
      }
    );
  }

  function handleDelete() {
    destroy.mutate(r.id, {
      onSuccess: () => {
        toast.success('Review deleted');
        onClose();
      },
      onError: () => toast.error('Failed to delete review'),
    });
  }

  const isPending  = r.status === 'pending';
  const isApproved = r.status === 'approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900">Review #{r.id}</h2>
            <StatusBadge status={r.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Customer */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" /> Customer
              </div>
              <p className="text-sm font-semibold text-gray-800">{customerName}</p>
              <p className="text-xs text-gray-500">{r.user?.email ?? '—'}</p>
            </div>

            {/* Product */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Package className="w-3.5 h-3.5" /> Product
              </div>
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                {r.product?.name ?? '—'}
              </p>
            </div>
          </div>

          {/* Rating & date */}
          <div className="flex items-center justify-between">
            <StarRow rating={r.rating} />
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(r.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </div>
          </div>

          {/* Review content */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
            {r.title && (
              <p className="text-sm font-semibold text-gray-900">{r.title}</p>
            )}
            <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              {r.helpful_count} people found this helpful
            </div>
          </div>

          {/* Existing admin response */}
          {r.admin_response && !showResponseForm && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Admin Response
                </p>
                {isApproved && (
                  <button
                    onClick={() => setShowResponseForm(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{r.admin_response}</p>
            </div>
          )}

          {/* Response form */}
          {showResponseForm && (
            <div className="border border-blue-200 rounded-xl p-4 space-y-3 bg-blue-50/50">
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                {r.admin_response ? 'Edit Response' : 'Add Response'}
              </p>
              <textarea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                maxLength={1000}
                placeholder="Write a public response to this review..."
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none bg-white"
              />
              <p className="text-xs text-gray-400 text-right">{responseText.length}/1000</p>
              <div className="flex gap-2">
                <button
                  onClick={handleRespond}
                  disabled={respond.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-60 transition"
                >
                  {respond.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Response
                </button>
                <button
                  onClick={() => { setShowResponseForm(false); setResponseText(r.admin_response ?? ''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Delete confirm */}
          {showDeleteConfirm && (
            <div className="border border-red-200 rounded-xl p-4 space-y-3 bg-red-50/50">
              <p className="text-sm font-semibold text-gray-800">Delete this review?</p>
              <p className="text-xs text-gray-500">This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={destroy.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition"
                >
                  {destroy.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
            {!showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Respond button (approved reviews) */}
            {isApproved && !showResponseForm && !r.admin_response && (
              <button
                onClick={() => setShowResponseForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
              >
                <MessageSquare className="w-4 h-4" /> Respond
              </button>
            )}

            {/* Approve / Reject (pending reviews) */}
            {isPending && !showResponseForm && !showDeleteConfirm && (
              <>
                <button
                  onClick={handleReject}
                  disabled={reject.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 disabled:opacity-60 transition"
                >
                  {reject.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <XCircle className="w-4 h-4" />}
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approve.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 disabled:opacity-60 transition"
                >
                  {approve.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CheckCircle className="w-4 h-4" />}
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
