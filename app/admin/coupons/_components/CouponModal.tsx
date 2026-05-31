'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, RefreshCw, Copy, Check } from 'lucide-react';
import type { CreateCouponPayload } from '@/lib/types/admin';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminCoupon {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed_amount' | 'free_shipping';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  applies_to: 'all_products' | 'specific_products' | 'specific_brands' | 'specific_categories';
  usage_limit?: number | null;
  usage_count: number;
  once_per_customer: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
  is_active: boolean;
  usages_count?: number;
  products?: { id: number; name: string }[];
  brands?: { id: number; name: string }[];
  categories?: { id: number; name: string }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCouponPayload) => void;
  loading: boolean;
  coupon?: AdminCoupon | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return '';
  // Convert "2026-12-31 23:59:59" or ISO to datetime-local format
  return iso.replace(' ', 'T').slice(0, 16);
}

function fromDatetimeLocal(val: string): string {
  if (!val) return '';
  return val + ':00'; // append seconds
}

// Map backend enum → frontend payload value
function toPayloadDiscountType(v: string): CreateCouponPayload['discount_type'] {
  return v as CreateCouponPayload['discount_type'];
}

function toPayloadAppliesTo(v: string): CreateCouponPayload['applies_to'] {
  return v as CreateCouponPayload['applies_to'];
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  code: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_shipping';
  discount_value: string;
  min_order_amount: string;
  max_discount_amount: string;
  applies_to: 'all_products' | 'specific_products' | 'specific_categories';
  usage_limit: string;
  once_per_customer: boolean;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
}

const EMPTY: FormState = {
  code: '',
  name: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_amount: '',
  max_discount_amount: '',
  applies_to: 'all_products',
  usage_limit: '',
  once_per_customer: true,
  starts_at: '',
  expires_at: '',
  is_active: true,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CouponModal({ open, onClose, onSubmit, loading, coupon }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (coupon) {
      setForm({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description ?? '',
        discount_type: coupon.discount_type,
        discount_value: String(coupon.discount_value),
        min_order_amount: coupon.min_order_amount ? String(coupon.min_order_amount) : '',
        max_discount_amount: coupon.max_discount_amount ? String(coupon.max_discount_amount) : '',
        applies_to: coupon.applies_to === 'specific_brands' ? 'all_products' : coupon.applies_to,
        usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : '',
        once_per_customer: coupon.once_per_customer,
        starts_at: toDatetimeLocal(coupon.starts_at),
        expires_at: toDatetimeLocal(coupon.expires_at),
        is_active: coupon.is_active,
      });
    } else {
      setForm({ ...EMPTY, code: generateCode() });
    }
  }, [open, coupon]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleGenerateCode() {
    set('code', generateCode());
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(form.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: CreateCouponPayload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      discount_type: toPayloadDiscountType(form.discount_type),
      discount_value: form.discount_type === 'free_shipping' ? 0 : Number(form.discount_value),
      min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : undefined,
      max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : undefined,
      applies_to: toPayloadAppliesTo(form.applies_to),
      usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
      once_per_customer: form.once_per_customer,
      starts_at: form.starts_at ? fromDatetimeLocal(form.starts_at) : undefined,
      expires_at: form.expires_at ? fromDatetimeLocal(form.expires_at) : undefined,
      is_active: form.is_active,
    };

    onSubmit(payload);
  }

  if (!open) return null;

  const isFreeShipping = form.discount_type === 'free_shipping';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {coupon ? 'Edit Coupon' : 'Create Coupon'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {coupon ? `Editing ${coupon.code}` : 'Set up a new discount coupon'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* ── Code ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Coupon Code <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="e.g. SAVE10"
                maxLength={50}
                className="flex-1 px-3.5 py-2.5 text-sm font-mono border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 uppercase"
              />
              <button
                type="button"
                onClick={handleGenerateCode}
                title="Generate random code"
                className="px-3 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy code"
                className="px-3 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ── Name ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Display Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. 10% Off All Orders"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400"
            />
          </div>

          {/* ── Description ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description shown to customers..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* ── Discount Type + Value ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Discount Type <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={form.discount_type}
                onChange={(e) => set('discount_type', e.target.value as FormState['discount_type'])}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed Amount ($)</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Discount Value {!isFreeShipping && <span className="text-red-400">*</span>}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  {form.discount_type === 'percentage' ? '%' : '$'}
                </span>
                <input
                  type="number"
                  min={0}
                  max={form.discount_type === 'percentage' ? 100 : undefined}
                  step="0.01"
                  required={!isFreeShipping}
                  disabled={isFreeShipping}
                  value={isFreeShipping ? '' : form.discount_value}
                  onChange={(e) => set('discount_value', e.target.value)}
                  placeholder={isFreeShipping ? 'N/A' : '0.00'}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* ── Min Order + Max Discount ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Min Order Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.min_order_amount}
                  onChange={(e) => set('min_order_amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Max Discount Cap</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  disabled={isFreeShipping}
                  value={isFreeShipping ? '' : form.max_discount_amount}
                  onChange={(e) => set('max_discount_amount', e.target.value)}
                  placeholder="No cap"
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* ── Applies To ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Applies To</label>
            <select
              value={form.applies_to}
              onChange={(e) => set('applies_to', e.target.value as FormState['applies_to'])}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
            >
              <option value="all_products">All Products</option>
              <option value="specific_products">Specific Products</option>
              <option value="specific_categories">Specific Categories</option>
            </select>
            {form.applies_to !== 'all_products' && (
              <p className="mt-1.5 text-[11px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                After saving, you can assign specific {form.applies_to === 'specific_products' ? 'products' : 'categories'} to this coupon from the coupon detail view.
              </p>
            )}
          </div>

          {/* ── Usage Limit + Once Per Customer ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Total Usage Limit</label>
              <input
                type="number"
                min={1}
                value={form.usage_limit}
                onChange={(e) => set('usage_limit', e.target.value)}
                placeholder="Unlimited"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Per Customer</label>
              <select
                value={form.once_per_customer ? 'once' : 'unlimited'}
                onChange={(e) => set('once_per_customer', e.target.value === 'once')}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                <option value="once">Once per customer</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>

          {/* ── Date Range ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Date</label>
              <input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => set('starts_at', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Date</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => set('expires_at', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
          </div>

          {/* ── Status ── */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400 mt-0.5">Inactive coupons cannot be applied at checkout</p>
            </div>
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.is_active ? 'bg-amber-400' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.is_active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {coupon ? 'Save Changes' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
