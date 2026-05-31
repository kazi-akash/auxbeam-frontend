import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { ProductFilters } from '@/lib/types';
import type { PaginatedData } from '@/lib/types/api';
import type { Product } from '@/lib/types/catalog';

/** Fetch a paginated, filterable list of products. */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.catalog.products(filters),
    queryFn: async () => {
      const res = await api.get('/api/catalog/products', { params: filters });
      return res.data.data;
    },
  });
}

/** Infinite-scroll product list for the shop page. */
export function useInfiniteProducts(filters?: Omit<ProductFilters, 'page'>) {
  return useInfiniteQuery<PaginatedData<Product>>({
    queryKey: ['catalog', 'products', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get('/api/catalog/products', {
        params: { ...filters, page: pageParam, per_page: filters?.per_page ?? 12 },
      });
      return res.data.data as PaginatedData<Product>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.next_page_url ? lastPage.current_page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
  });
}

/** Fetch a single product by slug. */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.catalog.product(slug),
    queryFn: async () => {
      const res = await api.get(`/api/catalog/products/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch up to 12 featured products (homepage). */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.catalog.featuredProducts(),
    queryFn: async () => {
      const res = await api.get('/api/catalog/products/featured');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch up to 12 trending products (homepage). */
export function useTrendingProducts() {
  return useQuery({
    queryKey: queryKeys.catalog.trendingProducts(),
    queryFn: async () => {
      const res = await api.get('/api/catalog/products/trending');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
