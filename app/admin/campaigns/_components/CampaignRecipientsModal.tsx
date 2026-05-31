'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Users, Mail, MousePointerClick, Eye, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { AdminCampaign, AdminCampaignRecipient, CampaignRecipientStatus } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RECIPIENT_STATUS_CONFIG: Record<CampaignRecipientStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-gray-100   text-gray-500   border border-gray-200'   },
  sent:    { label: 'Sent',    cls: 'bg-blue-50    text-blue-600   border border-blue-100'   },
  opened:  { label: 'Opened',  cls: 'bg-amber-50   text-amber-600  border border-amber-100'  },
  clicked: { label: 'Clicked', cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '',        label: 'All'     },
  { value: 'pending', label: 'Pending' },
  { value: 'sent',    label: 'Sent'    },
  { value: 'opened',  label: 'Opened'  },
  { value: 'clicked', label: 'Clicked' },
];

function RecipientStatusBadge({ status }: { status: CampaignRecipientStatus }) {
  const cfg = RECIPIENT_STATUS_CONFIG[status] ?? RECIPIENT_STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useAdminCampaignRecipients(
  campaignId: number,
  filters: { status?: string; page: number; per_page: number }
) {
  return useQuery({
    queryKey: queryKeys.admin.campaigns.recipients(campaignId, filters),
    queryFn: async () => {
      const res = await api.get(`/api/admin/campaigns/${campaignId}/recipients`, { params: filters });
      return res.data;
    },
    enabled: !!campaignId,
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  campaign: AdminCampaign | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PER_PAGE = 15;

export default function CampaignRecipientsModal({ open, onClose, campaign }: Props) {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useAdminCampaignRecipients(
    campaign?.id ?? 0,
    { status: statusFilter || undefined, page, per_page: PER_PAGE }
  );

  if (!open || !campaign) return null;

  const recipients: AdminCampaignRecipient[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number    = data?.data?.total ?? data?.pagination?.total ?? recipients.length;
  const lastPage: number = data?.data?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  // Summary counts from campaign
  const summaryCards = [
    { icon: Users,             label: 'Total',   value: campaign.total_recipients, color: 'text-gray-500'    },
    { icon: Mail,              label: 'Sent',    value: campaign.total_sent,       color: 'text-blue-500'    },
    { icon: Eye,               label: 'Opened',  value: campaign.total_opened,     color: 'text-amber-500'   },
    { icon: MousePointerClick, label: 'Clicked', value: campaign.total_clicked,    color: 'text-emerald-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Campaign Recipients</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{campaign.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3">
            {summaryCards.map((c) => (
              <div key={c.label} className="bg-gray-50 rounded-xl px-3 py-3 text-center">
                <c.icon className={`w-4 h-4 mx-auto mb-1 ${c.color}`} />
                <p className="text-lg font-bold text-gray-800">{c.value.toLocaleString()}</p>
                <p className="text-[11px] text-gray-400">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Filter:</span>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setStatusFilter(f.value); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  statusFilter === f.value
                    ? 'bg-amber-400 text-black'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sent At</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Opened At</th>
                  </tr>
                </thead>
                <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-4 py-3.5">
                            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recipients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                        No recipients found.
                      </td>
                    </tr>
                  ) : (
                    recipients.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 text-xs text-gray-700 font-mono">{r.email}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-700">
                          {r.user ? `${r.user.first_name} ${r.user.last_name}` : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <RecipientStatusBadge status={r.status} />
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {r.sent_at
                            ? new Date(r.sent_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {r.opened_at
                            ? new Date(r.opened_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoading && total > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Showing {from}–{to} of <span className="font-medium text-gray-600">{total.toLocaleString()}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${
                        n === page
                          ? 'bg-amber-400 text-black border border-amber-400'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    disabled={page >= lastPage}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
