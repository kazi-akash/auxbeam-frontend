'use client';

import { useState } from 'react';
import {
  Loader2,
  Eye,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Monitor,
  Server,
  Calendar,
} from 'lucide-react';
import { useMetaPixelStatistics } from '@/lib/hooks/admin/useAdminMetaPixel';
import type { MetaPixelEventName } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<MetaPixelEventName, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  ViewContent:      { label: 'View Content',       icon: Eye,          color: 'text-blue-600',    bg: 'bg-blue-50'    },
  AddToCart:        { label: 'Add to Cart',         icon: ShoppingCart, color: 'text-amber-600',   bg: 'bg-amber-50'   },
  InitiateCheckout: { label: 'Initiate Checkout',   icon: CreditCard,   color: 'text-purple-600',  bg: 'bg-purple-50'  },
  Purchase:         { label: 'Purchase',            icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

function fmt(n: number | undefined) {
  return (n ?? 0).toLocaleString();
}

function pct(n: number | undefined) {
  return `${(n ?? 0).toFixed(1)}%`;
}

// ─── Date presets ─────────────────────────────────────────────────────────────

const DATE_PRESETS = [
  { label: 'Last 7 days',  days: 7  },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

function getPresetDates(days: number) {
  const to   = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    date_from: from.toISOString().slice(0, 10),
    date_to:   to.toISOString().slice(0, 10),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MetaPixelStats() {
  const [preset, setPreset] = useState(1); // index into DATE_PRESETS
  const filters = getPresetDates(DATE_PRESETS[preset].days);

  const { data: stats, isLoading } = useMetaPixelStatistics(filters);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <p className="text-sm text-gray-400">No statistics available. Configure your Meta Pixel first.</p>
      </div>
    );
  }

  const funnel = stats.funnel;

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
        <span className="text-xs text-gray-400">
          {filters.date_from} → {filters.date_to}
        </span>
      </div>

      {/* Event count cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(EVENT_CONFIG) as MetaPixelEventName[]).map((event) => {
          const cfg   = EVENT_CONFIG[event];
          const count = stats.event_counts?.[event] ?? 0;
          const Icon  = cfg.icon;
          return (
            <div key={event} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${cfg.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{fmt(count)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Funnel + Source row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Funnel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Conversion Funnel</h3>
          </div>

          <div className="space-y-3">
            <FunnelBar
              label="View Content"
              value={funnel.ViewContent}
              max={funnel.ViewContent}
              color="bg-blue-500"
              rate={null}
            />
            <FunnelBar
              label="Add to Cart"
              value={funnel.AddToCart}
              max={funnel.ViewContent}
              color="bg-amber-500"
              rate={`${pct(funnel.view_to_cart_rate)} of views`}
            />
            <FunnelBar
              label="Initiate Checkout"
              value={funnel.InitiateCheckout}
              max={funnel.ViewContent}
              color="bg-purple-500"
              rate={`${pct(funnel.cart_to_checkout_rate)} of carts`}
            />
            <FunnelBar
              label="Purchase"
              value={funnel.Purchase}
              max={funnel.ViewContent}
              color="bg-emerald-500"
              rate={`${pct(funnel.checkout_to_purchase_rate)} of checkouts`}
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Overall conversion rate</span>
            <span className="font-bold text-emerald-600 text-sm">{pct(funnel.overall_conversion_rate)}</span>
          </div>
        </div>

        {/* Source breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Event Sources</h3>

          <div className="space-y-3">
            <SourceCard
              icon={Monitor}
              label="Browser (Pixel)"
              count={stats.source_counts?.browser ?? 0}
              total={stats.total_events}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <SourceCard
              icon={Server}
              label="Server (CAPI)"
              count={stats.source_counts?.server ?? 0}
              total={stats.total_events}
              color="text-purple-600"
              bg="bg-purple-50"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{fmt(stats.total_events)}</p>
            <p className="text-xs text-gray-400">Total events tracked</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FunnelBar({
  label,
  value,
  max,
  color,
  rate,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  rate: string | null;
}) {
  const pctWidth = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {rate && <span className="text-gray-400">{rate}</span>}
          <span className="font-bold text-gray-800">{value.toLocaleString()}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pctWidth}%` }}
        />
      </div>
    </div>
  );
}

function SourceCard({
  icon: Icon,
  label,
  count,
  total,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  total: number;
  color: string;
  bg: string;
}) {
  const pctWidth = total > 0 ? Math.min((count / total) * 100, 100) : 0;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${bg}`}>
      <Icon className={`w-4 h-4 shrink-0 ${color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="font-bold text-gray-800">{count.toLocaleString()}</span>
        </div>
        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full ${color.replace('text-', 'bg-')} rounded-full`}
            style={{ width: `${pctWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}
