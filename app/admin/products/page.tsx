'use client';

import { useState, useCallback } from 'react';
import { useAdminProducts } from '@/lib/hooks/admin/useAdminProducts';
import { useAdminDeleteProduct } from '@/lib/hooks/admin/useAdminProducts';
import type { Product } from '@/lib/types/catalog';
import { SlidersHorizontal, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_CONFIG = {
  active:    { label: 'Active',       cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  inactive:  { label: 'Inactive',     cls: 'bg-gray-100   text-gray-500   border border-gray-200'    },
  draft:     { label: 'Draft',        cls: 'bg-gray-100   text-gray-500   border border-gray-200'    },
} as const;

const STOCK_CONFIG = {
  in_stock:     { label: 'Active',      cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  low_stock:    { label: 'Low Stock',   cls: 'bg-amber-50   text-amber-600   border border-amber-100'   },
  out_of_stock: { label: 'Out of Stock',cls: 'bg-red-50     text-red-500     border border-red-100'     },
} as const;

function StatusBadge({ product }: { product: Product }) {
  if (product.stock_status === 'out_of_stock') {
    const cfg = STOCK_CONFIG.out_of_stock;
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>{cfg.label}</span>;
  }
  if (product.stock_status === 'low_stock') {
    const cfg = STOCK_CONFIG.low_stock;
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>{cfg.label}</span>;
  }
  const cfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.active;
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>{cfg.label}</span>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function resolveImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function getProductImageUrl(product: Product): string | null {
  if (product.primary_image_url) return product.primary_image_url;
  const primary = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
  return primary?.full_url ?? null;
}

// Renders product thumbnail; falls back to initials avatar on load error
function ProductAvatar({ name, imageUrl }: { name: string; imageUrl?: string | null }) {
  const resolved = imageUrl ? resolveImageUrl(imageUrl) : null;

  if (!resolved) {
    return (
      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 select-none">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-lg shrink-0 overflow-hidden border border-gray-100 bg-amber-100 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolved}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = 'none';
          // show the initials text sibling
          const fallback = img.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <span
        style={{ display: 'none' }}
        className="text-amber-700 text-xs font-bold w-full h-full items-center justify-center select-none"
      >
        {getInitials(name)}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // Debounce search
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  }, []);

  const { data, isLoading, isFetching } = useAdminProducts({
    search: debouncedSearch || undefined,
    page,
    per_page: PER_PAGE,
  });

  const deleteProduct = useAdminDeleteProduct();

  // Handle both response shapes:
  // Shape A (Laravel paginator): { success, data: { current_page, data: [...], last_page, total } }
  // Shape B (custom wrapper):    { success, data: [...], pagination: { total, last_page } }
  const isLaravelPaginator = data?.data && !Array.isArray(data.data) && Array.isArray(data.data?.data);
  const products: Product[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data ?? []);
  const total: number =
    data?.pagination?.total ??
    data?.data?.total ??
    products.length;
  const lastPage: number =
    data?.pagination?.last_page ??
    data?.data?.last_page ??
    Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);
  void isLaravelPaginator; // used only for shape detection above

  function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    deleteProduct.mutate(product.id, {
      onSuccess: () => toast.success('Product deleted'),
      onError: () => toast.error('Failed to delete product'),
    });
  }

  // Build page numbers to show (max 3 around current)
  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading ? (
                /* Skeleton rows */
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse" />
                        <div className="h-3.5 w-40 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Product name + avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProductAvatar name={product.name} imageUrl={getProductImageUrl(product)} />
                        <span className="font-medium text-gray-800 leading-snug line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-4 text-gray-500 font-mono text-xs tracking-wide">
                      {product.sku || '—'}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-gray-600">
                      {product.category?.name ?? '—'}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 font-semibold text-gray-800">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4 text-gray-700 font-medium">
                      {product.quantity}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge product={product} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400">
              Showing {from}–{to} of <span className="font-medium text-gray-600">{total.toLocaleString()} products</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${
                    n === page
                      ? 'bg-amber-400 text-black border border-amber-400'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
