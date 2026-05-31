'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Package,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Star,
  Heart,
  ArrowRight,
  ShoppingBag,
  CalendarDays,
} from 'lucide-react';

function formatMemberSince(dateStr?: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ── Mock recent orders (replace with API data) ─────────────────────
const RECENT_ORDERS = [
  {
    id: 'SS20260328MPFC',
    date: '2026-03-14',
    status: 'Confirmed',
    items: 2,
    total: 349991,
  },
  {
    id: 'SS202603282L2O',
    date: '2026-03-07',
    status: 'Shipped',
    items: 2,
    total: 12500,
  },
];

const STATUS_BADGE: Record<string, string> = {
  Confirmed:  'text-blue-600 bg-blue-50',
  Shipped:    'text-cyan-600 bg-cyan-50',
  Processing: 'text-yellow-600 bg-yellow-50',
  Delivered:  'text-green-600 bg-green-50',
  Cancelled:  'text-red-600 bg-red-50',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.name || 'User';
  const memberSince = formatMemberSince(user?.created_at);

  const STAT_CARDS = [
    {
      label: 'Total Orders',
      sublabel: 'All time orders',
      value: 3,
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200',
      href: '/dashboard/orders',
    },
    {
      label: 'Pending Orders',
      sublabel: 'Awaiting confirmation',
      value: 0,
      icon: Clock,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      borderColor: 'border-yellow-200',
      href: '/dashboard/orders',
    },
    {
      label: 'Processing Orders',
      sublabel: 'Being prepared',
      value: 0,
      icon: RefreshCw,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-500',
      borderColor: 'border-cyan-200',
      href: '/dashboard/orders',
    },
    {
      label: 'Delivered Orders',
      sublabel: 'Successfully delivered',
      value: 0,
      icon: CheckCircle2,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      borderColor: 'border-green-200',
      href: '/dashboard/orders',
    },
    {
      label: 'Cancelled Orders',
      sublabel: 'Cancelled orders',
      value: 0,
      icon: XCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      borderColor: 'border-red-200',
      href: '/dashboard/orders',
    },
    {
      label: 'Total Spent',
      sublabel: 'Lifetime spending',
      value: formatCurrency(249.97),
      icon: Package,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-200',
      href: '/dashboard/orders',
    },
    {
      label: 'Pending Reviews',
      sublabel: 'Products to review',
      value: 0,
      icon: Star,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-200',
      href: '/dashboard/reviews',
    },
    {
      label: 'Wishlist Items',
      sublabel: 'Saved for later',
      value: 2,
      icon: Heart,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-400',
      borderColor: 'border-pink-200',
      href: '/dashboard/wishlist',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Welcome banner ── */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {displayName}! 👋</h2>
            <p className="text-gray-400 mt-1 text-sm">
              Here's an overview of your account activity and recent orders.
            </p>
          </div>
          <div className="shrink-0 border border-amber-200 bg-amber-50 rounded-xl px-4 py-3 text-right hidden sm:flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-amber-400" strokeWidth={1.5} />
            <div>
              <p className="text-gray-400 text-xs font-medium">Member Since</p>
              <p className="text-gray-900 text-base font-bold mt-0.5">{memberSince}</p>
            </div>
          </div>
        </div>

        {/* Rewards strip */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#6b5ce7] to-[#7c6ff0] rounded-2xl px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">You're doing great!</p>
              <p className="text-white/70 text-xs mt-0.5">Keep shopping to unlock exclusive rewards and offers.</p>
            </div>
          </div>
          <Link
            href="/dashboard/rewards"
            className="shrink-0 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            View Rewards <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Account Statistics ── */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, sublabel, value, icon: Icon, iconBg, iconColor, borderColor, href }) => (
            <Link
              key={label}
              href={href}
              className={`bg-white rounded-xl border ${borderColor} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-700 leading-snug">{label}</p>
                <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-[18px] h-[18px] ${iconColor}`} strokeWidth={1.8} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{sublabel}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-800 transition-colors mt-auto">
                View details <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-400 mt-0.5">Track and manage your recent purchases</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-2 px-4 py-2 bg-[#FCE32D] text-black text-sm font-semibold rounded-xl hover:bg-[#e6cc28] transition-colors shrink-0"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Order rows */}
        {RECENT_ORDERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Package className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-500">No orders yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {RECENT_ORDERS.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors group"
                >
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">
                          Order #{order.id}
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[order.status] ?? 'text-gray-600 bg-gray-100'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)}</p>
                      <p className="text-xs text-gray-400">{order.items} items</p>
                    </div>
                  </div>

                  {/* Right: total + link */}
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs text-gray-400 group-hover:text-gray-700 transition-colors">
                      View details <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Continue Shopping */}
          <Link
            href="/shop"
            className="relative overflow-hidden bg-gradient-to-br from-[#0f1b4c] via-[#1a2f6e] to-[#0f1b4c] rounded-2xl p-6 flex flex-col gap-4 group hover:opacity-95 transition-opacity"
          >
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#FCE32D]/10 blur-2xl pointer-events-none" />
            <div className="w-12 h-12 bg-[#FCE32D]/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#FCE32D]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Continue Shopping</p>
              <p className="text-sm text-white/50 mt-1">
                Discover new products and great deals on fitness equipment
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#FCE32D] mt-auto">
              Browse Products <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* My Wishlist */}
          <Link
            href="/dashboard/wishlist"
            className="relative bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden group hover:opacity-95 transition-opacity"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">My Wishlist</p>
              <p className="text-sm text-pink-100 mt-1">
                View and manage your saved favorite items
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white mt-auto">
              View Wishlist <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Need Help */}
          <Link
            href="/contact"
            className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden group hover:opacity-95 transition-opacity"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Need Help?</p>
              <p className="text-sm text-green-100 mt-1">
                Contact our support team for assistance
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white mt-auto">
              Get Support <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
