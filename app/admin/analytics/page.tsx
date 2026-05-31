'use client';

import { useState } from 'react';
import {
  BarChart2, Users, Eye, ShoppingCart, TrendingUp,
  Search, MousePointerClick, AlertTriangle, Activity,
  ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet,
} from 'lucide-react';
import {
  useAnalyticsDashboard,
  useAnalyticsVisitors,
  useAnalyticsCartEvents,
  useAnalyticsCheckoutFunnel,
  useAnalyticsPageViews,
} from '@/lib/hooks/admin/useAdminAnalytics';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | undefined | null) {
  if (n == null) return '0';
  return n.toLocaleString();
}

function fmtPct(n: number | undefined | null) {
  if (n == null) return '0%';
  return `${n.toFixed(1)}%`;
}

function fmtMoney(n: number | undefined | null) {
  if (n == null) return '৳0';
  return `৳${n.toLocaleString()}`;
}

const TABS = [
  { id: 'overview',  label: 'Overview',        icon: BarChart2 },
  { id: 'visitors',  label: 'Visitor Sessions', icon: Users },
  { id: 'pageviews', label: 'Page Views',       icon: Eye },
  { id: 'cart',      label: 'Cart Events',      icon: ShoppingCart },
  { id: 'checkout',  label: 'Checkout Funnel',  icon: TrendingUp },
] as const;

type TabId = typeof TABS[number]['id'];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Date Range Picker ────────────────────────────────────────────────────────

