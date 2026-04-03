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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
      {products.map((product) => {
        const discount = product.compare_price
          ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
          : null;

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-[16px] overflow-hidden border border-[#E5E7EB] transition-shadow group cursor-pointer hover:shadow-lg block w-[313px] h-[405px] flex flex-col"
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

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-gray-100 transition-colors"
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
                    // Add to cart logic here
                  }}
                  className="h-8 px-2 rounded bg-[#FCE32D] flex items-center justify-center gap-1 hover:bg-[#e6cc28] transition-colors flex-shrink-0"
                  aria-label="Add to cart"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span className="text-[14px] font-[600] text-black">Cart</span>
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
