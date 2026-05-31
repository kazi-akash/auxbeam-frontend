import type { OrderStatus, PaymentStatus } from '@/lib/types';

// ─── Order Status ─────────────────────────────────────────────────────────────

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; cls: string }
> = {
  pending:              { label: 'Pending',              cls: 'bg-yellow-50  text-yellow-700  border border-yellow-200'  },
  confirmed:            { label: 'Confirmed',            cls: 'bg-blue-50    text-blue-600    border border-blue-100'    },
  processing:           { label: 'Processing',           cls: 'bg-indigo-50  text-indigo-600  border border-indigo-100'  },
  incomplete:           { label: 'Incomplete',           cls: 'bg-orange-50  text-orange-600  border border-orange-100'  },
  good_but_no_response: { label: 'No Response',          cls: 'bg-gray-100   text-gray-500    border border-gray-200'    },
  advance_payment:      { label: 'Advance Payment',      cls: 'bg-teal-50    text-teal-600    border border-teal-100'    },
  on_hold:              { label: 'On Hold',              cls: 'bg-amber-50   text-amber-700   border border-amber-200'   },
  ready_to_ship:        { label: 'Ready to Ship',        cls: 'bg-cyan-50    text-cyan-600    border border-cyan-100'    },
  shipped:              { label: 'Shipped',              cls: 'bg-purple-50  text-purple-600  border border-purple-100'  },
  delivered:            { label: 'Delivered',            cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  complete:             { label: 'Complete',             cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  cancelled:            { label: 'Cancelled',            cls: 'bg-red-50     text-red-500     border border-red-100'     },
  return_requested:     { label: 'Return Requested',     cls: 'bg-rose-50    text-rose-600    border border-rose-100'    },
  return_approved:      { label: 'Return Approved',      cls: 'bg-pink-50    text-pink-600    border border-pink-100'    },
  refunded:             { label: 'Refunded',             cls: 'bg-gray-100   text-gray-600    border border-gray-200'    },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; cls: string }
> = {
  pending:  { label: 'Pending',  cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  paid:     { label: 'Paid',     cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  failed:   { label: 'Failed',   cls: 'bg-red-50 text-red-500 border border-red-100' },
  refunded: { label: 'Refunded', cls: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? ORDER_STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS_CONFIG[status] ?? PAYMENT_STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
