'use client';

import { useState } from 'react';
import { useProducts } from '@/lib/hooks/public/useProducts';
import { useCategories } from '@/lib/hooks/public/useCategories';
import Pagination from '@/components/ui/Pagination';
import { getImageUrl } from '@/lib/utils/image';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopPage() {
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 12,
    category_id: undefined as number | undefined,
    search: '',
    sort_by: 'created_at' as 'price' | 'name' | 'created_at',
    sort_order: 'desc' as 'asc' | 'desc',
  });

  const { data: productsData, isLoading, error } = useProducts(filters);
  const { data: categoriesData } = useCategories();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Unable to load products. Please make sure the backend API is running.</p>
          <p className="text-sm mt-2">API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          {/* Search */}
          <div>
            <label className="block font-semibold mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          {categoriesData?.data && (
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilters({ ...filters, category_id: undefined, page: 1 })}
                  className={`block w-full text-left px-4 py-2 rounded ${
                    !filters.category_id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categoriesData.data.map((category: any) => (
                  <button
                    key={category.id}
                    onClick={() => setFilters({ ...filters, category_id: category.id, page: 1 })}
                    className={`block w-full text-left px-4 py-2 rounded ${
                      filters.category_id === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort */}
          <div>
            <label className="block font-semibold mb-2">Sort By</label>
            <select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onChange={(e) => {
                const [sort_by, sort_order] = e.target.value.split('-');
                setFilters({
                  ...filters,
                  sort_by: sort_by as any,
                  sort_order: sort_order as any,
                  page: 1,
                });
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {productsData?.data?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData?.data?.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={getImageUrl(product.primary_image)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </p>
                      {product.compare_price && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.compare_price}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {productsData?.last_page > 1 && (
                <Pagination
                  currentPage={productsData.current_page}
                  totalPages={productsData.last_page}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
