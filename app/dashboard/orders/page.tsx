'use client';

import Link from 'next/link';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';

const ORDERS = [
  {
    id: 'SS20260328MPFC',
    date: '3/28/2026',
    status: 'confirmed',
    total: 349991,
    items: 2,
  },
  {
    id: 'SS20260301ABCD',
    date: '3/1/2026',
    status: 'delivered',
    total: 12500,
    items: 1,
  },
  {
    id: 'SS20260210WXYZ',
    date: '2/10/2026',
    status: 'cancelled',
    total: 3800,
    items: 3,
  },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon: React.ElementType }> = {
  confirmed:  { label: 'Confirmed',  classes: 'bg-blue-50 text-blue-700',   icon: Clock        },
  processing: { label: 'Processing', classes: 'bg-amber-50 text-amber-700', icon: Package      },
  delivered:  { label: 'Delivered',  classes: 'bg-green-50 text-green-700', icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  classes: 'bg-red-50 text-red-600',     icon: XCircle      },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">All Orders</h2>
          <p className="text-xs text-gray-400 mt-0.5">{ORDERS.length} orders placed</p>
        </div>

        <ul className="divide-y divide-gray-50">
          {ORDERS.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.confirmed;
            const StatusIcon = cfg.icon;
            return (
              <li key={order.id}>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed on {order.date} &middot; {order.items}{' '}
                        {order.items === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.classes}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
