'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, Loader2, ExternalLink } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist } from '@/lib/hooks/customer/useWishlist';
import type { WishlistItem } from '@/lib/types';

function WishlistCard({ item }: { item: WishlistItem }) {
  const remove = useRemoveFromWishlist();
  const imageUrl =
    item.product.images?.find((img) => img.is_primary)?.full_url ??
    item.product.images?.[0]?.full_url ??
    item.product.primary_image_url;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
      {/* Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className="w-20 h-20 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden relative"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            unoptimized
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-gray-200" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.product.slug}`}
            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug"
          >
            {item.product.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            {item.product.category && (
              <span className="text-xs text-gray-400">{item.product.category.name}</span>
            )}
            {item.product.brand && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">{item.product.brand.name}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-gray-900">
            {parseFloat(item.product.price).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            })}
          </span>
          <div className="flex items-center gap-1">
            <Link
              href={`/products/${item.product.slug}`}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              title="View product"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => remove.mutate(item.id)}
              disabled={remove.isPending}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Remove from wishlist"
            >
              {remove.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { data: wishlistItems, isLoading, isError } = useWishlist();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Wishlist</h2>
          <p className="text-xs text-gray-400 mt-0.5">Products you've saved for later</p>
        </div>
        {!isLoading && wishlistItems?.length > 0 && (
          <span className="text-xs text-gray-400">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-medium text-gray-700">Failed to load wishlist.</p>
          <p className="text-xs text-gray-400 mt-1">Please try refreshing the page.</p>
        </div>
      )}

      {!isLoading && !isError && wishlistItems?.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-700">Your wishlist is empty</p>
          <p className="text-xs text-gray-400 mt-1">Browse the shop and save items you love.</p>
          <Link
            href="/shop"
            className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#FCE32D] rounded-lg hover:bg-[#e6cc28] transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      )}

      {!isLoading && !isError && wishlistItems?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlistItems.map((item: WishlistItem) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
