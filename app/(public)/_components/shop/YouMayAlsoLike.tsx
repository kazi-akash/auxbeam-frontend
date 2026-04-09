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
    <section className="py-[100px] bg-[#F9FAFB]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[24px] md:text-[32px] font-[600] text-[#12100E]">You May Also Like</h2>
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#D1D5DB] transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-[#6A7282]" />
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-[#FCE32D] flex items-center justify-center hover:bg-[#e6cc28] transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-[#12100E]" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 justify-items-center">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-[16px] overflow-hidden border border-[#E5E7EB] transition-shadow group cursor-pointer hover:shadow-lg block w-full max-w-[313px] h-[405px] flex flex-col"
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
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-gray-100 transition-colors"
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
              <div className="p-4 bg-[#F6F5F4] flex-1 flex flex-col">
                {/* Product Name */}
                <h3 className="text-sm md:text-[14px] text-[#12100E] font-[400] mb-2 line-clamp-2 min-h-[40px] leading-relaxed break-words">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < product.rating 
                            ? 'fill-[#ff8904] text-[#ff8904]' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs md:text-[11px] text-[#4D4C44] underline">({product.reviews} Reviews)</span>
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between mt-[16px]">
                  <div className="flex items-center gap-3">
                    <span className="text-sm md:text-base lg:text-[16px] font-[600] text-[#12100E]">
                      {product.price.toFixed(2)} BDT
                    </span>
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
                    <span className="text-sm md:text-[14px] font-[600] text-black">Cart</span>
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
