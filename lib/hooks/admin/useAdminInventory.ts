import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { AdjustInventoryPayload, BulkAdjustInventoryPayload } from '@/lib/types';

export function useAdminInventory(filters?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.inventory.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/inventory', { params: filters });
      return res.data;
    },
  });
}

export function useAdminLowStockProducts() {
  return useQuery({
    queryKey: queryKeys.admin.inventory.lowStock(),
    queryFn: async () => {
      const res = await api.get('/api/admin/inventory/low-stock');
      return res.data.data;
    },
  });
}

export function useAdminInventoryLogs() {
  return useQuery({
    queryKey: queryKeys.admin.inventory.logs(),
    queryFn: async () => {
      const res = await api.get('/api/admin/inventory/logs');
      return res.data;
    },
  });
}

export function useAdminProductInventory(productId: number) {
  return useQuery({
    queryKey: queryKeys.admin.inventory.product(productId),
    queryFn: async () => {
      const res = await api.get(`/api/admin/inventory/${productId}`);
      return res.data.data;
    },
    enabled: !!productId,
  });
}

export function useAdminAdjustInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      payload,
    }: {
      productId: number;
      payload: AdjustInventoryPayload;
    }) => {
      const res = await api.post(`/api/admin/inventory/${productId}/adjust`, payload);
      return res.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.inventory.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.inventory.product(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.inventory.lowStock() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

export function useAdminBulkAdjustInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkAdjustInventoryPayload) => {
      const res = await api.post('/api/admin/inventory/bulk-adjust', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.inventory.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.inventory.lowStock() });
    },
  });
}
