'use client';

import { useState } from 'react';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Server,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { useMetaPixelEvents } from '@/lib/hooks/admin/useAdminMetaPixel';
import type { MetaPixelEventName, MetaPixelEventSource } from '@/lib/types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EVENT_COLORS: Record<MetaPixelEventName, string> = {
  ViewContent:      'bg-blue-50   text-blue-600   border-blue-100',
  AddToCart:        'bg-amber-50  text-amber-600  border-amber-100',
  InitiateCheckout: 'bg-purple-50 text-purple-600 border-purple-100',
  Purchase:         'bg-emerald-50 text-emerald-600 border-emerald-100',
};

const EVENT_FILTERS: { value: string; label: string }[] = [
  { value: '',                label: 'All Events'        },
  { value: 'ViewContent',     label: 'ViewContent'       },
  { value: 'AddToCart',       label: 'AddToCart'         },
  { value: 'InitiateCheckout',label: 'InitiateCheckout'  },
  { value: 'Purchase',        label: 'Purchase'          },
];

const SOURCE_FILTERS: { value: string; label: string }[] = [
  { value: '',       label: 'All Sources' },
  { value: 'browser', label: 'Browser'   },
  { value: 'server',  label: 'Server'    },
];

const PER_PAGE = 20;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MetaPixelEventLog() {
  const [eventFilter, setEventFilter]   = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage]                 = useState(1);

  const { data, isLoading, isFetching } = useMetaPixelEvents({
    event_name: (eventFilter as MetaPixelEventName) || undefined,
    source:     (sourceFilter as MetaPixelEventSource) || undefined,
    page,
    per_page:   PER_PAGE,
  });

  const events = Array.isArray(data?.data) ? data.data : (data?.data?.data ?? []);
  const total: number    = data?.data?.total ?? events.length;
  const lastPage: number = data?.data?.last_page ?? Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to   = Math.min(page * PER_PAGE, total);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={eventFilter}
          onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
        >
          {EVENT_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
        >
          {SOURCE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {total > 0 && (
          <span className="text-xs text-gray-400 ml-auto">
            {total.toLocaleString()} events
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sent to FB</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Event ID</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>

            <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-400">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((ev: any) => (
                  <tr key={ev.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${EVENT_COLORS[ev.event_name as MetaPixelEventName] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                        {ev.event_name}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        {ev.source === 'server'
                          ? <Server className="w-3.5 h-3.5 text-purple-500" />
                          : <Monitor className="w-3.5 h-3.5 text-blue-500" />}
                        <span className="capitalize">{ev.source}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      {ev.user
                        ? `${ev.user.first_name} ${ev.user.last_name}`
                        : <span className="text-gray-300">Guest</span>}
                    </td>

                    <td className="px-4 py-3.5 text-xs font-mono text-gray-500">
                      {ev.order
                        ? `#${ev.order.order_number}`
                        : <span className="text-gray-300">—</span>}
                    </td>

                    <td className="px-4 py-3.5">
                      {ev.sent_to_facebook
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        : ev.error_message
                        ? <span title={ev.error_message}><XCircle className="w-4 h-4 text-red-400" /></span>
                        : <Clock className="w-4 h-4 text-gray-300" />}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] font-mono text-gray-400 max-w-[120px] truncate">
                      {ev.event_id}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(ev.created_at).toLocaleString('en-US', {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && total > PER_PAGE && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
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
                      ? 'bg-blue-600 text-white border border-blue-600'
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
  );
}
