'use client';

import { useState } from 'react';
import {
  Loader2,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  BarChart2,
  Globe,
  Calendar,
  Share2,
  Mail,
  Phone,
  Monitor,
} from 'lucide-react';
import {
  useEnhancedReportUtmCampaign,
  useEnhancedReportOrderSource,
} from '@/lib/hooks/admin/useAdminMetaPixel';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DATE_PRESETS = [
  { label: 'This month',   start: () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); }, end: () => new Date().toISOString().slice(0, 10) },
  { label: 'Last 30 days', start: () => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); }, end: () => new Date().toISOString().slice(0, 10) },
  { label: 'Last 90 days', start: () => { const d = new Date(); d.setDate(d.getDate() - 90); return d.toISOString().slice(0, 10); }, end: () => new Date().toISOString().slice(0, 10) },
];

const SOURCE_ICONS: Record<string, React.ElementType> = {
  facebook:   Share2,
  instagram:  Share2,
  website:    Globe,
  whatsapp:   Phone,
  phone_call: Phone,
  manual:     Monitor,
};

const SOURCE_COLORS: Record<string, string> = {
  facebook:   'text-blue-600  bg-blue-50',
  instagram:  'text-pink-600  bg-pink-50',
  website:    'text-gray-600  bg-gray-50',
  whatsapp:   'text-emerald-600 bg-emerald-50',
  phone_call: 'text-amber-600 bg-amber-50',
  manual:     'text-purple-600 bg-purple-50',
};

function fmt(n: number | string | undefined) {
  const num = typeof n === 'string' ? parseFloat(n) : (n ?? 0);
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtCurrency(n: number | string | undefined) {
  const num = typeof n === 'string' ? parseFloat(n) : (n ?? 0);
  return `৳${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UtmPerformance() {
  const [preset, setPreset] = useState(0);

  const filters = {
    start_date: DATE_PRESETS[preset].start(),
    end_date:   DATE_PRESETS[preset].end(),
  };

  const { data: utmData,    isLoading: utmLoading    } = useEnhancedReportUtmCampaign(filters);
  const { data: sourceData, isLoading: sourceLoading } = useEnhancedReportOrderSource(filters);

  const utmRows:    any[] = Array.isArray(utmData)    ? utmData    : [];
  const sourceRows: any[] = Array.isArray(sourceData) ? sourceData : [];

  const totalRevenue = sourceRows.reduce((s: number, r: any) => s + parseFloat(r.total_revenue ?? 0), 0);

  return (
    <div className="space-y-5">

      {/* Date filter */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {DATE_PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setPreset(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                preset === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order Source breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Orders by Source</h3>
        </div>

        {sourceLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : sourceRows.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No data for this period.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {sourceRows.map((row: any) => {
              const Icon  = SOURCE_ICONS[row.order_source] ?? Globe;
              const cls   = SOURCE_COLORS[row.order_source] ?? 'text-gray-600 bg-gray-50';
              const share = totalRevenue > 0 ? (parseFloat(row.total_revenue) / totalRevenue) * 100 : 0;

              return (
                <div key={row.order_source} className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${cls.split(' ')[0]}`}>
                    <div className={`w-7 h-7 rounded-lg ${cls.split(' ')[1]} flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="capitalize">{row.order_source.replace('_', ' ')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400">Orders</p>
                      <p className="font-bold text-gray-800">{fmt(row.total_orders)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Revenue</p>
                      <p className="font-bold text-gray-800">{fmtCurrency(row.total_revenue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Avg. Order</p>
                      <p className="font-medium text-gray-700">{fmtCurrency(row.average_order_value)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Completed</p>
                      <p className="font-medium text-gray-700">{fmt(row.completed_orders)}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cls.split(' ')[0].replace('text-', 'bg-')} rounded-full`}
                      style={{ width: `${Math.min(share, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400">{share.toFixed(1)}% of revenue</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UTM Campaign table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">UTM Campaign Performance</h3>
        </div>

        {utmLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : utmRows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <BarChart2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No UTM campaign data for this period.</p>
            <p className="text-xs text-gray-300 mt-1">
              UTM parameters are captured automatically from order referrers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Campaign</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Source / Medium</th>
                  <th className="text-right px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Orders</th>
                  <th className="text-right px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Avg. Order</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody>
                {utmRows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-gray-800">
                        {row.utm_campaign ?? <span className="text-gray-300">(none)</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {row.utm_source && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">
                            {row.utm_source}
                          </span>
                        )}
                        {row.utm_medium && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                            {row.utm_medium}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-gray-700">
                        <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                        {fmt(row.total_orders)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-gray-800">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        {fmtCurrency(row.total_revenue)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-gray-600">
                      {fmtCurrency(row.average_order_value)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-gray-600">
                      {fmt(row.completed_orders)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
