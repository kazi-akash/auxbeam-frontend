'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Filter, X, Search, Loader2 } from 'lucide-react';
import ShopHero from '@/app/(public)/_components/shop/ShopHero';
import ShopFilters from '@/app/(public)/_components/shop/ShopFilters';
import ProductGrid from '@/app/(public)/_components/shop/ProductGrid';
import { useInfiniteProducts } from '@/lib/hooks/public/useProducts';
import type { ProductFilters } from '@/lib/types';
import type { Product } from '@/lib/types/catalog';

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedBulbSizes, setSelectedBulbSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const filters: Omit<ProductFilters, 'page'> = {
    search: debouncedSearch || undefined,
    min_price: priceRange[0] || undefined,
    max_price: priceRange[1] < 100000 ? priceRange[1] : undefined,
    per_page: 12,
    ...(sortBy === 'price-asc' && { sort_by: 'price', sort_order: 'asc' }),
    ...(sortBy === 'price-desc' && { sort_by: 'price', sort_order: 'desc' }),
    ...(sortBy === 'name-asc' && { sort_by: 'name', sort_order: 'asc' }),
    ...(sortBy === 'name-desc' && { sort_by: 'name', sort_order: 'desc' }),
    ...(sortBy === 'newest' && { sort_by: 'created_at', sort_order: 'desc' }),
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts(filters);

  const rawProducts: Product[] = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const products = rawProducts.map((p) => {
    const primaryImage =
      p.images?.find((img) => img.is_primary)?.full_url ??
      p.images?.[0]?.full_url ??
      p.primary_image_url ??
      '';
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price),
      compare_price: p.compare_price ? parseFloat(p.compare_price) : undefined,
      primary_image: primaryImage,
      rating: p.average_rating,
      reviews: p.review_count,
      isNew: p.status === 'active' && !p.is_featured,
    };
  });

  // Intersection observer for infinite scroll
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '200px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <ShopHero />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle & Search */}
          <div className="lg:hidden space-y-4">
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
            <button
              onClick={() => setShowFilters(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* Left Sidebar - Filters */}
          <div className={`fixed lg:static inset-0 z-50 lg:z-auto ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div
              className="fixed inset-0 bg-black/50 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <div className={`
              fixed lg:static top-0 right-0 h-full lg:h-auto
              w-[85%] sm:w-[400px] lg:w-[280px]
              bg-white lg:bg-transparent
              overflow-y-auto lg:overflow-visible
              transform lg:transform-none transition-transform duration-300
              ${showFilters ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              flex-shrink-0
            `}>
              <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-gray-600 order-2 sm:order-1">
                {isLoading ? 'Loading...' : `${total} products available`}
              </p>

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
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
            />

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-px" />

            {/* Loading indicator */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}

            {/* End of results */}
            {!hasNextPage && products.length > 0 && !isLoading && (
              <p className="text-center text-sm text-gray-400 py-8">
                You&apos;ve reached the end of the results.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
