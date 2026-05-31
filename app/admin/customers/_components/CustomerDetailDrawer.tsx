'use client';

import { useState } from 'react';
import {
  X, Mail, Phone, Calendar, ShieldCheck, ShieldOff,
  MapPin, Package, Lock, Eye, EyeOff, ChevronDown, ChevronUp,
  CreditCard, Truck, Tag,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAdminCustomer, useAdminUpdateCustomer } from '@/lib/hooks/admin/useAdminCustomers';
import { useAdminOrder } from '@/lib/hooks/admin/useAdminOrders';
import type { User } from '@/lib/types/auth';
import type { AdminOrder } from '@/lib/types/admin';

// ─── Shared helpers ────────────────────────────────────────────────────────────

type Tab = 'overview' | 'orders' | 'security';

function InfoRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-700 font-medium break-all">
        {value ?? <span className="text-gray-400 font-normal">—</span>}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      <ShieldCheck className="w-3 h-3" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
      <ShieldOff className="w-3 h-3" /> Inactive
    </span>
  );
}

const ORDER_STATUS_CLS: Record<string, string> = {
  pending:    'bg-amber-50  text-amber-600  border-amber-100',
  processing: 'bg-blue-50   text-blue-600   border-blue-100',
  shipped:    'bg-indigo-50 text-indigo-600 border-indigo-100',
  delivered:  'bg-emerald-50 text-emerald-600 border-emerald-100',
  cancelled:  'bg-red-50    text-red-500    border-red-100',
  refunded:   'bg-gray-100  text-gray-500   border-gray-200',
};

