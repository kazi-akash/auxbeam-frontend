'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Plus } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'F2 Series 10000LM 52W LED Headlight Bulbs 6500K Cool White',
    price: 6000.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/2e7873338809bb4c9d78fb2995a6bc2026e5f1aa.png',
    isNew: true,
  },
  {
    id: 2,
    name: 'F-16 PLUS Series 16000LM 70W LED Headlight Bulbs 6000K Cool White',
    price: 8550.99,
    originalPrice: 9600.99,
    discount: '10% Off',
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/6c3a6ef62f11f9fae812d5d2fdbd02f0a1bfe18f.png',
    isNew: false,
  },
  {
    id: 3,
    name: 'GX Series 25000LM 120W LED Headlight Bulbs 6500K Cool White',
    price: 11500.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/a5375ec89708c75248641ad73a28e3c292df0e86.png',
    isNew: true,
  },
  {
    id: 4,
    name: 'GX Bi-Color Smart Series 25000LM 110W LED Headlight Bulbs',
    price: 15000.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/ade0c4fff24ab52c0f15d7211ed1b4843770e341.png',
    isNew: true,
  },
  {
    id: 5,
    name: '168 2825 W5W T10 LED License Plate/Side Marker/Interior Light Bulbs',
    price: 1500.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/c2e74d7b9cc01f3e22c4e0b882d5cc3732648957.png',
    isNew: true,
  },
  {
    id: 6,
    name: 'T20 7443 7440 LED 4000LM Turn Signal Light Bulbs Rear/Front',
    price: 5000.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/c599842c23cd93b27236dcf3bbd37e5d63d5fd33.png',
    isNew: true,
  },
  {
    id: 7,
    name: '168 2825 W5W T10 LED License Plate/Side Marker/Interior Light',
    price: 1500.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/efc3c1017f528f09b465a135b4db16307d7cd056.png',
    isNew: true,
  },
  {
    id: 8,
    name: '3 Inch 136W 6000K Double Hyperboloid Bi-LED Headlight',
    price: 36248.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 132,
    image: '/images/landing/best-selling-products/fadc04fd87ccc319e6502fabf7cf58c452a180a9.png',
    isNew: true,
  },
];

export default function BestSellingProducts() {
  return (
    <section className="py-[100px] bg-[#F9FAFB]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[32px] font-semibold text-[#111827]">Best Selling Product</h2>
          <Link 
            href="/shop" 
            className="flex items-center gap-2 text-[#111827] font-medium hover:text-[#FCE32D] transition-colors group"
          >
            <span className="underline">View All Products</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              className="group-hover:translate-x-1 transition-transform"
            >
              <path 
                d="M7.5 15L12.5 10L7.5 5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-[16px] overflow-hidden border border-[#E5E7EB] transition-shadow group cursor-pointer hover:shadow-lg block"
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
                  {product.discount && (
                    <span className="bg-[#EF4444] text-white text-xs font-medium px-2.5 py-1 rounded">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>

                {/* Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                          i < product.rating 
                            ? 'fill-[#FBBF24] text-[#FBBF24]' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#6B7280]">({product.reviews} Reviews)</span>
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-[#111827]">
                      {product.price.toFixed(2)} BDT
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#9CA3AF] line-through">
                        {product.originalPrice.toFixed(2)} BDT
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                    className="h-9 px-4 rounded bg-[#FCE32D] flex items-center justify-center gap-1 hover:bg-[#e6cc28] transition-colors"
                    aria-label="Add to cart"
                  >
                    <Plus className="w-5 h-5 text-black" />
                    <span className="text-sm font-medium text-black">Cart</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
