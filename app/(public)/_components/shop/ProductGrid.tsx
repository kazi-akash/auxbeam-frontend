'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Plus } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const discount = product.compare_price
          ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
          : null;

        return (
          <div
            key={product.id}
            className="bg-white rounded-[16px] overflow-hidden border border-[#E5E7EB] transition-shadow group"
            style={{ boxShadow: '0px 2px 30px 0px rgba(0, 0, 0, 0.08)' }}
          >
            {/* Image Container */}
            <div className="relative aspect-square bg-white p-6">
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

              {/* Wishlist Button */}
              <button
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4 text-gray-600" />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-full">
                <Image
                  src={product.primary_image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 bg-[#F6F5F4]">
              {/* Product Name */}
              <h3 className="text-sm text-[#111827] font-normal mb-3 line-clamp-2 min-h-[40px]">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (product.rating || 5)
                          ? 'fill-[#FBBF24] text-[#FBBF24]'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6B7280]">
                  ({product.reviews || 132} Reviews)
                </span>
              </div>

              {/* Price and Cart */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[#111827]">
                    {product.price.toFixed(2)} BDT
                  </span>
                  {product.compare_price && (
                    <span className="text-xs text-[#9CA3AF] line-through">
                      {product.compare_price.toFixed(2)} BDT
                    </span>
                  )}
                </div>
                <button
                  className="h-9 px-4 rounded bg-[#FCE32D] flex items-center justify-center gap-1 hover:bg-[#e6cc28] transition-colors"
                  aria-label="Add to cart"
                >
                  <Plus className="w-5 h-5 text-black" />
                  <span className="text-sm font-medium text-black">Cart</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
