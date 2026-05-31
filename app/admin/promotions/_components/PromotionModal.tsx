'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Loader2, Search, Check, ChevronDown } from 'lucide-react';
import type { CreatePromotionPayload } from '@/lib/types/admin';
import type { Brand, Category, Product } from '@/lib/types/catalog';

// ─── Shared AdminPromotion type ───────────────────────────────────────────────

export interface AdminPromotion {
  id: number;
  name: string;
  description?: string | null;
  promotion_type: 'percentage' | 'fixed_amount' | 'flash_sale' | 'combo_offer' | 'free_delivery';
  discount_value: number;
  applies_to: 'all_products' | 'specific_products' | 'specific_brands' | 'specific_categories';
  apply_level: 'product' | 'cart';
  min_purchase_amount: number;
  max_discount_amount?: number | null;
  starts_at: string;
  ends_at: string;
  priority: number;
  is_active: boolean;
  products?: { id: number; name: string; sku?: string }[];
  brands?: { id: number; name: string }[];
  categories?: { id: number; name: string }[];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePromotionPayload) => void;
  loading: boolean;
  promotion?: AdminPromotion | null;
  // Data for pickers
  allProducts: Pick<Product, 'id' | 'name' | 'sku'>[];
  allBrands: Pick<Brand, 'id' | 'name'>[];
  allCategories: Pick<Category, 'id' | 'name'>[];
  loadingProducts?: boolean;
  loadingBrands?: boolean;
  loadingCategories?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return '';
  return iso.replace(' ', 'T').slice(0, 16);
}

function fromDatetimeLocal(val: string): string {
  return val ? val + ':00' : '';
}

const PROMOTION_TYPE_LABELS: Record<string, string> = {
  percentage: 'Percentage (%)',
  fixed_amount: 'Fixed Amount ($)',
  flash_sale: 'Flash Sale (%)',
  combo_offer: 'Combo Offer ($)',
  free_delivery: 'Free Delivery',
};

const APPLIES_TO_LABELS: Record<string, string> = {
  all_products: 'All Products',
  specific_products: 'Specific Products',
  specific_brands: 'Specific Brands',
  specific_categories: 'Specific Categories',
};

// ─── Multi-select picker ──────────────────────────────────────────────────────

