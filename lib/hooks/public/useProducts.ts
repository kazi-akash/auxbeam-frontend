import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export interface ProductFilters {
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// List products with filters
export const useProducts = (filters?: ProductFilters, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

// Get single product by slug
export const useProduct = (slug: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};

// Get featured products
export const useFeaturedProducts = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products/featured');
      return response.data;
    },
    ...options,
  });
};

// Get trending products
export const useTrendingProducts = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['products', 'trending'],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products/trending');
      return response.data;
    },
    ...options,
  });
};
