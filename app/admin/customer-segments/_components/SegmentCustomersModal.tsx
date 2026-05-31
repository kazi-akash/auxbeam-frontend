'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminSegmentCustomers } from '@/lib/hooks/admin/useAdminCustomerSegments';
import type { CustomerSegment } from '@/lib/types/admin';

interface Props {
  open: boolean;
  onClose: () => void;
  segment: CustomerSegment | null;
}

const PER_PAGE = 15;

export default function SegmentCustomersModal({ open, onClose, segment }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAdminSegmentCustomers(segment?.id ?? 0, {
    search: search || undefined, per_page: PER_PAGE, page,
  });

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const lastPage = data?.data?.last_page ?? 1;

  if (!open || !segment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">{segment.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Customers in this segment</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100 shrink-0">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search customers..."
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Phone', 'Total Spent', 'Orders'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                  ))}
                </tr>
              )) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No customers found.</td></tr>
              ) : rows.map((c: any) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-800">{c.first_name} {c.last_name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-800">৳{(c.analytics?.total_spent ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.analytics?.completed_orders ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && total > PER_PAGE && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 shrink-0">
            <p className="text-xs text-gray-400">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total.toLocaleString()}</p>
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
    </div>
  );
}
