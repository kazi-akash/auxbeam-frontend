'use client';

import { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import ShopHero from '@/app/(public)/_components/shop/ShopHero';
import ShopFilters from '@/app/(public)/_components/shop/ShopFilters';
import ProductGrid from '@/app/(public)/_components/shop/ProductGrid';

// Mock products data - same as BestSellingProducts
const mockProducts = [
  {
    id: 1,
    slug: 'f2-series-10000lm-52w-led-headlight-bulbs',
    name: 'F2 Series 10000LM 52W LED Headlight Bulbs 6500K Cool White',
    price: 6000.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/2e7873338809bb4c9d78fb2995a6bc2026e5f1aa.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 2,
    slug: 'f16-plus-series-16000lm-70w-led-headlight-bulbs',
    name: 'F-16 PLUS Series 16000LM 70W LED Headlight Bulbs 6000K Cool White',
    price: 8550.99,
    compare_price: 9600.99,
    primary_image: '/images/landing/best-selling-products/6c3a6ef62f11f9fae812d5d2fdbd02f0a1bfe18f.png',
    rating: 5,
    reviews: 132,
    isNew: false,
  },
  {
    id: 3,
    slug: 'gx-series-25000lm-120w-led-headlight-bulbs',
    name: 'GX Series 25000LM 120W LED Headlight Bulbs 6500K Cool White',
    price: 11500.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/a5375ec89708c75248641ad73a28e3c292df0e86.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 4,
    slug: 'gx-bi-color-smart-series-25000lm-110w',
    name: 'GX Bi-Color Smart Series 25000LM 110W LED Headlight Bulbs',
    price: 15000.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/ade0c4fff24ab52c0f15d7211ed1b4843770e341.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 5,
    slug: '168-2825-w5w-t10-led-license-plate',
    name: '168 2825 W5W T10 LED License Plate/Side Marker/Interior Light Bulbs',
    price: 1500.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/c2e74d7b9cc01f3e22c4e0b882d5cc3732648957.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 6,
    slug: 't20-7443-7440-led-4000lm-turn-signal',
    name: 'T20 7443 7440 LED 4000LM Turn Signal Light Bulbs Rear/Front',
    price: 5000.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/c599842c23cd93b27236dcf3bbd37e5d63d5fd33.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 7,
    slug: '168-2825-w5w-t10-led-license-plate-2',
    name: '168 2825 W5W T10 LED License Plate/Side Marker/Interior Light',
    price: 1500.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/efc3c1017f528f09b465a135b4db16307d7cd056.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 8,
    slug: '3-inch-136w-6000k-double-hyperboloid',
    name: '3 Inch 136W 6000K Double Hyperboloid Bi-LED Headlight',
    price: 36248.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/fadc04fd87ccc319e6502fabf7cf58c452a180a9.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 9,
    slug: 'f2-series-10000lm-52w-led-headlight-bulbs-2',
    name: 'F2 Series 10000LM 52W LED Headlight Bulbs 6500K Cool White',
    price: 6000.99,
    compare_price: 7000.99,
    primary_image: '/images/landing/best-selling-products/2e7873338809bb4c9d78fb2995a6bc2026e5f1aa.png',
    rating: 5,
    reviews: 132,
    isNew: false,
  },
  {
    id: 10,
    slug: 'gx-series-25000lm-120w-led-headlight-bulbs-2',
    name: 'GX Series 25000LM 120W LED Headlight Bulbs 6500K Cool White',
    price: 11500.99,
    compare_price: 12500.99,
    primary_image: '/images/landing/best-selling-products/a5375ec89708c75248641ad73a28e3c292df0e86.png',
    rating: 5,
    reviews: 132,
    isNew: false,
  },
  {
    id: 11,
    slug: 't20-7443-7440-led-4000lm-turn-signal-2',
    name: 'T20 7443 7440 LED 4000LM Turn Signal Light Bulbs Rear/Front',
    price: 5000.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/c599842c23cd93b27236dcf3bbd37e5d63d5fd33.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 12,
    slug: '3-inch-136w-6000k-double-hyperboloid-2',
    name: '3 Inch 136W 6000K Double Hyperboloid Bi-LED Headlight',
    price: 36248.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/fadc04fd87ccc319e6502fabf7cf58c452a180a9.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 13,
    slug: 'f16-plus-series-16000lm-70w-led-headlight-bulbs-2',
    name: 'F-16 PLUS Series 16000LM 70W LED Headlight Bulbs 6000K Cool White',
    price: 8550.99,
    compare_price: 9600.99,
    primary_image: '/images/landing/best-selling-products/6c3a6ef62f11f9fae812d5d2fdbd02f0a1bfe18f.png',
    rating: 5,
    reviews: 132,
    isNew: false,
  },
  {
    id: 14,
    slug: 'gx-bi-color-smart-series-25000lm-110w-2',
    name: 'GX Bi-Color Smart Series 25000LM 110W LED Headlight Bulbs',
    price: 15000.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/ade0c4fff24ab52c0f15d7211ed1b4843770e341.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
  {
    id: 15,
    slug: '168-2825-w5w-t10-led-license-plate-3',
    name: '168 2825 W5W T10 LED License Plate/Side Marker/Interior Light Bulbs',
    price: 1500.99,
    compare_price: undefined,
    primary_image: '/images/landing/best-selling-products/c2e74d7b9cc01f3e22c4e0b882d5cc3732648957.png',
    rating: 5,
    reviews: 132,
    isNew: true,
  },
];

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedBulbSizes, setSelectedBulbSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('products');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const itemsPerPage = 9;
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = mockProducts.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      {/* Hero Section */}
      <ShopHero />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle & Search */}
          <div className="lg:hidden space-y-4">
            {/* Search Bar - Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* Left Sidebar - Filters */}
          <div className={`
            fixed lg:static inset-0 z-50 lg:z-auto
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}>
            {/* Mobile Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Filter Panel */}
            <div className={`
              fixed lg:static top-0 right-0 h-full lg:h-auto
              w-[85%] sm:w-[400px] lg:w-[280px]
              bg-white lg:bg-transparent
              overflow-y-auto lg:overflow-visible
              transform lg:transform-none transition-transform duration-300
              ${showFilters ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              flex-shrink-0
            `}>
              {/* Mobile Header */}
              <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters Content */}
              <div className="p-4 lg:p-0">
                <ShopFilters
                  selectedCategory={undefined}
                  onCategoryChange={() => {}}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedSeries={selectedSeries}
                  onSeriesChange={setSelectedSeries}
                  selectedBulbSizes={selectedBulbSizes}
                  onBulbSizeChange={setSelectedBulbSizes}
                />
              </div>

              {/* Mobile Apply Button */}
              <div className="lg:hidden sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="flex-1 min-w-0">
            {/* Header with count, search and sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Product Count */}
              <p className="text-sm text-gray-600 order-2 sm:order-1">
                {mockProducts.length} products are available
              </p>

              {/* Search Bar - Desktop/Tablet */}
              <div className="hidden lg:block flex-1 max-w-md mx-4 order-1 sm:order-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 order-3">
                <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap hidden sm:block">
                  Sort By
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                >
                  <option value="products">Products</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={currentProducts} isLoading={false} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
