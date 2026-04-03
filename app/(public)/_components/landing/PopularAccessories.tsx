import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Plus } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'AJ3500 Series 3500A Jump Starter with Air Compressor 120PSI',
    price: 15800.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/117f3af6005145671231712b162d65d5c7d82052.png',
    isNew: true,
  },
  {
    id: 2,
    name: 'Car Air Freshener 50ML (1.7 FL OZ) Car Air Fresheners Perfume',
    price: 1200.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/3606e82cc083bb3951c7efeee74f4be4609cea73.png',
    isNew: true,
  },
  {
    id: 3,
    name: 'Professional Grade Premium Microfiber Towels for Cars, Blue, 16" x 16"',
    price: 15800.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/3837f32852fd2c46e74fcf40f52d64779bb17582.png',
    isNew: true,
  },
  {
    id: 4,
    name: 'AJ3500 Series 3500A Jump Starter with Air Compressor 120PSI',
    price: 15800.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/117f3af6005145671231712b162d65d5c7d82052.png',
    isNew: true,
  },
  {
    id: 5,
    name: 'Chemical Guys MIC_1001 Microfiber Max 2-Faced Soft Touch Towel',
    price: 1100.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/e1ca62ec8ff20caeb2d8d90c6901af9954ed43ea.png',
    isNew: true,
  },
  {
    id: 6,
    name: 'Car Air Freshener 50ML (1.7 FL OZ) Car Air Fresheners Perfume',
    price: 1200.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/3606e82cc083bb3951c7efeee74f4be4609cea73.png',
    isNew: true,
  },
  {
    id: 7,
    name: 'AJ3500 Series 3500A Jump Starter with Air Compressor 120PSI',
    price: 15800.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/117f3af6005145671231712b162d65d5c7d82052.png',
    isNew: true,
  },
  {
    id: 8,
    name: 'Car Air Freshener 50ML (1.7 FL OZ) Car Air Fresheners Perfume',
    price: 1200.99,
    rating: 5,
    reviews: 132,
    image: '/images/landing/popular-accessories/ca7de4829b577a76cfb9e88005340553c7978055 (1).png',
    isNew: true,
  },
];

export default function PopularAccessories() {
  return (
    <section className="py-[100px] bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[32px] font-semibold text-[#111827]">Popular Accessories</h2>
          <Link 
            href="/shop" 
            className="flex items-center gap-2 text-[#111827] font-medium hover:text-[#FCE32D] transition-colors group"
          >
            <span className="underline">View All Accessories</span>
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
            <div 
              key={product.id} 
              className="bg-white rounded-[16px] overflow-hidden border border-[#E5E7EB] transition-shadow group"
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
                  <span className="text-base font-semibold text-[#111827]">
                    {product.price.toFixed(2)} BDT
                  </span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
