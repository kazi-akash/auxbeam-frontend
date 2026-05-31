'use client';

import { useState } from 'react';
import { Plus, Users, Edit2, Trash2, ChevronLeft, ChevronRight, RefreshCw, UserCheck, AlertTriangle, Repeat } from 'lucide-react';
import {
  useAdminCustomerSegments,
  useAdminDeleteCustomerSegment,
  useAdminAutoAssignSegments,
  useAdminVipCustomers,
  useAdminCodRiskCustomers,
  useAdminRepeatCustomers,
} from '@/lib/hooks/admin/useAdminCustomerSegments';
import type { CustomerSegment } from '@/lib/types/admin';
import SegmentFormModal from './_components/SegmentFormModal';
import SegmentCustomersModal from './_components/SegmentCustomersModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | undefined | null) {
  if (n == null) return '0';
  return n.toLocaleString();
}

const SPECIAL_TABS = [
  { id: 'all',      label: 'All Segments',    icon: Users },
  { id: 'vip',      label: 'VIP Customers',   icon: UserCheck },
  { id: 'cod-risk', label: 'COD Risk',        icon: AlertTriangle },
  { id: 'repeat',   label: 'Repeat Buyers',   icon: Repeat },
] as const;

type SpecialTab = typeof SPECIAL_TABS[number]['id'];

// ─── Special Customer Lists ───────────────────────────────────────────────────

const PER_PAGE = 15;

function SpecialCustomerTable({ type }: { type: 'vip' | 'cod-risk' | 'repeat' }) {
  const [page, setPage] = useState(1);
  const vipQ    = useAdminVipCustomers({ per_page: PER_PAGE, page });
  const codQ    = useAdminCodRiskCustomers({ per_page: PER_PAGE, page });
  const repeatQ = useAdminRepeatCustomers({ per_page: PER_PAGE, page });

  const q = type === 'vip' ? vipQ : type === 'cod-risk' ? codQ : repeatQ;
  const rows = q.data?.data?.data ?? [];
  const total = q.data?.data?.total ?? 0;
  const lastPage = q.data?.data?.last_page ?? 1;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {['Customer', 'Email', 'Total Spent', 'Orders', 'VIP', 'Risk Level'].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.isLoading ? Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                ))}
              </tr>
            )) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No customers found.</td></tr>
            ) : rows.map((c: any) => (
              <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-xs font-medium text-gray-800">{c.first_name} {c.last_name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{c.email}</td>
                <td className="px-4 py-3 text-xs font-semibold text-gray-800">৳{fmt(c.analytics?.total_spent)}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{fmt(c.analytics?.completed_orders)}</td>
                <td className="px-4 py-3">
                  {c.analytics?.is_vip
                    ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">VIP</span>
                    : <span className="text-xs text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  {c.analytics?.risk_level && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                      c.analytics.risk_level === 'high' ? 'bg-red-50 text-red-500 border border-red-100'
                      : c.analytics.risk_level === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>{c.analytics.risk_level}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!q.isLoading && total > PER_PAGE && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of <span className="font-medium text-gray-600">{fmt(total)}</span></p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page >= lastPage}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminCustomerSegmentsPage() {
  const [activeTab, setActiveTab] = useState<SpecialTab>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CustomerSegment | null>(null);
  const [viewTarget, setViewTarget] = useState<CustomerSegment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: segments, isLoading } = useAdminCustomerSegments();
  const deleteSegment = useAdminDeleteCustomerSegment();
  const autoAssign = useAdminAutoAssignSegments();

  function openCreate() { setEditTarget(null); setFormOpen(true); }
  function openEdit(s: CustomerSegment) { setEditTarget(s); setFormOpen(true); }

  async function handleDelete(id: number) {
    await deleteSegment.mutateAsync(id);
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customer Segments</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage customer groups and view special customer lists</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => autoAssign.mutate()}
            disabled={autoAssign.isPending}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${autoAssign.isPending ? 'animate-spin' : ''}`} />
            Auto-Assign All
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
          >
            <Plus className="w-4 h-4" /> New Segment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
        {SPECIAL_TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id ? 'bg-amber-400 text-black shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* All Segments */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['Segment', 'Description', 'Customers', 'Priority', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                )) : !segments || segments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-10 h-10 text-gray-200" />
                        <p className="text-sm text-gray-400">No segments yet.</p>
                        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition">
                          <Plus className="w-4 h-4" /> Create first segment
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (segments as CustomerSegment[]).map((seg) => (
                  <tr key={seg.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {seg.color && <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />}
                        <span className="text-xs font-semibold text-gray-800">{seg.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">{seg.description ?? '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewTarget(seg)} className="text-xs font-semibold text-blue-600 hover:underline">
                        {fmt(seg.customers_count)} customers
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{seg.priority}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        seg.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}>{seg.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(seg)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === seg.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(seg.id)} disabled={deleteSegment.isPending}
                              className="px-2 py-1 text-[11px] font-semibold text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50">Confirm</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(seg.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vip'      && <SpecialCustomerTable type="vip" />}
      {activeTab === 'cod-risk' && <SpecialCustomerTable type="cod-risk" />}
      {activeTab === 'repeat'   && <SpecialCustomerTable type="repeat" />}

      {/* Modals */}
      <SegmentFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditTarget(null); }} segment={editTarget} />
      <SegmentCustomersModal open={!!viewTarget} onClose={() => setViewTarget(null)} segment={viewTarget} />
    </div>
  );
}
