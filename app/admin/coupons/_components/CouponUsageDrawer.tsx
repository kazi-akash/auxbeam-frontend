'use client';

import { X, Loader2, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { useAdminCouponUsage } from '@/lib/hooks/admin/useAdminPromotions';
import type { AdminCoupon } from './CouponModal';

interface Props {
  coupon: AdminCoupon | null;
  onClose: () => void;
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CouponUsageDrawer({ coupon, onClose }: Props) {
  const { data, isLoading } = useAdminCouponUsage(coupon?.id ?? 0);

  const usages: any[] = Array.isArray(data)
    ? data
    : (data?.data ?? []);
  const total: number = data?.total ?? usages.length;

  if (!coupon) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Usage History</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{coupon.code}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50/60">
          <div className="px-4 py-3 text-center">
            <p className="text-lg font-bold text-gray-800">{coupon.usage_count}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Used</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-lg font-bold text-gray-800">
              {coupon.usage_limit ?? '∞'}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Limit</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-lg font-bold text-gray-800">
              {coupon.usage_limit
                ? `${Math.round((coupon.usage_count / coupon.usage_limit) * 100)}%`
                : '—'}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Used %</p>
          </div>
        </div>

        {/* Usage list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            </div>
          ) : usages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <Receipt className="w-10 h-10 opacity-30" />
              <p className="text-sm">No usage records yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {usages.map((usage: any) => (
                <li key={usage.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {usage.customer_email}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Order #{usage.order?.order_number ?? usage.order_id}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatDate(usage.created_at)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        −${Number(usage.discount_applied).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {total > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400 text-center">
              Showing {usages.length} of {total} usage records
            </p>
          </div>
        )}
      </div>
    </>
  );
}
