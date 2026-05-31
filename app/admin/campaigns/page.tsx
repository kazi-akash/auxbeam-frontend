'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Megaphone,
  Send,
  BarChart2,
  Clock,
} from 'lucide-react';
import { useAdminCampaigns } from '@/lib/hooks/admin/useAdminCampaigns';
import CampaignFormModal from './_components/CampaignFormModal';
import CampaignDetailModal from './_components/CampaignDetailModal';
import CampaignRecipientsModal from './_components/CampaignRecipientsModal';
import type {
  AdminCampaign,
  AdminCampaignFilters,
  CampaignStatus,
  CampaignType,
} from '@/lib/types/admin';

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

const STATUS_FILTERS = [
  { value: '',          label: 'All Statuses' },
  { value: 'draft',     label: 'Draft'        },
  { value: 'scheduled', label: 'Scheduled'    },
  { value: 'sending',   label: 'Sending'      },
  { value: 'sent',      label: 'Sent'         },
  { value: 'cancelled', label: 'Cancelled'    },
];

const TYPE_FILTERS = [
  { value: '',              label: 'All Types'     },
  { value: 'promotional',   label: 'Promotional'   },
  { value: 'newsletter',    label: 'Newsletter'    },
  { value: 'abandoned_cart', label: 'Abandoned Cart' },
  { value: 'order_update',  label: 'Order Update'  },
];

function StatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ campaigns }: { campaigns: AdminCampaign[] }) {
  const total     = campaigns.length;
  const drafts    = campaigns.filter((c) => c.status === 'draft').length;
  const scheduled = campaigns.filter((c) => c.status === 'scheduled').length;
  const sent      = campaigns.filter((c) => c.status === 'sent').length;

  const cards = [
    { label: 'Total',     value: total,     icon: Megaphone, cls: 'text-gray-800'    },
    { label: 'Drafts',    value: drafts,    icon: Clock,     cls: 'text-gray-500'    },
    { label: 'Scheduled', value: scheduled, icon: Clock,     cls: 'text-blue-600'    },
    { label: 'Sent',      value: sent,      icon: Send,      cls: 'text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <c.icon className={`w-5 h-5 shrink-0 ${c.cls}`} />
          <div>
            <p className="text-xs text-gray-400 font-medium">{c.label}</p>
            <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PER_PAGE = 15;

export default function AdminCampaignsPage() {
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [statusFilter, setStatus]     = useState('');
  const [typeFilter, setType]         = useState('');
  const [page, setPage]               = useState(1);

  // Modal state
  const [formOpen, setFormOpen]               = useState(false);
  const [editTarget, setEditTarget]           = useState<AdminCampaign | null>(null);
  const [detailTarget, setDetailTarget]       = useState<AdminCampaign | null>(null);
  const [recipientsTarget, setRecipientsTarget] = useState<AdminCampaign | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebounced(val);
      setPage(1);
    }, 400);
  }, []);

  const filters: AdminCampaignFilters = {
    search:        debouncedSearch || undefined,
    status:        (statusFilter as CampaignStatus) || undefined,
    campaign_type: (typeFilter as CampaignType) || undefined,
    page,
    per_page:      PER_PAGE,
  };

  const { data, isLoading, isFetching } = useAdminCampaigns(filters);

  const campaigns: AdminCampaign[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number    = data?.data?.total ?? data?.pagination?.total ?? campaigns.length;
  const lastPage: number = data?.data?.last_page ?? data?.pagination?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  function openCreate() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(campaign: AdminCampaign) {
    setEditTarget(campaign);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">

      {/* Stats */}
      {!isLoading && campaigns.length > 0 && <StatsBar campaigns={campaigns} />}

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Search */}
        <div className="relative w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          {/* New campaign */}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
          >
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Target</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Recipients</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Performance</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading ? (
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Megaphone className="w-10 h-10 text-gray-200" />
                      <p className="text-sm text-gray-400">No campaigns found.</p>
                      <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
                      >
                        <Plus className="w-4 h-4" /> Create your first campaign
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => {
                  const openRate  = c.total_sent > 0 ? Math.round((c.total_opened  / c.total_sent) * 100) : 0;
                  const clickRate = c.total_sent > 0 ? Math.round((c.total_clicked / c.total_sent) * 100) : 0;

                  return (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-gray-500">#{c.id}</td>

                      <td className="px-4 py-4 max-w-[180px]">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">{c.name}</p>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{c.subject}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-600 font-medium">
                          {TYPE_LABELS[c.campaign_type] ?? c.campaign_type}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500 capitalize">
                          {c.target_type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={c.status} />
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-600 font-medium">
                        {(c.recipients_count ?? c.total_recipients).toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        {c.status === 'sent' ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full"
                                  style={{ width: `${Math.min(openRate, 100)}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-gray-500">{openRate}% open</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400 rounded-full"
                                  style={{ width: `${Math.min(clickRate, 100)}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-gray-500">{clickRate}% click</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {c.sent_at
                          ? new Date(c.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : c.scheduled_at
                          ? <span className="text-blue-500">{new Date(c.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          : new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* View stats / recipients */}
                          {c.status === 'sent' && (
                            <button
                              onClick={() => setRecipientsTarget(c)}
                              title="View recipients"
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <BarChart2 className="w-4 h-4" />
                            </button>
                          )}
                          {/* View detail */}
                          <button
                            onClick={() => setDetailTarget(c)}
                            title="View details"
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && total > PER_PAGE && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400">
              Showing {from}–{to} of{' '}
              <span className="font-medium text-gray-600">{total.toLocaleString()} campaigns</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
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

      {/* ── Modals ── */}
      <CampaignFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        campaign={editTarget}
      />

      <CampaignDetailModal
        open={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        campaign={detailTarget}
        onEdit={(c) => openEdit(c)}
        onViewRecipients={(c) => { setDetailTarget(null); setRecipientsTarget(c); }}
      />

      <CampaignRecipientsModal
        open={!!recipientsTarget}
        onClose={() => setRecipientsTarget(null)}
        campaign={recipientsTarget}
      />
    </div>
  );
}
