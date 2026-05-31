'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, CalendarDays, ChevronRight, Box } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TrackingEvent {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

interface TrackedOrder {
  order_number: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  placed_at: string;
  estimated_delivery: string;
  tracking_number: string;
  carrier: string;
  shipping_address: string;
  items: { name: string; qty: number; image?: string }[];
  events: TrackingEvent[];
}

// ── Dummy data ─────────────────────────────────────────────────────────────────

const DUMMY_ORDERS: Record<string, TrackedOrder> = {
  'SS20260328MPFC': {
    order_number: 'SS20260328MPFC',
    status: 'shipped',
    placed_at: '2026-03-28T10:22:00Z',
    estimated_delivery: '2026-04-02',
    tracking_number: 'TRK-AU-882910',
    carrier: 'DHL Express',
    shipping_address: '42 Maple Street, Apt 3B, Austin, TX 78701',
    items: [
      { name: '30 Inch 6 Modes Series 180W Amber & White LED Light Bar', qty: 1 },
      { name: '7 Inch 135W Starlight Flow Series DRL LED Headlights (Pair)', qty: 1 },
    ],
    events: [
      {
        status: 'Out for Delivery',
        description: 'Your package is out for delivery.',
        location: 'Austin, TX',
        timestamp: '2026-04-01T08:30:00Z',
      },
      {
        status: 'Arrived at Local Facility',
        description: 'Package arrived at the local delivery facility.',
        location: 'Austin, TX',
        timestamp: '2026-03-31T22:10:00Z',
      },
      {
        status: 'In Transit',
        description: 'Package is in transit to the destination.',
        location: 'Dallas, TX',
        timestamp: '2026-03-30T14:55:00Z',
      },
      {
        status: 'Shipped',
        description: 'Package handed over to DHL Express.',
        location: 'Dhaka, Bangladesh',
        timestamp: '2026-03-29T09:00:00Z',
      },
      {
        status: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared.',
        location: 'Auxbeam Warehouse',
        timestamp: '2026-03-28T10:30:00Z',
      },
    ],
  },
};

// ── Step progress config ──────────────────────────────────────────────────────

const STEPS = [
  { key: 'confirmed',  label: 'Confirmed',  icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Box },
  { key: 'shipped',    label: 'Shipped',    icon: Truck },
  { key: 'delivered',  label: 'Delivered',  icon: MapPin },
];

const STATUS_STEP: Record<string, number> = {
  confirmed:  0,
  processing: 1,
  shipped:    2,
  delivered:  3,
  cancelled:  -1,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TrackOrderPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const order = DUMMY_ORDERS[input.trim().toUpperCase()];
    if (order) {
      setResult(order);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  }

  const currentStep = result ? STATUS_STEP[result.status] : -1;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1b4c] via-[#1a2f6e] to-[#0f1b4c]">
        {/* decorative circles */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[#FCE32D]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#FCE32D]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FCE32D]/20 mb-5">
            <Package className="w-7 h-7 text-[#FCE32D]" />
          </div>
          <h1 className="text-3xl font-bold text-white">Track Your Order</h1>
          <p className="text-white/50 mt-2 text-sm">Enter your order number to get real-time updates</p>

          {/* Search form */}
          <form onSubmit={handleTrack} className="mt-8 flex gap-3 max-w-lg mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. SS20260328MPFC"
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 bg-white border border-transparent shadow-sm outline-none focus:ring-2 focus:ring-[#FCE32D]/60 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 bg-[#FCE32D] text-black text-sm font-semibold rounded-xl hover:bg-[#e6cc28] transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
              Track
            </button>
          </form>

          <p className="text-xs text-white/40 mt-3">
            Try: <button onClick={() => setInput('SS20260328MPFC')} className="underline font-medium text-[#FCE32D]/70 hover:text-[#FCE32D] transition-colors">SS20260328MPFC</button>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Not found */}
        {notFound && (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-800">Order not found</p>
            <p className="text-xs text-gray-400 mt-1">
              Double-check your order number and try again.
            </p>
          </div>
        )}

        {result && (
          <>
            {/* Status card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order Number</p>
                  <p className="text-lg font-bold text-gray-900">#{result.order_number}</p>
                  <p className="text-xs text-gray-400 mt-1">Placed on {formatDate(result.placed_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Estimated Delivery</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 justify-end">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {formatDate(result.estimated_delivery)}
                  </p>
                </div>
              </div>

              {/* Progress steps */}
              {result.status !== 'cancelled' && (
                <div className="relative flex items-center justify-between">
                  {/* connecting line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-[#FCE32D] z-0 transition-all duration-500"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                  />

                  {STEPS.map(({ key, label, icon: Icon }, idx) => {
                    const done = idx <= currentStep;
                    const active = idx === currentStep;
                    return (
                      <div key={key} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          done
                            ? 'bg-[#FCE32D] border-[#FCE32D]'
                            : 'bg-white border-gray-200'
                        } ${active ? 'ring-4 ring-[#FCE32D]/30' : ''}`}>
                          <Icon className={`w-4 h-4 ${done ? 'text-black' : 'text-gray-300'}`} />
                        </div>
                        <span className={`text-xs font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tracking info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-1">
                <p className="text-xs text-gray-400">Carrier</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  {result.carrier}
                </p>
                <p className="text-xs text-gray-500 pt-1">Tracking: <span className="font-mono font-medium text-gray-800">{result.tracking_number}</span></p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-1">
                <p className="text-xs text-gray-400">Delivering To</p>
                <p className="text-sm font-semibold text-gray-900 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  {result.shipping_address}
                </p>
              </div>
            </div>

            {/* Order items */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Items in This Order</h3>
              </div>
              <ul className="divide-y divide-gray-50">
                {result.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Tracking History</h3>
              </div>
              <ul className="px-5 py-4 space-y-5">
                {result.events.map((ev, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${i === 0 ? 'bg-[#FCE32D]' : 'bg-gray-200'}`} />
                      {i < result.events.length - 1 && (
                        <div className="w-px flex-1 bg-gray-100 mt-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className={`text-sm font-semibold ${i === 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                        {ev.status}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{ev.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {ev.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDateTime(ev.timestamp)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Default empty state */}
        {!result && !notFound && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <Truck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">Enter your order number above</p>
            <p className="text-xs text-gray-400 mt-1">You'll see live tracking status and delivery updates here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
