'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Plus, X, LogIn, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist, useAddToWishlist, useRemoveFromWishlistByProduct } from '@/lib/hooks/customer/useWishlist';
import type { WishlistItem } from '@/lib/types';

// ── Login prompt modal ────────────────────────────────────────────────────────

function LoginPrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Sign in to save items</h3>
        <p className="text-xs text-gray-400 mb-5">Create a wishlist and save products you love for later.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Wishlist button (per-product) ─────────────────────────────────────────────

function WishlistButton({ productId, isLoggedIn, wishlistProductIds, onLoginPrompt }: {
  productId: number;
  isLoggedIn: boolean;
  wishlistProductIds: Set<number>;
  onLoginPrompt: () => void;
}) {
  const add = useAddToWishlist();
  const remove = useRemoveFromWishlistByProduct();

  const inWishlist = wishlistProductIds.has(productId);
  const busy = add.isPending || remove.isPending;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { onLoginPrompt(); return; }
    if (inWishlist) {
      remove.mutate(productId);
    } else {
      add.mutate(productId);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy && isLoggedIn}
      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-60"
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {busy && isLoggedIn ? (
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      ) : (
        <Heart
          className={`w-4 h-4 transition-colors ${
            inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`}
        />
      )}
    </button>
  );
}

// ── Product Grid ──────────────────────────────────────────────────────────────

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  compare_price?: number;
  primary_image: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { data: wishlistItems } = useWishlist({ enabled: !!user });
  const wishlistProductIds = new Set<number>(
    (wishlistItems as WishlistItem[] | undefined)?.map((item) => item.product_id) ?? []
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-[16px] mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {products.map((product) => {
          const discount = product.compare_price
            ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
            : null;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="bg-white rounded-[16px] overflow-hidden border border-[#E5E7EB] transition-shadow group cursor-pointer hover:shadow-lg block w-full sm:max-w-[313px] mx-auto h-[405px] flex flex-col"
              style={{ boxShadow: '0px 2px 30px 0px rgba(0, 0, 0, 0.08)' }}
            >
              {/* Image Container */}
              <div className="relative w-full h-[250px] bg-white p-6 flex-shrink-0">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-[#3B82F6] text-white text-xs font-medium px-2.5 py-1 rounded">
                      New
                    </span>
                  )}
                  {discount && (
                    <span className="bg-[#EF4444] text-white text-xs font-medium px-2.5 py-1 rounded">
                      {discount}% Off
                    </span>
                  )}
                </div>

                <WishlistButton
                  productId={product.id}
                  isLoggedIn={!!user}
                  wishlistProductIds={wishlistProductIds}
                  onLoginPrompt={() => setShowLoginPrompt(true)}
                />

                {/* Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={product.primary_image}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 bg-[#F6F5F4] flex-1 flex flex-col">
                {/* Product Name */}
                <h3 className="text-[14px] text-[#12100E] font-[400] mb-2 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (product.rating || 5)
                            ? 'fill-[#ff8904] text-[#ff8904]'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#4D4C44] underline">
                    ({product.reviews || 132} Reviews)
                  </span>
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between mt-[16px]">
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] font-[600] text-[#12100E]">
                      {product.price.toFixed(2)} BDT
                    </span>
                    {product.compare_price && (
                      <span className="text-[12px] font-[400] text-[#9CA3AF] line-through">
                        {product.compare_price.toFixed(2)} BDT
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addItem({
                        product_id: product.id,
                        quantity: 1,
                        product: {
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          compare_price: product.compare_price,
                          image: product.primary_image,
                        },
                      });
                      setAddedIds((prev) => {
                        const next = new Set(prev);
                        next.add(product.id);
                        setTimeout(() => setAddedIds((s) => { const n = new Set(s); n.delete(product.id); return n; }), 1500);
                        return next;
                      });
                    }}
                    className="h-8 px-2 rounded bg-[#FCE32D] flex items-center justify-center gap-1 hover:bg-[#e6cc28] transition-colors flex-shrink-0"
                    aria-label="Add to cart"
                  >
                    {addedIds.has(product.id) ? (
                      <Check className="w-4 h-4 text-black" />
                    ) : (
                      <Plus className="w-4 h-4 text-black" />
                    )}
                    <span className="text-[14px] font-[600] text-black">Cart</span>
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}
    </>
  );
}
