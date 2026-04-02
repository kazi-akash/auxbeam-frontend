'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  reviews: number;
  rating: number;
  isNew?: boolean;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Starlight Flow Series 7 Inch 135W DOT Approved LED Headlights',
    image: '/images/recomended-products/39db9bb6e766a1a8bda82aa1ad3036da2bec7455.png',
    price: 31250.99,
    reviews: 132,
    rating: 5,
    isNew: true,
  },
  {
    id: '2',
    name: 'RAY-L Series | 9 Inch 318W 34180LM Dual DRL Off road LED Driving Lights',
    image: '/images/recomended-products/d70d127ae71127f104505449aacdd64ec8ba5c67.png',
    price: 33750.99,
    reviews: 132,
    rating: 5,
    isNew: true,
  },
  {
    id: '3',
    name: 'NEW 22 Inch 5D-PRO Series 22000LM Beam Off Road Light Bar',
    image: '/images/recomended-products/d53416e1c627c85dee29459bb69f18dcbe176d49.png',
    price: 26625.99,
    reviews: 132,
    rating: 5,
    isNew: true,
  },
  {
    id: '4',
    name: 'V-ULTRA Series | 3 Inch 108W LED Side Shooter Amber Pod Lights',
    image: '/images/recomended-products/3c5afda968021674bf33bee95d37dc7ed3e980af.png',
    price: 24400.99,
    reviews: 132,
    rating: 5,
    isNew: true,
  },
];

export default function YouMayAlsoLike() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">You May Also Like</h2>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm transition-colors border border-gray-200">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#ffd700] hover:bg-[#ffc700] flex items-center justify-center shadow-sm transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
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
                {/* New Badge */}
                {product.isNew && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#3B82F6] text-white text-xs font-medium px-2.5 py-1 rounded">
                      New
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlist.has(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
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
                  <span className="text-xs text-[#6B7280]">
                    ({product.reviews} Reviews)
                  </span>
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-[#111827]">
                      {product.price.toFixed(2)} BDT
                    </span>
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
