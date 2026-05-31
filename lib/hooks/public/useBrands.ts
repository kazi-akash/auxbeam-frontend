import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CategoryProductFilters } from '@/lib/types';

/** Fetch all active brands. */
export function useBrands() {
  return useQuery({
    queryKey: queryKeys.catalog.brands(),
    queryFn: async () => {
      const res = await api.get('/api/catalog/brands');
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch paginated products belonging to a brand. */
export function useBrandProducts(slug: string, filters?: Omit<CategoryProductFilters, 'brand_id'>) {
  return useQuery({
    queryKey: queryKeys.catalog.brandProducts(slug, filters),
    queryFn: async () => {
      const res = await api.get(`/api/catalog/brands/${slug}/products`, {
        params: filters,
      });
      return res.data.data;
    },
    enabled: !!slug,
  });
}
