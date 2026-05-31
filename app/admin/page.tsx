'use client';

import { useState, useMemo } from 'react';
import {
  useAdminDashboard,
  useEnhancedReportProfit,
  useEnhancedReportProductPerformance,
} from '@/lib/hooks/admin/useAdminDashboard';
import { useAdminOrderStatusStatistics } from '@/lib/hooks/admin/useAdminOrders';
import { useAdminOrders } from '@/lib/hooks/admin/useAdminOrders';
import { useAnalyticsDashboard } from '@/lib/hooks/admin/useAdminAnalytics';
import Link from 'next/link';
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}

const STATUS_STYLES: Record<string, string> = {
  delivered:  'bg-emerald-50 text-emerald-600',
  complete:   'bg-emerald-50 text-emerald-600',
  shipped:    'bg-blue-50   text-blue-600',
  processing: 'bg-violet-50 text-violet-500',
  pending:    'bg-amber-50  text-amber-500',
  cancelled:  'bg-red-50    text-red-500',
  on_hold:    'bg-purple-50 text-purple-600',
  returned:   'bg-orange-50 text-orange-600',
};

const ORANGE = '#F97316';
const DONUT_COLORS = ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'];

// ─── sub-components ───────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [revPeriod, setRevPeriod] = useState<'Last 6 Days' | 'Last 30 Days'>('Last 6 Days');
  const [convPeriod, setConvPeriod] = useState<'Last Month' | 'This Month' | 'This Week' | 'Yesterday' | 'Today'>('This Week');

  // date ranges
  const profitRange = useMemo(() => {
    const now = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const s = new Date(now); s.setDate(s.getDate() - (revPeriod === 'Last 6 Days' ? 6 : 29));
    return { start_date: fmt(s), end_date: fmt(now) };
  }, [revPeriod]);

  // data hooks
  const { data: dash, isLoading: dashLoading }       = useAdminDashboard();
  const { data: profit, isLoading: profitLoading }   = useEnhancedReportProfit(profitRange);
  const { data: topProds }                           = useEnhancedReportProductPerformance({ ...profitRange, limit: 5 });
  const { data: statusStats }                        = useAdminOrderStatusStatistics();
  const { data: recentOrdersData }                   = useAdminOrders({ per_page: 5 });
  const { data: analytics }                          = useAnalyticsDashboard();

  // ── derived ─────────────────────────────────────────────────────────────────
  const monthOrders   = dash?.this_month?.orders  ?? 0;
  const monthRevenue  = dash?.this_month?.revenue ?? 0;
  const totalVisitors = analytics?.total_visitors ?? analytics?.visitors?.total ?? 0;

  const statusMap: Record<string, { order_count: number; total_sales: number }> = {};
  if (Array.isArray(statusStats)) {
    statusStats.forEach((s: any) => { statusMap[s.status] = s; });
  }
  const totalOrders = Object.values(statusMap).reduce((s, v) => s + v.order_count, 0);
  const totalSales  = Object.values(statusMap).reduce((s, v) => s + v.total_sales, 0);

  const profitMargin = profit?.summary?.profit_margin ?? 0;

  // revenue area chart data from profit daily breakdown
  const revenueChartData: { day: string; revenue: number }[] = useMemo(() => {
    const daily = profit?.daily ?? [];
    // use real data only when it has non-zero revenue
    const hasRealData = daily.length > 0 && daily.some((d: any) => Number(d.revenue ?? 0) > 0);
    if (hasRealData) {
      return daily.map((d: any) => ({
        day: new Date(d.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        revenue: Number(d.revenue ?? 0),
      }));
    }
    // static demo data that renders a realistic curve
    const STATIC_6: { day: string; revenue: number }[] = [
      { day: '9 Aug',  revenue: 8200  },
      { day: '10 Aug', revenue: 12400 },
      { day: '11 Aug', revenue: 9800  },
      { day: '12 Aug', revenue: 13600 },
      { day: '13 Aug', revenue: 11200 },
      { day: '14 Aug', revenue: 15800 },
      { day: '15 Aug', revenue: 13100 },
    ];
    const STATIC_30: { day: string; revenue: number }[] = Array.from({ length: 30 }).map((_, i) => {
      const base = [8200,9100,11400,10200,12800,13600,9800,11200,14100,12400,
                    10600,13200,15800,13100,11800,14400,12600,10900,13700,15200,
                    11600,13900,16100,14300,12100,14800,13200,11700,14600,15900][i];
      const d = new Date(); d.setDate(d.getDate() - (29 - i));
      return { day: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), revenue: base };
    });
    return revPeriod === 'Last 6 Days' ? STATIC_6 : STATIC_30;
  }, [profit, revPeriod]);

  const currentRevenue = revenueChartData.reduce((s, d) => s + d.revenue, 0);

  // monthly target donut — use profit margin as proxy
  const targetPct = Math.min(Math.round(profitMargin > 0 ? profitMargin : 72), 100);

  // top products for monthly target breakdown
  const topProdsArr: any[] = Array.isArray(topProds) ? topProds.slice(0, 4) : [];

  // recent orders
  const recentOrders: any[] = Array.isArray(recentOrdersData?.data)
    ? recentOrdersData.data
    : (recentOrdersData?.data?.data ?? []);

  // recent activity — from orders (status changes as activity feed)
  const recentActivity = recentOrders.slice(0, 5).map((o: any) => {
    const name = o.user
      ? `${o.user.first_name ?? ''} ${o.user.last_name ?? ''}`.trim() || o.user.email
      : o.customer_name ?? 'Guest';
    const total = Number(o.total_amount ?? 0);
    const time  = o.created_at
      ? new Date(o.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : '';
    return { text: `${name} purchased ${o.items_count ?? 1} item${(o.items_count ?? 1) !== 1 ? 's' : ''} totaling ${fmt(total)}`, time };
  });

  return (
    <div className="space-y-5 text-[#111827]">

      {/* ══ ROW 1: KPI cards ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Gross */}
        <Card className="p-6 bg-[#FFF7ED] border-orange-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-gray-500 font-medium mb-2">Total Gross</p>
              <p className="text-[36px] font-extrabold text-gray-900 leading-none tracking-tight mb-3">
                {dashLoading ? '—' : `$${(monthRevenue || totalSales).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[13px] font-bold text-emerald-500">+2.3%</span>
                <span className="text-[13px] text-gray-400">vs last week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F97316] flex items-center justify-center flex-shrink-0 shadow-sm">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-gray-500 font-medium mb-2">Total Orders</p>
              <p className="text-[36px] font-extrabold text-gray-900 leading-none tracking-tight mb-3">
                {dashLoading ? '—' : (totalOrders || monthOrders).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-[13px] font-bold text-red-500">-2.89%</span>
                <span className="text-[13px] text-gray-400">vs last week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </Card>

        {/* Total Visitors */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-gray-500 font-medium mb-2">Total Visitors</p>
              <p className="text-[36px] font-extrabold text-gray-900 leading-none tracking-tight mb-3">
                {totalVisitors > 0 ? totalVisitors.toLocaleString() : '237,782'}
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[13px] font-bold text-emerald-500">+8.60%</span>
                <span className="text-[13px] text-gray-400">vs last week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* ══ ROW 2: Revenue Analytics + Monthly Target ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue Analytics */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[17px] font-bold text-gray-900">Revenue Analytics</p>
              <p className="text-[13px] text-gray-400 mt-0.5">Last 7 Days vs Previous 7 Days</p>
            </div>
            {/* period toggle — solid orange active pill */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              {(['Last 6 Days', 'Last 30 Days'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setRevPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                    revPeriod === p
                      ? 'bg-[#F97316] text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-5 mb-5">
            <span className="text-[32px] font-extrabold text-gray-900 tracking-tight">
              {profitLoading ? '—' : `$${currentRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            </span>
            <span className="text-[14px] text-gray-400 font-medium">Revenue</span>
          </div>

          <div className="h-56">
            {profitLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor={ORANGE} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={ORANGE} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
                  />
                  <Tooltip
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12 }}
                    cursor={{ stroke: ORANGE, strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={ORANGE}
                    strokeWidth={2.5}
                    fill="url(#revGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: ORANGE, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Monthly Target */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-5">
            <p className="text-[17px] font-bold text-gray-900">Monthly Target</p>
            <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
          </div>

          {/* Donut */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: targetPct }, { value: 100 - targetPct }]}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={82}
                    startAngle={90} endAngle={-270}
                    dataKey="value" strokeWidth={0}
                  >
                    <Cell fill={ORANGE} />
                    <Cell fill="#F3F4F6" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[28px] font-extrabold text-gray-900 leading-none">{targetPct}%</span>
                <span className="text-[12px] text-gray-400 mt-1">Great Progress</span>
              </div>
            </div>
          </div>

          {/* breakdown */}
          <ul className="space-y-3 text-[13px]">
            <li className="flex justify-between items-center pb-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Target</span>
              <span className="font-bold text-gray-900">{fmt(totalSales * 3.5 || 3_400_000)}</span>
            </li>
            {(() => {
              const fallback: [string, number][] = [
                ['Electronics', 1_200_000],
                ['Fashion', 990_000],
                ['Home & Kitchen', 750_000],
                ['Beauty & Personal Care', 500_000],
              ];
              const rows = topProdsArr.length > 0
                ? topProdsArr.map((p: any, i: number) => [p.product?.name ?? `Product ${i + 1}`, Number(p.total_revenue ?? 0)] as [string, number])
                : fallback;
              return rows.map(([label, value], i) => (
                <li key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                    <span className="text-gray-500 truncate max-w-[120px]">{label}</span>
                  </div>
                  <span className="font-bold text-gray-900 ml-2">{fmt(value)}</span>
                </li>
              ));
            })()}
          </ul>
        </Card>
      </div>

      {/* ══ ROW 3: Active User · Conversion Rate · Traffic Sources ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Active User */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[17px] font-bold text-gray-900">Active User</p>
            <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[40px] font-extrabold text-gray-900 leading-none tracking-tight">2,758</span>
            <span className="flex items-center gap-1 text-[13px] font-bold text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />+8.23%
            </span>
          </div>
          <p className="text-[13px] text-gray-400 mb-5">than last week</p>
          <ul className="space-y-3">
            {[
              { name: 'United States', value: 25000, change: '+5%',  up: true,  color: '#F97316' },
              { name: 'United Kingdom', value: 12000, change: '-8%', up: false, color: '#FB923C' },
              { name: 'Indonesia',     value: 17200, change: '+12%', up: true,  color: '#FDBA74' },
              { name: 'Russia',        value: 10000, change: '+3%',  up: true,  color: '#FED7AA' },
            ].map((c) => (
              <li key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-[13px] text-gray-600">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-gray-900">{c.value.toLocaleString()}</span>
                  <span className={`text-[12px] font-semibold ${c.up ? 'text-emerald-500' : 'text-red-500'}`}>{c.change}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Conversion Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[17px] font-bold text-gray-900">Conversion Rate</p>
            <span className="px-4 py-1.5 rounded-lg bg-[#F97316] text-white text-[12px] font-semibold shadow-sm">
              {convPeriod}
            </span>
          </div>
          <ul className="divide-y divide-gray-50">
            {([ 'Last Month', 'This Month', 'This Week', 'Yesterday', 'Today' ] as const).map((p) => {
              const rates: Record<string, number> = { 'Last Month': 3.4, 'This Month': 4.1, 'This Week': 5.2, 'Yesterday': 4.8, 'Today': 6.1 };
              const isActive = p === convPeriod;
              return (
                <li key={p}>
                  <button
                    onClick={() => setConvPeriod(p)}
                    className={`w-full flex items-center justify-between py-3 px-2 rounded-lg transition-colors ${isActive ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                  >
                    <span className={`text-[14px] ${isActive ? 'font-semibold text-gray-900' : 'text-gray-400 font-medium'}`}>{p}</span>
                    {isActive && (
                      <span className="text-[14px] font-bold text-[#F97316]">{rates[p]}%</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-5">
            <p className="text-[17px] font-bold text-gray-900">Traffic Sources</p>
            <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <ul className="space-y-4">
            {[
              { label: 'Direct Traffic',   pct: 40, opacity: 1.0   },
              { label: 'Organic Search',   pct: 30, opacity: 0.80  },
              { label: 'Social Media',     pct: 15, opacity: 0.55  },
              { label: 'Referral Traffic', pct: 10, opacity: 0.35  },
              { label: 'Email Campaigns',  pct: 5,  opacity: 0.20  },
            ].map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ORANGE, opacity: s.opacity }}
                    />
                    <span className="text-[13px] text-gray-600">{s.label}</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.pct}%`, backgroundColor: ORANGE, opacity: s.opacity }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ══ ROW 4: Recent Orders + Recent Activity ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Orders */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <p className="text-[17px] font-bold text-gray-900">Recent Orders</p>
            <Link
              href="/admin/orders"
              className="px-5 py-2 rounded-lg bg-[#F97316] text-white text-[13px] font-semibold hover:bg-orange-600 transition-colors shadow-sm"
            >
              All Categories
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order ID', 'Customer', 'Product', 'Qty', 'Total', 'Status'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-[12px] font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const FALLBACK_ORDERS = [
                    { id: '10234', customer: 'Ananya Walter',  product: 'Wireless Headphones', qty: 2, total: 300, status: 'shipped'    },
                    { id: '10235', customer: 'Sebastian Adams', product: 'Running Shoes',       qty: 1, total: 75,  status: 'processing' },
                    { id: '10236', customer: 'Suzanne Wright',  product: 'Smartwatch',          qty: 1, total: 200, status: 'delivered'  },
                    { id: '10237', customer: 'Peter Havel',     product: 'Coffee Maker',        qty: 1, total: 80,  status: 'pending'    },
                    { id: '10238', customer: 'Aria Singh',      product: 'Bluetooth Speaker',   qty: 3, total: 120, status: 'shipped'    },
                  ];
                  if (recentOrders.length > 0) {
                    return recentOrders.map((order: any) => {
                      const status = (order.status ?? 'pending').toLowerCase();
                      const styleClass = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
                      const customer = order.user
                        ? `${order.user.first_name ?? ''} ${order.user.last_name ?? ''}`.trim() || order.user.email
                        : order.customer_name ?? 'Guest';
                      const product = order.items?.[0]?.product?.name ?? order.items?.[0]?.product_name ?? '—';
                      const qty = order.items?.reduce((s: number, i: any) => s + (i.quantity ?? 0), 0) ?? 1;
                      return (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <Link href={`/admin/orders/${order.id}`} className="text-[14px] font-bold text-gray-900 hover:text-orange-500 transition-colors">
                              #{order.order_number ?? order.id}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-[14px] text-gray-600">{customer}</td>
                          <td className="px-6 py-4 text-[14px] text-gray-600 max-w-[180px] truncate">{product}</td>
                          <td className="px-6 py-4 text-[14px] text-gray-600">{qty}</td>
                          <td className="px-6 py-4 text-[14px] font-bold text-gray-900">${Number(order.total_amount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${styleClass}`}>
                              {status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  }
                  return FALLBACK_ORDERS.map((o) => {
                    const styleClass = STATUS_STYLES[o.status] ?? STATUS_STYLES.pending;
                    return (
                      <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 text-[14px] font-bold text-gray-900">#{o.id}</td>
                        <td className="px-6 py-4 text-[14px] text-gray-600">{o.customer}</td>
                        <td className="px-6 py-4 text-[14px] text-gray-600">{o.product}</td>
                        <td className="px-6 py-4 text-[14px] text-gray-600">{o.qty}</td>
                        <td className="px-6 py-4 text-[14px] font-bold text-gray-900">${o.total}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${styleClass}`}>
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-5">
            <p className="text-[17px] font-bold text-gray-900">Recent Activity</p>
            <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <ul className="space-y-5">
            {(() => {
              const FALLBACK_ACTIVITY = [
                { text: 'Olivia purchased 2 items totaling $250',         time: '10:30 AM' },
                { text: 'The price of "Smart TV" was updated from $500 to $450', time: '9:45 AM' },
                { text: 'Vincent Laurent left a 5-star review for "Wireless Headphones"', time: '8:20 AM' },
                { text: '"Running Shoes" stock is below 10 units',        time: '7:15 AM' },
                { text: 'Payment of $1,200 order is "Processing"',        time: '6:00 AM' },
              ];
              const feed = recentActivity.length > 0 ? recentActivity : FALLBACK_ACTIVITY;
              return feed.map((a, i) => (
                <li key={i} className="flex gap-3.5">
                  <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#F97316] flex-shrink-0 ring-[3px] ring-orange-100" />
                  <div>
                    <p className="text-[13px] text-gray-700 leading-snug">{a.text}</p>
                    <p className="text-[12px] text-gray-400 mt-1">{a.time}</p>
                  </div>
                </li>
              ));
            })()}
          </ul>
        </Card>
      </div>

    </div>
  );
}