function OrderStatusBadge({ status }: { status: string }) {
  const cls = ORDER_STATUS_CLS[status] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls} capitalize`}>
      {status}
    </span>
  );
}

// ─── Order detail card (expanded) ─────────────────────────────────────────────

function OrderDetailCard({ orderId }: { orderId: number }) {
  const { data: order, isLoading } = useAdminOrder(orderId);

  if (isLoading) {
    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
        ))}
      </div>
    );
  }

  if (!order) return null;

  const o = order as AdminOrder;
  const subtotal  = Number(o.subtotal ?? 0);
  const shipping  = Number(o.shipping_cost ?? 0);
  const discount  = Number(o.discount_amount ?? 0);
  const total     = Number(o.total_amount ?? 0);

  return (
    <div className="mt-3 border border-gray-100 rounded-xl overflow-hidden text-sm">
      {/* Items */}
      {o.items && o.items.length > 0 && (
        <div className="divide-y divide-gray-50">
          {o.items.map((item) => {
            const img = item.product?.images?.find((i) => i.is_primary)?.full_url
              ?? item.product?.images?.[0]?.full_url;
            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                {img ? (
                  <img src={img} alt={item.product?.name} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0 select-none">
                    {item.product?.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.product?.name ?? 'Product'}</p>
                  {item.product?.sku && <p className="text-[11px] text-gray-400">SKU: {item.product.sku}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-gray-700">${Number(item.unit_price ?? 0).toFixed(2)}</p>
                  <p className="text-[11px] text-gray-400">×{item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Totals */}
      <div className="bg-gray-50 px-4 py-3 space-y-1 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        {shipping > 0 && (
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600">
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount</span>
            <span>−${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-semibold text-gray-800 pt-1 border-t border-gray-200">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping address */}
      {o.shipping_address && (
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Ship to
          </p>
          <p className="text-xs text-gray-600">
            {o.shipping_address.address_line_1}
            {o.shipping_address.address_line_2 && `, ${o.shipping_address.address_line_2}`}
          </p>
          <p className="text-xs text-gray-500">
            {[o.shipping_address.city, o.shipping_address.state, o.shipping_address.zip_code].filter(Boolean).join(', ')}
          </p>
        </div>
      )}

      {/* Payment / tracking */}
      <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-1">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <CreditCard className="w-3 h-3" /> Payment
          </p>
          <p className="text-xs font-medium text-gray-700 capitalize">{o.payment_status}</p>
        </div>
        {o.tracking_number && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Truck className="w-3 h-3" /> Tracking
            </p>
            <p className="text-xs font-medium text-gray-700 font-mono">{o.tracking_number}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Orders tab ───────────────────────────────────────────────────────────────

function OrdersTab({ orders }: { orders: any[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
        <Package className="w-10 h-10 opacity-20" />
        <p className="text-sm">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const isExpanded = expandedId === order.id;
        return (
          <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Package className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{order.order_number}</p>
                  <p className="text-[11px] text-gray-400">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">${Number(order.total_amount ?? 0).toFixed(2)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </div>
            </button>
            {isExpanded && <OrderDetailCard orderId={order.id} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Security tab (change password) ───────────────────────────────────────────

function SecurityTab({ customerId }: { customerId: number }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const updateCustomer = useAdminUpdateCustomer();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    updateCustomer.mutate(
      { id: customerId, payload: { password } },
      {
        onSuccess: () => {
          toast.success('Password updated successfully.');
          setPassword('');
          setConfirm('');
        },
        onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed to update password.'),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
        Setting a new password will immediately replace the customer's current password. The customer will need to use it on their next login.
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            minLength={8}
            className="w-full pr-10 pl-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm Password</label>
        <div className="relative">
          <input
            type={showCf ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter new password"
            required
            className="w-full pr-10 pl-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
          />
          <button
            type="button"
            onClick={() => setShowCf((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirm && password && confirm !== password && (
          <p className="mt-1 text-[11px] text-red-500">Passwords do not match.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={updateCustomer.isPending || !password || !confirm}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Lock className="w-4 h-4" />
        {updateCustomer.isPending ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ customer }: { customer: User & { addresses?: any[] } }) {
  return (
    <div className="space-y-5">
      {/* Contact */}
      <section>
        <SectionLabel>Contact</SectionLabel>
        <div className="bg-gray-50 rounded-xl px-4">
          <InfoRow label={<span className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>} value={customer.email} />
          <InfoRow label={<span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</span>} value={customer.phone} />
        </div>
      </section>

      {/* Account */}
      <section>
        <SectionLabel>Account</SectionLabel>
        <div className="bg-gray-50 rounded-xl px-4">
          <InfoRow label="ID" value={`#${customer.id}`} />
          <InfoRow label="Type" value={<span className="capitalize">{customer.user_type}</span>} />
          <InfoRow
            label={<span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined</span>}
            value={customer.created_at
              ? new Date(customer.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              : null}
          />
          <InfoRow label="Gender" value={customer.gender ? <span className="capitalize">{customer.gender}</span> : null} />
          <InfoRow label="Birthday" value={customer.date_of_birth} />
        </div>
      </section>

      {/* Addresses */}
      {(customer.addresses?.length ?? 0) > 0 && (
        <section>
          <SectionLabel><span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Addresses</span></SectionLabel>
          <div className="space-y-2">
            {customer.addresses!.map((addr: any) => (
              <div key={addr.id} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-amber-600 capitalize mb-1">
                  {addr.address_type?.replace(/_/g, ' ')}
                  {addr.is_default && (
                    <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Default</span>
                  )}
                </p>
                <p className="text-sm text-gray-700">{addr.address_line_1}</p>
                {addr.address_line_2 && <p className="text-sm text-gray-500">{addr.address_line_2}</p>}
                <p className="text-sm text-gray-500">
                  {[addr.city, addr.state, addr.zip_code].filter(Boolean).join(', ')}
                </p>
                {addr.contact_no && <p className="text-xs text-gray-400 mt-0.5">{addr.contact_no}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

interface Props {
  customerId: number | null;
  onClose: () => void;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Mail className="w-3.5 h-3.5" /> },
  { id: 'orders',   label: 'Orders',   icon: <Package className="w-3.5 h-3.5" /> },
  { id: 'security', label: 'Security', icon: <Lock className="w-3.5 h-3.5" /> },
];

export default function CustomerDetailDrawer({ customerId, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { data: customer, isLoading } = useAdminCustomer(customerId ?? 0);
  const open = customerId !== null;

  // Reset tab when a new customer is opened
  const prevId = customerId;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[460px] bg-white shadow-2xl flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-sm font-semibold text-gray-800">Customer Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : customer ? (
          <>
            {/* ── Customer hero ── */}
            <div className="px-5 pt-4 pb-0 shrink-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 text-lg font-bold flex items-center justify-center shrink-0 select-none">
                  {customer.first_name?.[0]?.toUpperCase()}{customer.last_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base leading-snug">
                    {customer.first_name} {customer.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                  <div className="mt-1.5">
                    <StatusBadge active={customer.status} />
                  </div>
                </div>
              </div>

              {/* ── Tabs ── */}
              <div className="flex border-b border-gray-100">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-amber-400 text-amber-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.id === 'orders' && (customer as any).orders?.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded-full font-semibold">
                        {(customer as any).orders.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Tab body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {activeTab === 'overview' && (
                <OverviewTab customer={customer as User & { addresses?: any[] }} />
              )}
              {activeTab === 'orders' && (
                <OrdersTab orders={(customer as any).orders ?? []} />
              )}
              {activeTab === 'security' && (
                <SecurityTab customerId={customer.id} />
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400 p-8">
            <p className="text-sm">Customer not found.</p>
          </div>
        )}
      </aside>
    </>
  );
}