function DateRangePicker({
  from, to, onChange,
}: {
  from: string; to: string;
  onChange: (from: string, to: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date" value={from}
        onChange={(e) => onChange(e.target.value, to)}
        className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
      />
      <span className="text-gray-400 text-sm">to</span>
      <input
        type="date" value={to}
        onChange={(e) => onChange(from, e.target.value)}
        className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
      />
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const { data, isLoading } = useAnalyticsDashboard({ date_from: dateFrom, date_to: dateTo });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  const v = data?.visitors;
  const pv = data?.page_views;
  const cf = data?.checkout_funnel;
  const ce = data?.cart_events;
  const s = data?.search;

  return (
    <div className="space-y-6">
      {/* Visitor stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Visitors</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Visitors" value={fmt(v?.total_visitors)} icon={Users} color="bg-blue-500" />
          <StatCard label="Unique Visitors" value={fmt(v?.unique_visitors)} icon={Users} color="bg-indigo-500" />
          <StatCard label="Authenticated" value={fmt(v?.authenticated_visitors)} icon={Users} color="bg-emerald-500" />
          <StatCard label="Avg Session" value={`${v?.avg_session_duration ?? 0}m`} sub="minutes" icon={Activity} color="bg-amber-500" />
        </div>
      </div>

      {/* Device breakdown */}
      {v?.by_device && Object.keys(v.by_device).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Device Breakdown</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(v.by_device).map(([device, count]) => {
              const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;
              const total = Object.values(v.by_device as Record<string, number>).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? Math.round(((count as number) / total) * 100) : 0;
              return (
                <div key={device} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 capitalize">{device}</span>
                  <span className="text-sm font-semibold text-gray-800">{fmt(count as number)}</span>
                  <span className="text-xs text-gray-400">({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Page views & checkout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Page Views" value={fmt(pv?.total_page_views)} icon={Eye} color="bg-purple-500" />
        <StatCard label="Avg Time on Page" value={`${pv?.avg_time_on_page ?? 0}s`} icon={Activity} color="bg-pink-500" />
        <StatCard label="Checkout Conversion" value={fmtPct(cf?.conversion_rate)} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard label="Abandoned Carts" value={fmt(cf?.abandoned_checkouts)} sub={fmtMoney(cf?.total_abandoned_value)} icon={AlertTriangle} color="bg-red-500" />
      </div>

      {/* Cart & search */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Cart Events" value={fmt(ce?.total_events)} icon={ShoppingCart} color="bg-orange-500" />
        <StatCard label="Items Added" value={fmt(ce?.items_added)} icon={ShoppingCart} color="bg-teal-500" />
        <StatCard label="Total Searches" value={fmt(s?.total_searches)} icon={Search} color="bg-cyan-500" />
        <StatCard label="Search CTR" value={fmtPct(s?.click_through_rate)} icon={MousePointerClick} color="bg-violet-500" />
      </div>

      {/* Top searched */}
      {s?.top_searches && s.top_searches.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Searches</h3>
          <div className="space-y-2">
            {s.top_searches.slice(0, 8).map((item: { query: string; count: number }, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.query}</span>
                <span className="text-sm font-semibold text-gray-800">{fmt(item.count)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Visitors Tab ─────────────────────────────────────────────────────────────

const PER_PAGE = 15;

function VisitorsTab({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const [page, setPage] = useState(1);
  const [deviceType, setDeviceType] = useState('');
  const [authenticated, setAuthenticated] = useState('');

  const { data, isLoading, isFetching } = useAnalyticsVisitors({
    date_from: dateFrom, date_to: dateTo,
    device_type: deviceType || undefined,
    authenticated: (authenticated as 'true' | 'false') || undefined,
    per_page: PER_PAGE, page,
  });

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const lastPage = data?.data?.last_page ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={deviceType} onChange={(e) => { setDeviceType(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200">
          <option value="">All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
        <select value={authenticated} onChange={(e) => { setAuthenticated(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200">
          <option value="">All Visitors</option>
          <option value="true">Authenticated</option>
          <option value="false">Guest</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Session ID', 'User', 'Device', 'Browser', 'Page Views', 'Duration', 'First Visit', 'Last Activity'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
              {isLoading ? Array.from({ length: PER_PAGE }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                  ))}
                </tr>
              )) : rows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">No visitor sessions found.</td></tr>
              ) : rows.map((s: any) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[120px] truncate">{s.session_id}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{s.user ? `${s.user.first_name} ${s.user.last_name}` : <span className="text-gray-400">Guest</span>}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{s.device_type}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.browser}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-800">{fmt(s.page_views)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{Math.round((s.duration_seconds ?? 0) / 60)}m</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{s.first_visit_at ? new Date(s.first_visit_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{s.last_activity_at ? new Date(s.last_activity_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && total > PER_PAGE && (
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
    </div>
  );
}

// ─── Page Views Tab ───────────────────────────────────────────────────────────

function PageViewsTab({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const [page, setPage] = useState(1);
  const [pageType, setPageType] = useState('');

  const { data, isLoading, isFetching } = useAnalyticsPageViews({
    date_from: dateFrom, date_to: dateTo,
    page_type: pageType || undefined,
    per_page: PER_PAGE, page,
  });

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const lastPage = data?.data?.last_page ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={pageType} onChange={(e) => { setPageType(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200">
          <option value="">All Page Types</option>
          <option value="home">Home</option>
          <option value="product">Product</option>
          <option value="category">Category</option>
          <option value="shop">Shop</option>
          <option value="cart">Cart</option>
          <option value="checkout">Checkout</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Page URL', 'Type', 'Views', 'Unique Visitors', 'Avg Time (s)'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
              {isLoading ? Array.from({ length: PER_PAGE }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></td>
                  ))}
                </tr>
              )) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">No page views found.</td></tr>
              ) : rows.map((pv: any, i: number) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs text-gray-700 max-w-[240px] truncate font-mono">{pv.page_url}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 capitalize">{pv.page_type}</span></td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-800">{fmt(pv.view_count)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{fmt(pv.unique_visitors)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{pv.avg_time_spent ? Math.round(pv.avg_time_spent) : 0}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && total > PER_PAGE && (
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
    </div>
  );
}

// ─── Cart Events Tab ──────────────────────────────────────────────────────────

const EVENT_TYPE_CONFIG: Record<string, { label: string; cls: string }> = {
  added:   { label: 'Added',   cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  removed: { label: 'Removed', cls: 'bg-red-50 text-red-500 border border-red-100' },
  updated: { label: 'Updated', cls: 'bg-amber-50 text-amber-600 border border-amber-100' },
  cleared: { label: 'Cleared', cls: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

function CartEventsTab({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const [page, setPage] = useState(1);
  const [eventType, setEventType] = useState('');

  const { data, isLoading, isFetching } = useAnalyticsCartEvents({
    date_from: dateFrom, date_to: dateTo,
    event_type: eventType || undefined,
    per_page: PER_PAGE, page,
  });

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const lastPage = data?.data?.last_page ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={eventType} onChange={(e) => { setEventType(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200">
          <option value="">All Events</option>
          <option value="added">Added</option>
          <option value="removed">Removed</option>
          <option value="updated">Updated</option>
          <option value="cleared">Cleared</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Product', 'Event', 'Qty', 'Price', 'User', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
              {isLoading ? Array.from({ length: PER_PAGE }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                  ))}
                </tr>
              )) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No cart events found.</td></tr>
              ) : rows.map((e: any) => {
                const cfg = EVENT_TYPE_CONFIG[e.event_type] ?? { label: e.event_type, cls: 'bg-gray-100 text-gray-500' };
                return (
                  <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[180px]">
                      <p className="font-medium truncate">{e.product?.name ?? `Product #${e.product_id}`}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-800">{e.quantity}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{e.price ? `৳${parseFloat(e.price).toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{e.user ? `${e.user.first_name} ${e.user.last_name}` : <span className="text-gray-400">Guest</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{e.event_at ? new Date(e.event_at).toLocaleDateString() : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && total > PER_PAGE && (
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
    </div>
  );
}

// ─── Checkout Funnel Tab ──────────────────────────────────────────────────────

const FUNNEL_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  initiated:          { label: 'Initiated',         cls: 'bg-blue-50 text-blue-600 border border-blue-100' },
  address_added:      { label: 'Address Added',     cls: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
  shipping_selected:  { label: 'Shipping Selected', cls: 'bg-purple-50 text-purple-600 border border-purple-100' },
  payment_initiated:  { label: 'Payment Init',      cls: 'bg-amber-50 text-amber-600 border border-amber-100' },
  order_completed:    { label: 'Completed',         cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  abandoned:          { label: 'Abandoned',         cls: 'bg-red-50 text-red-500 border border-red-100' },
};

function CheckoutFunnelTab({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading, isFetching } = useAnalyticsCheckoutFunnel({
    date_from: dateFrom, date_to: dateTo,
    status: status || undefined,
    per_page: PER_PAGE, page,
  });

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const lastPage = data?.data?.last_page ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200">
          <option value="">All Statuses</option>
          {Object.entries(FUNNEL_STATUS_CONFIG).map(([val, cfg]) => (
            <option key={val} value={val}>{cfg.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['#', 'User', 'Status', 'Items', 'Cart Total', 'Order', 'Created', 'Completed/Abandoned'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
              {isLoading ? Array.from({ length: PER_PAGE }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                  ))}
                </tr>
              )) : rows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">No checkout funnel data found.</td></tr>
              ) : rows.map((f: any) => {
                const cfg = FUNNEL_STATUS_CONFIG[f.status] ?? { label: f.status, cls: 'bg-gray-100 text-gray-500' };
                return (
                  <tr key={f.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{f.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{f.user ? `${f.user.first_name} ${f.user.last_name}` : <span className="text-gray-400">Guest</span>}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>{cfg.label}</span></td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800">{f.items_count}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-800">{f.cart_total ? `৳${parseFloat(f.cart_total).toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{f.order?.order_number ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{f.created_at ? new Date(f.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {f.completed_at ? new Date(f.completed_at).toLocaleDateString()
                        : f.abandoned_at ? <span className="text-red-400">{new Date(f.abandoned_at).toLocaleDateString()}</span>
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && total > PER_PAGE && (
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
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function getDefaultDates() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

export default function AdminAnalyticsPage() {
  const defaults = getDefaultDates();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [dateFrom, setDateFrom] = useState(defaults.from);
  const [dateTo, setDateTo] = useState(defaults.to);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Visitor sessions, page views, cart events & checkout funnel</p>
        </div>
        <DateRangePicker from={dateFrom} to={dateTo} onChange={(f, t) => { setDateFrom(f); setDateTo(t); }} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview'  && <OverviewTab dateFrom={dateFrom} dateTo={dateTo} />}
      {activeTab === 'visitors'  && <VisitorsTab dateFrom={dateFrom} dateTo={dateTo} />}
      {activeTab === 'pageviews' && <PageViewsTab dateFrom={dateFrom} dateTo={dateTo} />}
      {activeTab === 'cart'      && <CartEventsTab dateFrom={dateFrom} dateTo={dateTo} />}
      {activeTab === 'checkout'  && <CheckoutFunnelTab dateFrom={dateFrom} dateTo={dateTo} />}
    </div>
  );
}
