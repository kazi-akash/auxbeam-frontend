import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '@/lib/types';

export function useAdminCategoryTree() {
  return useQuery({
    queryKey: queryKeys.admin.categories.tree(),
    queryFn: async () => {
      const res = await api.get('/api/admin/categories/tree');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminCategories(filters?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.categories.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/categories', { params: filters });
      return res.data;
    },
  });
}

export function useAdminCategory(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.categories.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/categories/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const res = await api.post('/api/admin/categories', payload);
      return res.data.data;
    },
    onSuccess: () => {
      // Invalidate with base prefix so ALL list variants (any filters/page) are refetched
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.categories() });
    },
  });
}

export function useAdminUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) => {
      const res = await api.put(`/api/admin/categories/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories.single(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.categories() });
    },
  });
}

export function useAdminDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.categories() });
    },
  });
}