interface MultiPickerProps {
  label: string;
  items: { id: number; name: string; sub?: string }[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  loading?: boolean;
  placeholder?: string;
}

function MultiPicker({ label, items, selectedIds, onChange, loading, placeholder }: MultiPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  const selectedNames = items
    .filter((i) => selectedIds.includes(i.id))
    .map((i) => i.name);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-amber-300 transition text-left"
      >
        <span className={`truncate ${selectedIds.length === 0 ? 'text-gray-400' : 'text-gray-800'}`}>
          {selectedIds.length === 0
            ? (placeholder ?? 'Select items...')
            : selectedIds.length === 1
            ? selectedNames[0]
            : `${selectedIds.length} selected`}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <ul className="max-h-48 overflow-y-auto py-1">
            {loading ? (
              <li className="px-3 py-3 text-xs text-gray-400 text-center">Loading...</li>
            ) : filtered.length === 0 ? (
              <li className="px-3 py-3 text-xs text-gray-400 text-center">No results</li>
            ) : (
              filtered.map((item) => {
                const selected = selectedIds.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left ${
                        selected ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          selected
                            ? 'bg-amber-400 border-amber-400'
                            : 'border-gray-300'
                        }`}
                      >
                        {selected && <Check className="w-2.5 h-2.5 text-black" />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block truncate text-gray-800">{item.name}</span>
                        {item.sub && (
                          <span className="block text-[10px] text-gray-400 font-mono">{item.sub}</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer */}
          {selectedIds.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">{selectedIds.length} selected</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  description: string;
  promotion_type: AdminPromotion['promotion_type'];
  discount_value: string;
  applies_to: AdminPromotion['applies_to'];
  apply_level: 'product' | 'cart';
  min_purchase_amount: string;
  max_discount_amount: string;
  starts_at: string;
  ends_at: string;
  priority: string;
  is_active: boolean;
  product_ids: number[];
  brand_ids: number[];
  category_ids: number[];
}

const EMPTY: FormState = {
  name: '',
  description: '',
  promotion_type: 'percentage',
  discount_value: '',
  applies_to: 'all_products',
  apply_level: 'product',
  min_purchase_amount: '',
  max_discount_amount: '',
  starts_at: '',
  ends_at: '',
  priority: '10',
  is_active: true,
  product_ids: [],
  brand_ids: [],
  category_ids: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PromotionModal({
  open,
  onClose,
  onSubmit,
  loading,
  promotion,
  allProducts,
  allBrands,
  allCategories,
  loadingProducts,
  loadingBrands,
  loadingCategories,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (!open) return;
    if (promotion) {
      setForm({
        name: promotion.name,
        description: promotion.description ?? '',
        promotion_type: promotion.promotion_type,
        discount_value: String(promotion.discount_value),
        applies_to: promotion.applies_to,
        apply_level: promotion.apply_level ?? 'product',
        min_purchase_amount: promotion.min_purchase_amount ? String(promotion.min_purchase_amount) : '',
        max_discount_amount: promotion.max_discount_amount ? String(promotion.max_discount_amount) : '',
        starts_at: toDatetimeLocal(promotion.starts_at),
        ends_at: toDatetimeLocal(promotion.ends_at),
        priority: String(promotion.priority ?? 10),
        is_active: promotion.is_active,
        product_ids: promotion.products?.map((p) => p.id) ?? [],
        brand_ids: promotion.brands?.map((b) => b.id) ?? [],
        category_ids: promotion.categories?.map((c) => c.id) ?? [],
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, promotion]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const isFreeDelivery = form.promotion_type === 'free_delivery';

    const payload: CreatePromotionPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      promotion_type: form.promotion_type,
      discount_value: isFreeDelivery ? 0 : Number(form.discount_value),
      applies_to: form.applies_to,
      apply_level: form.apply_level,
      min_purchase_amount: form.min_purchase_amount ? Number(form.min_purchase_amount) : undefined,
      max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : undefined,
      starts_at: fromDatetimeLocal(form.starts_at),
      ends_at: fromDatetimeLocal(form.ends_at),
      priority: form.priority ? Number(form.priority) : 10,
      is_active: form.is_active,
      product_ids: form.applies_to === 'specific_products' ? form.product_ids : undefined,
      brand_ids: form.applies_to === 'specific_brands' ? form.brand_ids : undefined,
      category_ids: form.applies_to === 'specific_categories' ? form.category_ids : undefined,
    };

    onSubmit(payload);
  }

  if (!open) return null;

  const isFreeDelivery = form.promotion_type === 'free_delivery';
  const showValueField = !isFreeDelivery;
  const isPercentage = form.promotion_type === 'percentage' || form.promotion_type === 'flash_sale';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {promotion ? 'Edit Promotion' : 'Create Promotion'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {promotion ? `Editing "${promotion.name}"` : 'Set up a new discount promotion'}
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

          {/* ── Name ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Promotion Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Summer Sale 20%"
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

          {/* ── Promotion Type + Discount Value ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Promotion Type <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={form.promotion_type}
                onChange={(e) => set('promotion_type', e.target.value as FormState['promotion_type'])}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                {Object.entries(PROMOTION_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Discount Value {showValueField && <span className="text-red-400">*</span>}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  {isPercentage ? '%' : '$'}
                </span>
                <input
                  type="number"
                  min={0}
                  max={isPercentage ? 100 : undefined}
                  step="0.01"
                  required={showValueField}
                  disabled={isFreeDelivery}
                  value={isFreeDelivery ? '' : form.discount_value}
                  onChange={(e) => set('discount_value', e.target.value)}
                  placeholder={isFreeDelivery ? 'N/A' : '0.00'}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* ── Apply Level ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Apply Level</label>
              <select
                value={form.apply_level}
                onChange={(e) => set('apply_level', e.target.value as 'product' | 'cart')}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                <option value="product">Per Product</option>
                <option value="cart">Entire Cart</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority</label>
              <input
                type="number"
                min={1}
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
          </div>

          {/* ── Min Purchase + Max Discount ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Min Purchase Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.min_purchase_amount}
                  onChange={(e) => set('min_purchase_amount', e.target.value)}
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
                  disabled={isFreeDelivery}
                  value={isFreeDelivery ? '' : form.max_discount_amount}
                  onChange={(e) => set('max_discount_amount', e.target.value)}
                  placeholder="No cap"
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* ── Date Range ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={form.starts_at}
                onChange={(e) => set('starts_at', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                End Date <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={form.ends_at}
                onChange={(e) => set('ends_at', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
          </div>

          {/* ── Applies To ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Applies To <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(APPLIES_TO_LABELS) as [AdminPromotion['applies_to'], string][]).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('applies_to', val)}
                  className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition text-left ${
                    form.applies_to === val
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Specific Products Picker ── */}
          {form.applies_to === 'specific_products' && (
            <MultiPicker
              label="Select Products"
              items={allProducts.map((p) => ({ id: p.id, name: p.name, sub: p.sku }))}
              selectedIds={form.product_ids}
              onChange={(ids) => set('product_ids', ids)}
              loading={loadingProducts}
              placeholder="Search and select products..."
            />
          )}

          {/* ── Specific Brands Picker ── */}
          {form.applies_to === 'specific_brands' && (
            <MultiPicker
              label="Select Brands"
              items={allBrands.map((b) => ({ id: b.id, name: b.name }))}
              selectedIds={form.brand_ids}
              onChange={(ids) => set('brand_ids', ids)}
              loading={loadingBrands}
              placeholder="Search and select brands..."
            />
          )}

          {/* ── Specific Categories Picker ── */}
          {form.applies_to === 'specific_categories' && (
            <MultiPicker
              label="Select Categories"
              items={allCategories.map((c) => ({ id: c.id, name: c.name }))}
              selectedIds={form.category_ids}
              onChange={(ids) => set('category_ids', ids)}
              loading={loadingCategories}
              placeholder="Search and select categories..."
            />
          )}

          {/* ── Active Status ── */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400 mt-0.5">Inactive promotions won't apply at checkout</p>
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
              {promotion ? 'Save Changes' : 'Create Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
