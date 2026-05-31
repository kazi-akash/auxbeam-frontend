'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Loader2, Pencil, Trash2, Star, Package, Tag, Layers, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAdminProduct, useAdminDeleteProduct, useAdminUpdateProduct } from '@/lib/hooks/admin/useAdminProducts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function resolveImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:   { label: 'Active',   cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  inactive: { label: 'Inactive', cls: 'bg-gray-100   text-gray-500   border border-gray-200'    },
  draft:    { label: 'Draft',    cls: 'bg-gray-100   text-gray-500   border border-gray-200'    },
} as const;

const STOCK_CONFIG = {
  in_stock:     { label: 'In Stock',     cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  low_stock:    { label: 'Low Stock',    cls: 'bg-amber-50   text-amber-600   border border-amber-100'   },
  out_of_stock: { label: 'Out of Stock', cls: 'bg-red-50     text-red-500     border border-red-100'     },
} as const;

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-700 text-right">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const router = useRouter();

  const { data: product, isLoading } = useAdminProduct(productId);
  const deleteProduct = useAdminDeleteProduct();
  const updateProduct = useAdminUpdateProduct();

  function handleDelete() {
    if (!confirm(`Delete "${product?.name}"? This cannot be undone.`)) return;
    deleteProduct.mutate(productId, {
      onSuccess: () => {
        toast.success('Product deleted');
        router.push('/admin/products');
      },
      onError: () => toast.error('Failed to delete product'),
    });
  }

  function handleStatusChange(newStatus: 'active' | 'inactive' | 'draft') {
    updateProduct.mutate(
      { id: productId, payload: { status: newStatus } },
      {
        onSuccess: () => toast.success(`Status changed to ${newStatus}`),
        onError: () => toast.error('Failed to update status'),
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 text-gray-500">
        Product not found.{' '}
        <Link href="/admin/products" className="text-amber-600 hover:underline">Back to products</Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.active;
  const stockCfg = STOCK_CONFIG[product.stock_status] ?? STOCK_CONFIG.in_stock;
  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
  const primaryImageUrl = primaryImage ? resolveImageUrl(primaryImage.full_url) : null;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/products" className="hover:text-gray-700 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium truncate max-w-[300px]">{product.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center shrink-0">
            {product.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            {product.sku && <p className="text-xs text-gray-400 font-mono mt-0.5">{product.sku}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/admin/products/${productId}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left: Images ── */}
        <div className="space-y-4">
          {/* Primary image */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden aspect-square">
            {primaryImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primaryImageUrl} alt={primaryImage?.alt_text ?? product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img) => (
                <div key={img.id} className={`rounded-lg overflow-hidden border-2 aspect-square ${img.is_primary ? 'border-amber-400' : 'border-gray-100'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImageUrl(img.full_url)} alt={img.alt_text ?? ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Middle: Details ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Status + badges */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge label={statusCfg.label} cls={statusCfg.cls} />
                <Badge label={stockCfg.label} cls={stockCfg.cls} />
                {product.is_featured && <Badge label="Featured" cls="bg-purple-50 text-purple-600 border border-purple-100" />}
                {product.is_trending && <Badge label="Trending" cls="bg-blue-50 text-blue-600 border border-blue-100" />}
                {product.is_preorder && <Badge label="Pre-order" cls="bg-orange-50 text-orange-600 border border-orange-100" />}
              </div>
              {/* Quick status change */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Change status:</span>
                <select
                  value={product.status}
                  onChange={(e) => handleStatusChange(e.target.value as 'active' | 'inactive' | 'draft')}
                  disabled={updateProduct.isPending}
                  className="text-xs font-medium px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition disabled:opacity-50 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
              {product.compare_price && (
                <span className="text-lg text-gray-400 line-through">${Number(product.compare_price).toFixed(2)}</span>
              )}
            </div>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-1.5 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-gray-700">{Number(product.average_rating).toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.review_count} reviews)</span>
              </div>
            )}

            {/* Description */}
            {product.short_description && (
              <p className="text-sm text-gray-600 leading-relaxed">{product.short_description}</p>
            )}
          </div>

          {/* Core info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Product Info</h3>
            <InfoRow label="Category" value={
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                {product.category?.name}
              </span>
            } />
            <InfoRow label="Brand" value={
              product.brand ? (
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  {product.brand.name}
                </span>
              ) : '—'
            } />
            <InfoRow label="SKU" value={<span className="font-mono text-xs">{product.sku || '—'}</span>} />
            <InfoRow label="Quantity" value={product.quantity} />
            {product.low_stock_threshold && (
              <InfoRow label="Low Stock At" value={product.low_stock_threshold} />
            )}
            {product.cost_price && (
              <InfoRow label="Cost Price" value={`$${Number(product.cost_price).toFixed(2)}`} />
            )}
          </div>

          {/* Shipping */}
          {(product.weight || product.shipping_type) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Shipping
              </h3>
              <InfoRow label="Shipping Type" value={product.shipping_type ?? 'default'} />
              {product.weight && (
                <InfoRow label="Weight" value={`${product.weight} ${product.weight_unit ?? ''}`} />
              )}
              {product.length && (
                <InfoRow label="Dimensions" value={`${product.length} × ${product.width} × ${product.height} cm`} />
              )}
            </div>
          )}

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Variations ({product.variations.length})</h3>
              <div className="space-y-2">
                {product.variations.map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      {v.is_default && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Default</span>
                      )}
                      <span className="text-xs font-mono text-gray-500">{v.sku || '—'}</span>
                      {v.variation_values?.map((vv) => (
                        <span key={vv.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {vv.variation_option?.value}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-gray-800">${Number(v.price).toFixed(2)}</span>
                      <span className="text-gray-500">Qty: {v.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full description */}
          {product.description && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h3>
              <div
                className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
