'use client';

import { useState, useCallback } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  ShieldOff,
  Eye,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminCustomers,
  useAdminToggleCustomerStatus,
} from '@/lib/hooks/admin/useAdminCustomers';
import CustomerDetailDrawer from './_components/CustomerDetailDrawer';
import type { User } from '@/lib/types/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_PER_PAGE = 15;

type StatusFilter = '' | '0' | '1';
type VerifiedFilter = '' | 'true' | 'false';

const STATUS_OPTS: { value: StatusFilter; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' },
];

const VERIFIED_OPTS: { value: VerifiedFilter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Unverified' },
];

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      <ShieldCheck className="w-3 h-3" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
      <ShieldOff className="w-3 h-3" /> Inactive
    </span>
  );
}

function Avatar({ user }: { user: User }) {
  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.full_name}
        className="w-9 h-9 rounded-xl object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 select-none">
      {initials || '?'}
    </div>
  );
}

function buildPageNumbers(current: number, last: number): (number | -1)[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const pages: (number | -1)[] = [1];
  if (current > 3) pages.push(-1);
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i);
  if (current < last - 2) pages.push(-1);
  pages.push(last);
  return pages;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>('');
  const [drawerCustomerId, setDrawerCustomerId] = useState<number | null>(null);

  // ── Data ──
  const { data, isLoading, isFetching } = useAdminCustomers({
    search: debouncedSearch || undefined,
    status: statusFilter !== '' ? (Number(statusFilter) as 0 | 1) : undefined,
    verified: verifiedFilter !== '' ? verifiedFilter : undefined,
    page,
    per_page: perPage,
  });

  const toggleStatus = useAdminToggleCustomerStatus();

  // Resolve paginated data — handle Laravel paginator shape
  const customers: User[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number = data?.data?.total ?? customers.length;
  const lastPage: number = data?.data?.last_page ?? Math.ceil(total / perPage);
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const pageItems = buildPageNumbers(page, lastPage);

  // ── Debounced search ──
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  }, []);

  // ── Toggle status ──
  function handleToggleStatus(customer: User) {
    const action = customer.status ? 'deactivate' : 'activate';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${customer.full_name}"?`)) return;
    toggleStatus.mutate(customer.id, {
      onSuccess: () => toast.success(`Customer ${action}d successfully`),
      onError: (e: any) => toast.error(e.response?.data?.message ?? `Failed to ${action}`),
    });
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-400">
              {total > 0 ? `${total.toLocaleString()} total customers` : 'Manage your customer base'}
            </p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-gray-600 outline-none focus:ring-2 focus:ring-amber-200 cursor-pointer"
            >
              {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Verified filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => { setVerifiedFilter(e.target.value as VerifiedFilter); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-gray-600 outline-none focus:ring-2 focus:ring-amber-200 cursor-pointer"
          >
            {VERIFIED_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className={`transition-opacity duration-150 ${isFetching && !isLoading ? 'opacity-60' : 'opacity-100'}`}>
                {isLoading ? (
                  Array.from({ length: perPage > 10 ? 10 : perPage }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                          </div>
                        </div>
                      </td>
                      {[...Array(3)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                      <td className="px-5 py-4">
                        <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Users className="w-10 h-10 opacity-25" />
                        <p className="text-sm font-medium">No customers found</p>
                        {(debouncedSearch || statusFilter || verifiedFilter) && (
                          <button
                            onClick={() => {
                              setSearch('');
                              setDebouncedSearch('');
                              setStatusFilter('');
                              setVerifiedFilter('');
                              setPage(1);
                            }}
                            className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Name + avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar user={customer} />
                          <div>
                            <p className="font-medium text-gray-800 leading-snug">
                              {customer.first_name} {customer.last_name}
                            </p>
                            <p className="text-[11px] text-gray-400">ID #{customer.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4">
                        <p className="text-gray-700 text-sm">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-[11px] text-gray-400 mt-0.5">{customer.phone}</p>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4 text-gray-500 text-sm">
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <StatusBadge active={customer.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDrawerCustomerId(customer.id)}
                            title="View details"
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(customer)}
                            title={customer.status ? 'Deactivate' : 'Activate'}
                            disabled={toggleStatus.isPending}
                            className={`p-1.5 rounded-md transition-colors disabled:opacity-40 ${
                              customer.status
                                ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {customer.status
                              ? <ToggleRight className="w-4 h-4" />
                              : <ToggleLeft className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!isLoading && total > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-400">
                  Showing {from}–{to} of{' '}
                  <span className="font-medium text-gray-600">{total.toLocaleString()} customers</span>
                </p>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600 outline-none focus:ring-2 focus:ring-amber-200 cursor-pointer"
                >
                  {[15, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n} / page</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  title="First page"
                >
                  <ChevronLeft className="w-3 h-3" /><ChevronLeft className="w-3 h-3 -ml-1.5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                {pageItems.map((n, idx) =>
                  n === -1 ? (
                    <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 select-none">…</span>
                  ) : (
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
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page >= lastPage}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPage(lastPage)}
                  disabled={page >= lastPage}
                  className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  title="Last page"
                >
                  <ChevronRight className="w-3 h-3" /><ChevronRight className="w-3 h-3 -ml-1.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      <CustomerDetailDrawer
        customerId={drawerCustomerId}
        onClose={() => setDrawerCustomerId(null)}
      />
    </>
  );
}
