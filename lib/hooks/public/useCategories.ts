import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

// Get all categories
export const useCategories = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/api/catalog/categories');
      return response.data;
    },
    ...options,
  });
};

// Get single category
export const useCategory = (id: number, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};
