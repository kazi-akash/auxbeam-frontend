'use client';

import { useState } from 'react';
import { Users, TrendingUp, Star, AlertTriangle, Repeat, BarChart2 } from 'lucide-react';
import {
  useAdminCustomerAnalyticsDashboard,
  useAdminCustomerGrowthReport,
  useAdminCustomerLtvDistribution,
} from '@/lib/hooks/admin/useAdminCustomerAnalytics';

function fmt(n: number | undefined | null) {
  if (n == null) return '0';
  return n.toLocaleString();
}

function fmtMoney(n: number | undefined | null) {
  if (n == null) return '৳0';
  return `৳${(n ?? 0).toLocaleString()}`;
}

function fmtPct(n: number | undefined | null) {
  if (n == null) return '0%';
  return `${(n ?? 0).toFixed(1)}%`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── LTV Distribution Bar ─────────────────────────────────────────────────────

function LtvBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-10 text-right">{fmt(count)}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function getDefaultDates() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 6);
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

export default function AdminCustomerAnalyticsPage() {
  const defaults = getDefaultDates();
  const [startDate, setStartDate] = useState(defaults.from);
  const [endDate, setEndDate] = useState(defaults.to);

  const { data: dashboard, isLoading: dashLoading } = useAdminCustomerAnalyticsDashboard();
  const { data: growth, isLoading: growthLoading } = useAdminCustomerGrowthReport({ start_date: startDate, end_date: endDate });
  const { data: ltv, isLoading: ltvLoading } = useAdminCustomerLtvDistribution();

  const summary = dashboard?.summary;
  const topSpenders = dashboard?.top_spenders ?? [];
  const recentVips = dashboard?.recent_vips ?? [];
  const monthlyGrowth = growth?.monthly_growth ?? [];
  const maxMonthCount = Math.max(...monthlyGrowth.map((m: any) => m.count), 1);
  const ltvMax = ltv ? Math.max(...Object.values(ltv as Record<string, number>), 1) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customer Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Lifetime value, growth, and customer health metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200" />
        </div>
      </div>

      {/* Summary stats */}
      {dashLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total Customers" value={fmt(summary?.total_customers)} icon={Users} color="bg-blue-500" />
          <StatCard label="VIP Customers" value={fmt(summary?.vip_customers)} icon={Star} color="bg-amber-500" />
          <StatCard label="Repeat Buyers" value={fmt(summary?.repeat_customers)} icon={Repeat} color="bg-emerald-500" />
          <StatCard label="New Customers" value={fmt(summary?.new_customers)} icon={TrendingUp} color="bg-indigo-500" />
          <StatCard label="High Risk" value={fmt(summary?.high_risk_customers)} icon={AlertTriangle} color="bg-red-500" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">Monthly Customer Growth</h3>
          </div>
          {growthLoading ? (
            <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : monthlyGrowth.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data available.</p>
          ) : (
            <div className="space-y-3">
              {monthlyGrowth.map((m: any) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 shrink-0">{m.month}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.round((m.count / maxMonthCount) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{m.count}</span>
                </div>
              ))}
              {growth && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Retention Rate</span>
                  <span className="text-sm font-bold text-emerald-600">{fmtPct(growth.retention_rate)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* LTV Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">Lifetime Value Distribution</h3>
          </div>
          {ltvLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : !ltv ? (
            <p className="text-sm text-gray-400 text-center py-8">No data available.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(ltv as Record<string, number>).map(([range, count]) => (
                <LtvBar key={range} label={`৳${range}`} count={count} max={ltvMax} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Spenders */}
      {!dashLoading && topSpenders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Spenders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Customer', 'Email', 'Total Spent', 'Orders', 'VIP', 'Risk'].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topSpenders.map((c: any) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-3 py-3 text-xs font-medium text-gray-800">{c.first_name} {c.last_name}</td>
                    <td className="px-3 py-3 text-xs text-gray-500">{c.email}</td>
                    <td className="px-3 py-3 text-xs font-semibold text-gray-800">{fmtMoney(c.analytics?.total_spent)}</td>
                    <td className="px-3 py-3 text-xs text-gray-600">{fmt(c.analytics?.completed_orders)}</td>
                    <td className="px-3 py-3">
                      {c.analytics?.is_vip
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">VIP</span>
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      {c.analytics?.risk_level && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
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
        </div>
      )}

      {/* Recent VIPs */}
      {!dashLoading && recentVips.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent VIP Customers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentVips.map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-amber-700">{c.first_name?.[0]}{c.last_name?.[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{c.first_name} {c.last_name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{c.email}</p>
                  <p className="text-[11px] font-semibold text-amber-600">{fmtMoney(c.analytics?.total_spent)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
