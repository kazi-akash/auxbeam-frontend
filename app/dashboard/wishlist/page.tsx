'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Loader2, ArrowUpDown, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useWishlist, useRemoveFromWishlist, useClearWishlist } from '@/lib/hooks/customer/useWishlist';
import { useCart } from '@/lib/context/CartContext';
import type { WishlistItem } from '@/lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: string | number) {
  return parseFloat(String(price)).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

// Gradient placeholders cycling through brand palette
const GRADIENTS = [
  'from-yellow-300 to-orange-400',
  'from-gray-400 to-gray-600',
  'from-yellow-200 to-yellow-400',
  'from-gray-200 to-gray-400',
  'from-orange-200 to-orange-400',
  'from-pink-200 to-rose-400',
  'from-amber-200 to-amber-400',
  'from-sky-200 to-sky-400',
];

// Fake badge logic based on product id — just for visual variety
function getBadge(item: WishlistItem): string | null {
  const mod = item.product.id % 5;
  if (mod === 0) return 'NEW';
  if (mod === 1) return 'BESTSELLER';
  if (mod === 2) return 'SALE';
  return null;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function WishlistCard({ item, index }: { item: WishlistItem; index: number }) {
  const remove = useRemoveFromWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const imageUrl =
    item.product.images?.find((img) => img.is_primary)?.full_url ??
    item.product.images?.[0]?.full_url ??
    item.product.primary_image_url ??
    null;

  const badge = getBadge(item);
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const inStock = item.product.stock_status !== 'out_of_stock';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            unoptimized
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}

        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 bg-[#FCE32D] text-gray-900 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}

        {/* Remove (heart) button */}
        <button
          onClick={() => remove.mutate(item.id)}
          disabled={remove.isPending}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-50"
          title="Remove from wishlist"
        >
          {remove.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <Link
          href={`/products/${item.product.slug}`}
          className="text-sm font-semibold text-gray-900 hover:underline line-clamp-1"
        >
          {item.product.name}
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-gray-900">{formatPrice(item.product.price)}</span>
          {/* Show a fake original price for SALE badge items */}
          {badge === 'SALE' && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(parseFloat(String(item.product.price)) * 1.25)}
            </span>
          )}
        </div>

        <p className={`text-xs mt-0.5 font-medium ${inStock ? 'text-gray-500' : 'text-red-500'}`}>
          {inStock
            ? item.product.stock_status === 'low_stock'
              ? `Only ${Math.floor(Math.random() * 4) + 1} left`
              : 'In stock'
            : 'Out of stock'}
        </p>

        <button
          type="button"
          disabled={!inStock || added}
          onClick={() => {
            addItem({
              product_id: item.product.id,
              quantity: 1,
              product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                price: parseFloat(item.product.price),
                image: imageUrl ?? '',
              },
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-4 py-2 transition-colors disabled:opacity-50
            bg-[#FCE32D] hover:bg-[#e6cc28] text-gray-900 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {added ? 'Added!' : inStock ? 'Add to cart' : 'Out of stock'}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'name';

export default function WishlistPage() {
  const { data: wishlistItems, isLoading, isError } = useWishlist();
  const clearWishlist = useClearWishlist();
  const [sort, setSort] = useState<SortKey>('newest');
  const [showSort, setShowSort] = useState(false);

  const items: WishlistItem[] = wishlistItems ?? [];

  const sorted = [...items].sort((a, b) => {
    if (sort === 'price_asc') return parseFloat(a.product.price) - parseFloat(b.product.price);
    if (sort === 'price_desc') return parseFloat(b.product.price) - parseFloat(a.product.price);
    if (sort === 'name') return a.product.name.localeCompare(b.product.name);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const SORT_LABELS: Record<SortKey, string> = {
    newest: 'Newest first',
    price_asc: 'Price: low to high',
    price_desc: 'Price: high to low',
    name: 'Name A–Z',
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center">
        <p className="text-sm font-medium text-gray-700">Failed to load wishlist.</p>
        <p className="text-xs text-gray-400 mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <Heart className="w-12 h-12 text-gray-200 mb-4" />
        <p className="text-base font-semibold text-gray-800">Your wishlist is empty</p>
        <p className="text-sm text-gray-400 mt-1">Browse the shop and save items you love.</p>
        <Link
          href="/shop"
          className="mt-5 px-5 py-2.5 text-sm font-semibold text-gray-900 bg-[#FCE32D] hover:bg-[#e6cc28] rounded-xl transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#FCE32D] text-gray-900 px-3 py-1 rounded-full mb-3">
          Saved for later
        </span>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your wishlist</h1>
            <p className="text-sm text-gray-500 mt-1">Curated pieces you've loved. Add to cart when you're ready.</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sort */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                  {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setSort(key); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === key ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Move all to cart */}
            <button
              type="button"
              disabled={clearWishlist.isPending}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 bg-[#FCE32D] hover:bg-[#e6cc28] rounded-xl px-4 py-2 transition-colors disabled:opacity-60"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Move all to cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((item, i) => (
          <WishlistCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
