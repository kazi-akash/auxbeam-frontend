'use client';

import { useState } from 'react';
import {
  X,
  Loader2,
  Send,
  Pencil,
  Trash2,
  BarChart2,
  Users,
  Mail,
  MousePointerClick,
  Eye,
  Calendar,
  Tag,
  Target,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminSendCampaign,
  useAdminDeleteCampaign,
  useAdminCampaignStatistics,
} from '@/lib/hooks/admin/useAdminCampaigns';
import type { AdminCampaign, CampaignStatus, CampaignType } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CampaignStatus, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100   text-gray-500   border border-gray-200'   },
  scheduled: { label: 'Scheduled', cls: 'bg-blue-50    text-blue-600   border border-blue-100'   },
  sending:   { label: 'Sending',   cls: 'bg-amber-50   text-amber-600  border border-amber-100'  },
  sent:      { label: 'Sent',      cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50     text-red-500    border border-red-100'    },
};

const TYPE_LABELS: Record<CampaignType, string> = {
  promotional:   'Promotional',
  newsletter:    'Newsletter',
  abandoned_cart: 'Abandoned Cart',
  order_update:  'Order Update',
};

function StatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-1">
      <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${color}`}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  campaign: AdminCampaign | null;
  onEdit: (campaign: AdminCampaign) => void;
  onViewRecipients: (campaign: AdminCampaign) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CampaignDetailModal({
  open,
  onClose,
  campaign,
  onEdit,
  onViewRecipients,
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSendConfirm, setShowSendConfirm]     = useState(false);

  const send    = useAdminSendCampaign();
  const destroy = useAdminDeleteCampaign();

  const { data: stats } = useAdminCampaignStatistics(campaign?.id ?? 0);

  if (!open || !campaign) return null;

  const c = campaign;
  const canEdit   = c.status === 'draft' || c.status === 'scheduled';
  const canSend   = c.status === 'draft';
  const canDelete = c.status !== 'sending';
  const isSent    = c.status === 'sent';

  function handleSend() {
    send.mutate(c.id, {
      onSuccess: () => {
        toast.success('Campaign is being sent');
        setShowSendConfirm(false);
        onClose();
      },
      onError: () => toast.error('Failed to send campaign'),
    });
  }

  function handleDelete() {
    destroy.mutate(c.id, {
      onSuccess: () => {
        toast.success('Campaign deleted');
        setShowDeleteConfirm(false);
        onClose();
      },
      onError: () => toast.error('Failed to delete campaign'),
    });
  }

  // Use live stats if available, fall back to campaign fields
  const totalRecipients = stats?.total_recipients ?? c.total_recipients;
  const totalSent       = stats?.total_sent       ?? c.total_sent;
  const totalOpened     = stats?.total_opened     ?? c.total_opened;
  const totalClicked    = stats?.total_clicked    ?? c.total_clicked;
  const openRate        = stats?.open_rate        ?? c.open_rate  ?? 0;
  const clickRate       = stats?.click_rate       ?? c.click_rate ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900 truncate max-w-xs">{c.name}</h2>
            <StatusBadge status={c.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" /> Subject
              </div>
              <p className="text-sm font-medium text-gray-800">{c.subject}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" /> Type & Target
              </div>
              <p className="text-sm font-medium text-gray-800">{TYPE_LABELS[c.campaign_type]}</p>
              <p className="text-xs text-gray-500 capitalize">{c.target_type.replace('_', ' ')} customers</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created {new Date(c.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            {c.scheduled_at && (
              <div className="flex items-center gap-1.5 text-blue-500">
                <Calendar className="w-3.5 h-3.5" />
                Scheduled {new Date(c.scheduled_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {c.sent_at && (
              <div className="flex items-center gap-1.5 text-emerald-500">
                <Send className="w-3.5 h-3.5" />
                Sent {new Date(c.sent_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>

          {/* Stats grid */}
          {(isSent || totalSent > 0) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Performance</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Users}             label="Recipients" value={totalRecipients.toLocaleString()} color="text-gray-400" />
                <StatCard icon={Send}              label="Sent"       value={totalSent.toLocaleString()}       color="text-blue-400" />
                <StatCard icon={Eye}               label="Opened"     value={totalOpened.toLocaleString()}     sub={`${openRate}% open rate`}  color="text-amber-500" />
                <StatCard icon={MousePointerClick} label="Clicked"    value={totalClicked.toLocaleString()}    sub={`${clickRate}% click rate`} color="text-emerald-500" />
              </div>
            </div>
          )}

          {/* Recipients count for non-sent */}
          {!isSent && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{(c.recipients_count ?? totalRecipients).toLocaleString()}</span>
                <span className="text-gray-400">recipients queued</span>
              </div>
              <button
                onClick={() => onViewRecipients(c)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                <Users className="w-3.5 h-3.5" /> View list
              </button>
            </div>
          )}

          {/* Content preview */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Content</p>
            <div
              className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl p-4 max-h-48 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: c.content }}
            />
          </div>

          {/* Send confirm */}
          {showSendConfirm && (
            <div className="border border-amber-200 rounded-xl p-4 space-y-3 bg-amber-50/50">
              <p className="text-sm font-semibold text-gray-800">Send this campaign now?</p>
              <p className="text-xs text-gray-500">
                This will immediately send the email to all targeted recipients. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSend}
                  disabled={send.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
                >
                  {send.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Send
                </button>
                <button
                  onClick={() => setShowSendConfirm(false)}
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
              <p className="text-sm font-semibold text-gray-800">Delete this campaign?</p>
              <p className="text-xs text-gray-500">All recipient records will also be removed. This cannot be undone.</p>
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

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
            {canDelete && !showDeleteConfirm && !showSendConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isSent && (
              <button
                onClick={() => onViewRecipients(c)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
              >
                <Users className="w-4 h-4" /> Recipients
              </button>
            )}
            {canEdit && !showSendConfirm && !showDeleteConfirm && (
              <button
                onClick={() => { onClose(); onEdit(c); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
            )}
            {canSend && !showSendConfirm && !showDeleteConfirm && (
              <button
                onClick={() => setShowSendConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
              >
                <Send className="w-4 h-4" /> Send Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
