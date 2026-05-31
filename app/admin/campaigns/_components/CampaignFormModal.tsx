'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Eye, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminCreateCampaign,
  useAdminUpdateCampaign,
  useAdminPreviewCampaignRecipients,
} from '@/lib/hooks/admin/useAdminCampaigns';
import type {
  AdminCampaign,
  CampaignType,
  CampaignTargetType,
  CreateCampaignPayload,
} from '@/lib/types/admin';

// ─── Constants ────────────────────────────────────────────────────────────────

const CAMPAIGN_TYPES: { value: CampaignType; label: string }[] = [
  { value: 'promotional',   label: 'Promotional'   },
  { value: 'newsletter',    label: 'Newsletter'    },
  { value: 'abandoned_cart', label: 'Abandoned Cart' },
  { value: 'order_update',  label: 'Order Update'  },
];

const TARGET_TYPES: { value: CampaignTargetType; label: string; desc: string }[] = [
  { value: 'all_customers',      label: 'All Customers',      desc: 'Send to every registered active customer' },
  { value: 'specific_customers', label: 'Specific Customers', desc: 'Target customers by specific user IDs' },
  { value: 'customer_group',     label: 'Customer Group',     desc: 'Target by purchase history or spend criteria' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  campaign?: AdminCampaign | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CampaignFormModal({ open, onClose, campaign }: Props) {
  const isEdit = !!campaign;

  const [name, setName]               = useState('');
  const [subject, setSubject]         = useState('');
  const [content, setContent]         = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType>('promotional');
  const [targetType, setTargetType]   = useState<CampaignTargetType>('all_customers');
  const [scheduledAt, setScheduledAt] = useState('');
  const [previewResult, setPreviewResult] = useState<{ count: number } | null>(null);

  const create  = useAdminCreateCampaign();
  const update  = useAdminUpdateCampaign();
  const preview = useAdminPreviewCampaignRecipients();

  // Populate form when editing
  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setSubject(campaign.subject);
      setContent(campaign.content);
      setCampaignType(campaign.campaign_type);
      setTargetType(campaign.target_type);
      setScheduledAt(
        campaign.scheduled_at
          ? new Date(campaign.scheduled_at).toISOString().slice(0, 16)
          : ''
      );
      setPreviewResult(null);
    } else {
      setName('');
      setSubject('');
      setContent('');
      setCampaignType('promotional');
      setTargetType('all_customers');
      setScheduledAt('');
      setPreviewResult(null);
    }
  }, [campaign, open]);

  if (!open) return null;

  const isPending = create.isPending || update.isPending;

  function handlePreview() {
    preview.mutate(
      { target_type: targetType },
      {
        onSuccess: (data) => setPreviewResult({ count: data.count }),
        onError: () => toast.error('Failed to preview recipients'),
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !content.trim()) {
      toast.error('Name, subject, and content are required');
      return;
    }

    const payload: CreateCampaignPayload = {
      name: name.trim(),
      subject: subject.trim(),
      content: content.trim(),
      campaign_type: campaignType,
      target_type: targetType,
      scheduled_at: scheduledAt || null,
    };

    if (isEdit && campaign) {
      update.mutate(
        { id: campaign.id, payload },
        {
          onSuccess: () => {
            toast.success('Campaign updated');
            onClose();
          },
          onError: () => toast.error('Failed to update campaign'),
        }
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success('Campaign created');
          onClose();
        },
        onError: () => toast.error('Failed to create campaign'),
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Campaign' : 'New Campaign'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Campaign Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Newsletter 2026"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Exclusive Summer Deals Just for You!"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Type + Target row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Campaign Type
              </label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                {CAMPAIGN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Target Audience
              </label>
              <select
                value={targetType}
                onChange={(e) => { setTargetType(e.target.value as CampaignTargetType); setPreviewResult(null); }}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                {TARGET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target description + preview */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700">
              {TARGET_TYPES.find((t) => t.value === targetType)?.desc}
              {previewResult !== null && (
                <span className="ml-2 font-semibold">
                  — {previewResult.count.toLocaleString()} recipient{previewResult.count !== 1 ? 's' : ''}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={handlePreview}
              disabled={preview.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-60 transition"
            >
              {preview.isPending
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Users className="w-3.5 h-3.5" />}
              Preview
            </button>
          </div>

          {/* Scheduled at */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Schedule (optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
            />
            <p className="text-[11px] text-gray-400">Leave blank to save as draft and send manually.</p>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email Content <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-gray-400">HTML supported</span>
            </div>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<p>Write your email content here...</p>"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-y font-mono"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
