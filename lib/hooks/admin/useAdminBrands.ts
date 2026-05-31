import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CreateBrandPayload, UpdateBrandPayload } from '@/lib/types';

// ─── Brands ───────────────────────────────────────────────────────────────────

export function useAdminBrands(filters?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.brands.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/brands', { params: filters });
      return res.data;
    },
  });
}

export function useAdminBrand(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.brands.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/brands/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBrandPayload) => {
      const res = await api.post('/api/admin/brands', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.brands() });
    },
  });
}

export function useAdminUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateBrandPayload }) => {
      const res = await api.put(`/api/admin/brands/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.brands.single(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.brands() });
    },
  });
}

export function useAdminDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/brands/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.brands() });
    },
  });
}

// ─── Product Models ───────────────────────────────────────────────────────────

export function useAdminProductModels() {
  return useQuery({
    queryKey: queryKeys.admin.productModels.list(),
    queryFn: async () => {
      const res = await api.get('/api/admin/product-models');
      return res.data;
    },
  });
}

export function useAdminProductModel(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.productModels.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/product-models/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateProductModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.post('/api/admin/product-models', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.productModels.list() });
    },
  });
}

export function useAdminUpdateProductModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Record<string, unknown>;
    }) => {
      const res = await api.put(`/api/admin/product-models/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.productModels.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.productModels.single(id) });
    },
  });
}

export function useAdminDeleteProductModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/product-models/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.productModels.list() });
    },
  });
}
