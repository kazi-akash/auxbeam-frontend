'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Upload, X, Star, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { CreateProductPayload, ProductVariationPayload } from '@/lib/types/admin';
import type { Product, ProductImage } from '@/lib/types/catalog';
import type { Brand, Category } from '@/lib/types/catalog';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingClass { id: number; name: string }
interface VariationType { id: number; name: string; options: VariationOption[] }
interface VariationOption { id: number; value: string }
interface ProductModel { id: number; name: string; brand_id?: number | null }

export interface LocalImage {
  id?: number;           // existing image id (edit mode)
  file?: File;           // new upload
  preview: string;       // data URL or full_url
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  _delete?: boolean;     // mark for deletion (edit mode)
}

export interface LocalVariation {
  id?: number;           // existing variation id (edit mode)
  sku: string;
  price: string;
  quantity: string;
  is_default: boolean;
  variation_values: number[];
  _delete?: boolean;
}

export interface ProductFormValues {
  // Basic
  name: string;
  sku: string;
  category_id: string;
  brand_id: string;
  model_id: string;
  shipping_class_id: string;
  status: 'active' | 'inactive' | 'draft';
  // Content
  short_description: string;
  description: string;
  // Pricing
  price: string;
  compare_price: string;
  cost_price: string;
  // Inventory
  quantity: string;
  low_stock_threshold: string;
  // Dimensions
  weight: string;
  weight_unit: 'g' | 'kg' | 'lb' | '';
  length: string;
  width: string;
  height: string;
  // Shipping
  shipping_type: 'default' | 'free' | 'fixed' | 'per_item';
  shipping_cost: string;
  requires_shipping: boolean;
  separate_shipping: boolean;
  shipping_notes: string;
  // Flags
  is_featured: boolean;
  is_trending: boolean;
  // Pre-order
  is_preorder: boolean;
  preorder_release_date: string;
  preorder_limit: string;
  preorder_deposit_amount: string;
  preorder_deposit_type: 'percentage' | 'fixed' | '';
  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

interface Props {
  initialProduct?: Product;
  categories: Category[];
  brands: Brand[];
  models: ProductModel[];
  shippingClasses: ShippingClass[];
  variationTypes: VariationType[];
  onSubmit: (payload: CreateProductPayload, images: LocalImage[], variations: LocalVariation[]) => void;
  loading: boolean;
  submitLabel?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: ProductFormValues = {
  name: '', sku: '', category_id: '', brand_id: '', model_id: '',
  shipping_class_id: '', status: 'active',
  short_description: '', description: '',
  price: '', compare_price: '', cost_price: '',
  quantity: '', low_stock_threshold: '',
  weight: '', weight_unit: '', length: '', width: '', height: '',
  shipping_type: 'default', shipping_cost: '',
  requires_shipping: true, separate_shipping: false, shipping_notes: '',
  is_featured: false, is_trending: false,
  is_preorder: false, preorder_release_date: '', preorder_limit: '',
  preorder_deposit_amount: '', preorder_deposit_type: '',
  meta_title: '', meta_description: '', meta_keywords: '',
};

function productToForm(p: Product & { model_id?: number | null; shipping_class_id?: number | null; shipping_cost?: string | null; separate_shipping?: boolean; shipping_notes?: string | null; meta_keywords?: string | null }): ProductFormValues {
  return {
    name: p.name ?? '',
    sku: p.sku ?? '',
    category_id: String(p.category?.id ?? ''),
    brand_id: String(p.brand?.id ?? ''),
    model_id: p.model_id ? String(p.model_id) : '',
    shipping_class_id: p.shipping_class_id ? String(p.shipping_class_id) : '',
    status: p.status ?? 'active',
    short_description: p.short_description ?? '',
    description: p.description ?? '',
    price: String(p.price ?? ''),
    compare_price: p.compare_price ? String(p.compare_price) : '',
    cost_price: p.cost_price ? String(p.cost_price) : '',
    quantity: p.quantity != null ? String(p.quantity) : '',
    low_stock_threshold: p.low_stock_threshold ? String(p.low_stock_threshold) : '',
    weight: p.weight ? String(p.weight) : '',
    weight_unit: (p.weight_unit as 'g' | 'kg' | 'lb') ?? '',
    length: p.length ? String(p.length) : '',
    width: p.width ? String(p.width) : '',
    height: p.height ? String(p.height) : '',
    shipping_type: (p.shipping_type as ProductFormValues['shipping_type']) ?? 'default',
    shipping_cost: p.shipping_cost ? String(p.shipping_cost) : '',
    requires_shipping: p.requires_shipping ?? true,
    separate_shipping: p.separate_shipping ?? false,
    shipping_notes: p.shipping_notes ?? '',
    is_featured: p.is_featured ?? false,
    is_trending: p.is_trending ?? false,
    is_preorder: p.is_preorder ?? false,
    preorder_release_date: p.preorder_release_date ?? '',
    preorder_limit: p.preorder_limit ? String(p.preorder_limit) : '',
    preorder_deposit_amount: p.preorder_deposit_amount ? String(p.preorder_deposit_amount) : '',
    preorder_deposit_type: p.preorder_deposit_type ?? '',
    meta_title: p.meta_title ?? '',
    meta_description: p.meta_description ?? '',
    meta_keywords: p.meta_keywords ?? '',
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function resolveImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function imagesToLocal(images: ProductImage[]): LocalImage[] {
  return images.map((img) => ({
    id: img.id,
    preview: resolveImageUrl(img.full_url),
    alt_text: img.alt_text ?? '',
    is_primary: img.is_primary,
    sort_order: img.sort_order,
  }));
}

function variationsToLocal(variations: Product['variations']): LocalVariation[] {
  if (!variations) return [];
  return variations.map((v) => ({
    id: v.id,
    sku: v.sku ?? '',
    price: String(v.price ?? ''),
    quantity: String(v.quantity ?? ''),
    is_default: v.is_default ?? false,
    variation_values: v.variation_values?.map((vv) => vv.variation_option?.id).filter(Boolean) as number[] ?? [],
  }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-700 border-b border-gray-100 hover:text-gray-900 transition-colors"
    >
      {title}
      {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400';
const SELECT = INPUT + ' bg-white';
const TEXTAREA = INPUT + ' resize-none';

// ─── Image Upload Panel ───────────────────────────────────────────────────────

function ImageUploadPanel({ images, onChange }: {
  images: LocalImage[];
  onChange: (imgs: LocalImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newImgs: LocalImage[] = Array.from(files).map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      alt_text: '',
      is_primary: images.filter(img => !img._delete).length === 0 && i === 0,
      sort_order: images.length + i,
    }));
    onChange([...images, ...newImgs]);
  }

  function setPrimary(idx: number) {
    onChange(images.map((img, i) => ({ ...img, is_primary: i === idx })));
  }

  function removeImage(idx: number) {
    const img = images[idx];
    if (img.id) {
      // existing — mark for deletion
      onChange(images.map((im, i) => i === idx ? { ...im, _delete: true } : im));
    } else {
      onChange(images.filter((_, i) => i !== idx));
    }
  }

  const visible = images.filter((img) => !img._delete);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-colors"
      >
        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Drop images here or <span className="text-amber-600 font-medium">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max 5 MB each, up to 10 images</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Thumbnails */}
      {visible.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {visible.map((img, visIdx) => {
            const realIdx = images.indexOf(img);
            return (
              <div key={visIdx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.preview} alt={img.alt_text || 'product'} className="w-full h-full object-cover" />
                {/* Primary badge */}
                {img.is_primary && (
                  <span className="absolute top-1 left-1 bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(realIdx)}
                      title="Set as primary"
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-amber-400 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(realIdx)}
                    title="Remove"
                    className="p-1.5 bg-white/90 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Variations Panel ─────────────────────────────────────────────────────────

function VariationsPanel({ variations, variationTypes, onChange }: {
  variations: LocalVariation[];
  variationTypes: VariationType[];
  onChange: (v: LocalVariation[]) => void;
}) {
  function addRow() {
    onChange([...variations, { sku: '', price: '', quantity: '', is_default: false, variation_values: [] }]);
  }

  function removeRow(idx: number) {
    const v = variations[idx];
    if (v.id) {
      onChange(variations.map((row, i) => i === idx ? { ...row, _delete: true } : row));
    } else {
      onChange(variations.filter((_, i) => i !== idx));
    }
  }

  function updateRow(idx: number, key: keyof LocalVariation, value: unknown) {
    onChange(variations.map((row, i) => i === idx ? { ...row, [key]: value } : row));
  }

  function toggleOption(idx: number, optionId: number) {
    const current = variations[idx].variation_values;
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    updateRow(idx, 'variation_values', next);
  }

  const visible = variations.filter((v) => !v._delete);

  return (
    <div className="space-y-3">
      {visible.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No variations yet. Add one below.</p>
      )}

      {variations.map((v, idx) => {
        if (v._delete) return null;
        return (
          <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Variation #{idx + 1}</span>
              <button type="button" onClick={() => removeRow(idx)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">SKU</label>
                <input type="text" value={v.sku} onChange={(e) => updateRow(idx, 'sku', e.target.value)}
                  placeholder="VAR-001" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price ($)</label>
                <input type="number" min="0" step="0.01" value={v.price} onChange={(e) => updateRow(idx, 'price', e.target.value)}
                  placeholder="0.00" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
                <input type="number" min="0" value={v.quantity} onChange={(e) => updateRow(idx, 'quantity', e.target.value)}
                  placeholder="0" className={INPUT} />
              </div>
            </div>

            {/* Variation options */}
            {variationTypes.length > 0 && (
              <div className="space-y-2">
                {variationTypes.map((vt) => (
                  <div key={vt.id}>
                    <p className="text-xs font-semibold text-gray-500 mb-1.5">{vt.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {vt.options.map((opt) => {
                        const selected = v.variation_values.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleOption(idx, opt.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                              selected
                                ? 'bg-amber-400 border-amber-400 text-black'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
                            }`}
                          >
                            {opt.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={v.is_default} onChange={(e) => updateRow(idx, 'is_default', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300" />
              <span className="text-xs text-gray-600">Default variation</span>
            </label>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Variation
      </button>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function ProductForm({
  initialProduct,
  categories,
  brands,
  models,
  shippingClasses,
  variationTypes,
  onSubmit,
  loading,
  submitLabel = 'Save Product',
}: Props) {
  const [form, setForm] = useState<ProductFormValues>(
    initialProduct ? productToForm(initialProduct) : EMPTY_FORM
  );
  const [images, setImages] = useState<LocalImage[]>(
    initialProduct ? imagesToLocal(initialProduct.images ?? []) : []
  );
  const [variations, setVariations] = useState<LocalVariation[]>(
    initialProduct ? variationsToLocal(initialProduct.variations) : []
  );

  // Section open/close state
  const [sections, setSections] = useState({
    basic: true, content: true, pricing: true, inventory: true,
    shipping: false, flags: false, preorder: false, seo: false,
  });

  useEffect(() => {
    if (initialProduct) {
      setForm(productToForm(initialProduct));
      setImages(imagesToLocal(initialProduct.images ?? []));
      setVariations(variationsToLocal(initialProduct.variations));
    }
  }, [initialProduct]);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function toggleSection(key: keyof typeof sections) {
    setSections((s) => ({ ...s, [key]: !s[key] }));
  }

  // Filter models by selected brand
  const filteredModels = form.brand_id
    ? models.filter((m) => !m.brand_id || m.brand_id === Number(form.brand_id))
    : models;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: CreateProductPayload = {
      name: form.name,
      category_id: Number(form.category_id),
      brand_id: form.brand_id ? Number(form.brand_id) : null,
      model_id: form.model_id ? Number(form.model_id) : null,
      shipping_class_id: form.shipping_class_id ? Number(form.shipping_class_id) : null,
      sku: form.sku || undefined,
      short_description: form.short_description || undefined,
      description: form.description || undefined,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      cost_price: form.cost_price ? Number(form.cost_price) : null,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      low_stock_threshold: form.low_stock_threshold ? Number(form.low_stock_threshold) : undefined,
      weight: form.weight ? Number(form.weight) : null,
      weight_unit: (form.weight_unit as 'g' | 'kg' | 'lb') || null,
      length: form.length ? Number(form.length) : null,
      width: form.width ? Number(form.width) : null,
      height: form.height ? Number(form.height) : null,
      shipping_type: form.shipping_type,
      shipping_cost: form.shipping_cost ? Number(form.shipping_cost) : null,
      requires_shipping: form.requires_shipping,
      separate_shipping: form.separate_shipping,
      shipping_notes: form.shipping_notes || null,
      is_featured: form.is_featured,
      is_trending: form.is_trending,
      status: form.status,
      meta_title: form.meta_title || undefined,
      meta_description: form.meta_description || undefined,
      meta_keywords: form.meta_keywords || undefined,
      is_preorder: form.is_preorder,
      preorder_release_date: form.preorder_release_date || null,
      preorder_limit: form.preorder_limit ? Number(form.preorder_limit) : null,
      preorder_deposit_amount: form.preorder_deposit_amount ? Number(form.preorder_deposit_amount) : null,
      preorder_deposit_type: (form.preorder_deposit_type as 'percentage' | 'fixed') || null,
      images: images
        .filter((img) => !img._delete && (img.file || img.preview))
        .map((img, i) => ({
          file: img.file,
          path: img.id ? undefined : undefined,
          alt_text: img.alt_text,
          is_primary: img.is_primary,
          sort_order: i,
        })),
      variations: variations
        .filter((v) => !v._delete)
        .map((v) => ({
          sku: v.sku,
          price: Number(v.price),
          quantity: Number(v.quantity),
          is_default: v.is_default,
          variation_values: v.variation_values,
        })) as ProductVariationPayload[],
    };

    onSubmit(payload, images, variations);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column (main fields) ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="Basic Information" open={sections.basic} onToggle={() => toggleSection('basic')} />
            {sections.basic && (
              <div className="pt-4 space-y-4">
                <Field label="Product Name" required>
                  <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
                    placeholder="e.g. LED Light Bar 50 inch" className={INPUT} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="SKU">
                    <input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)}
                      placeholder="e.g. LB-50-LED" className={INPUT} />
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => set('status', e.target.value as ProductFormValues['status'])} className={SELECT}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" required>
                    <select required value={form.category_id} onChange={(e) => set('category_id', e.target.value)} className={SELECT}>
                      <option value="" disabled>— Select category —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Brand">
                    <select value={form.brand_id} onChange={(e) => { set('brand_id', e.target.value); set('model_id', ''); }} className={SELECT}>
                      <option value="">— No brand —</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Model">
                    <select value={form.model_id} onChange={(e) => set('model_id', e.target.value)} className={SELECT}>
                      <option value="">— No model —</option>
                      {filteredModels.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Shipping Class">
                    <select value={form.shipping_class_id} onChange={(e) => set('shipping_class_id', e.target.value)} className={SELECT}>
                      <option value="">— Default —</option>
                      {shippingClasses.map((sc) => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="Content" open={sections.content} onToggle={() => toggleSection('content')} />
            {sections.content && (
              <div className="pt-4 space-y-4">
                <Field label="Short Description">
                  <textarea rows={2} value={form.short_description} onChange={(e) => set('short_description', e.target.value)}
                    placeholder="Brief product summary..." className={TEXTAREA} />
                </Field>
                <Field label="Full Description">
                  <textarea rows={6} value={form.description} onChange={(e) => set('description', e.target.value)}
                    placeholder="Detailed product description..." className={TEXTAREA} />
                </Field>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="Pricing" open={sections.pricing} onToggle={() => toggleSection('pricing')} />
            {sections.pricing && (
              <div className="pt-4 grid grid-cols-3 gap-4">
                <Field label="Price ($)" required>
                  <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)}
                    placeholder="0.00" className={INPUT} />
                </Field>
                <Field label="Compare Price ($)">
                  <input type="number" min="0" step="0.01" value={form.compare_price} onChange={(e) => set('compare_price', e.target.value)}
                    placeholder="0.00" className={INPUT} />
                </Field>
                <Field label="Cost Price ($)">
                  <input type="number" min="0" step="0.01" value={form.cost_price} onChange={(e) => set('cost_price', e.target.value)}
                    placeholder="0.00" className={INPUT} />
                </Field>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="Inventory" open={sections.inventory} onToggle={() => toggleSection('inventory')} />
            {sections.inventory && (
              <div className="pt-4 grid grid-cols-2 gap-4">
                <Field label="Quantity">
                  <input type="number" min="0" value={form.quantity} onChange={(e) => set('quantity', e.target.value)}
                    placeholder="0" className={INPUT} />
                </Field>
                <Field label="Low Stock Threshold">
                  <input type="number" min="0" value={form.low_stock_threshold} onChange={(e) => set('low_stock_threshold', e.target.value)}
                    placeholder="5" className={INPUT} />
                </Field>
              </div>
            )}
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="Shipping & Dimensions" open={sections.shipping} onToggle={() => toggleSection('shipping')} />
            {sections.shipping && (
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Shipping Type">
                    <select value={form.shipping_type} onChange={(e) => set('shipping_type', e.target.value as ProductFormValues['shipping_type'])} className={SELECT}>
                      <option value="default">Default</option>
                      <option value="free">Free Shipping</option>
                      <option value="fixed">Fixed Cost</option>
                      <option value="per_item">Per Item</option>
                    </select>
                  </Field>
                  {(form.shipping_type === 'fixed' || form.shipping_type === 'per_item') && (
                    <Field label="Shipping Cost ($)">
                      <input type="number" min="0" step="0.01" value={form.shipping_cost} onChange={(e) => set('shipping_cost', e.target.value)}
                        placeholder="0.00" className={INPUT} />
                    </Field>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.requires_shipping} onChange={(e) => set('requires_shipping', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300" />
                    <span className="text-sm text-gray-600">Requires shipping</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.separate_shipping} onChange={(e) => set('separate_shipping', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300" />
                    <span className="text-sm text-gray-600">Ships separately</span>
                  </label>
                </div>

                <Field label="Shipping Notes">
                  <input type="text" value={form.shipping_notes} onChange={(e) => set('shipping_notes', e.target.value)}
                    placeholder="Any special shipping instructions..." className={INPUT} />
                </Field>

                <div className="grid grid-cols-4 gap-3">
                  <Field label="Weight">
                    <input type="number" min="0" step="0.01" value={form.weight} onChange={(e) => set('weight', e.target.value)}
                      placeholder="0" className={INPUT} />
                  </Field>
                  <Field label="Unit">
                    <select value={form.weight_unit} onChange={(e) => set('weight_unit', e.target.value as ProductFormValues['weight_unit'])} className={SELECT}>
                      <option value="">—</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </Field>
                  <Field label="Length (cm)">
                    <input type="number" min="0" step="0.01" value={form.length} onChange={(e) => set('length', e.target.value)}
                      placeholder="0" className={INPUT} />
                  </Field>
                  <Field label="Width (cm)">
                    <input type="number" min="0" step="0.01" value={form.width} onChange={(e) => set('width', e.target.value)}
                      placeholder="0" className={INPUT} />
                  </Field>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <Field label="Height (cm)">
                    <input type="number" min="0" step="0.01" value={form.height} onChange={(e) => set('height', e.target.value)}
                      placeholder="0" className={INPUT} />
                  </Field>
                </div>
              </div>
            )}
          </div>

          {/* Pre-order */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="Pre-order" open={sections.preorder} onToggle={() => toggleSection('preorder')} />
            {sections.preorder && (
              <div className="pt-4 space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_preorder} onChange={(e) => set('is_preorder', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300" />
                  <span className="text-sm font-medium text-gray-700">Enable pre-order</span>
                </label>
                {form.is_preorder && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Release Date">
                      <input type="datetime-local" value={form.preorder_release_date} onChange={(e) => set('preorder_release_date', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label="Pre-order Limit">
                      <input type="number" min="1" value={form.preorder_limit} onChange={(e) => set('preorder_limit', e.target.value)}
                        placeholder="Unlimited" className={INPUT} />
                    </Field>
                    <Field label="Deposit Amount">
                      <input type="number" min="0" step="0.01" value={form.preorder_deposit_amount} onChange={(e) => set('preorder_deposit_amount', e.target.value)}
                        placeholder="0.00" className={INPUT} />
                    </Field>
                    <Field label="Deposit Type">
                      <select value={form.preorder_deposit_type} onChange={(e) => set('preorder_deposit_type', e.target.value as ProductFormValues['preorder_deposit_type'])} className={SELECT}>
                        <option value="">— None —</option>
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed ($)</option>
                      </select>
                    </Field>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="SEO" open={sections.seo} onToggle={() => toggleSection('seo')} />
            {sections.seo && (
              <div className="pt-4 space-y-4">
                <Field label="Meta Title">
                  <input type="text" value={form.meta_title} onChange={(e) => set('meta_title', e.target.value)}
                    placeholder="SEO title..." className={INPUT} maxLength={255} />
                </Field>
                <Field label="Meta Description">
                  <textarea rows={3} value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)}
                    placeholder="SEO description..." className={TEXTAREA} />
                </Field>
                <Field label="Meta Keywords">
                  <input type="text" value={form.meta_keywords} onChange={(e) => set('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, ..." className={INPUT} maxLength={255} />
                </Field>
              </div>
            )}
          </div>

          {/* Variations */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3 mb-4">Variations</h3>
            <VariationsPanel
              variations={variations}
              variationTypes={variationTypes}
              onChange={setVariations}
            />
          </div>
        </div>

        {/* ── Right column (images + flags) ── */}
        <div className="space-y-4">

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3 mb-4">Product Images</h3>
            <ImageUploadPanel images={images} onChange={setImages} />
          </div>

          {/* Flags */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <SectionHeader title="Flags" open={sections.flags} onToggle={() => toggleSection('flags')} />
            {sections.flags && (
              <div className="pt-4 space-y-3">
                {([
                  ['is_featured', 'Featured product'],
                  ['is_trending', 'Trending product'],
                ] as [keyof ProductFormValues, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key] as boolean}
                      onChange={(e) => set(key, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300"
                    />
                    <span className="text-sm text-gray-600">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
