import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { PosCalculatePayload, CreatePosOrderPayload } from '@/lib/types';

/** Search products by name or SKU for the POS interface. */
export function usePosProductSearch(q: string) {
  return useQuery({
    queryKey: queryKeys.admin.pos.productSearch(q),
    queryFn: async () => {
      const res = await api.get('/api/admin/pos/products/search', { params: { q } });
      return res.data.data;
    },
    enabled: q.length >= 2,
  });
}

/** Fetch a product by its exact SKU. */
export function usePosProductBySku() {
  return useMutation({
    mutationFn: async (sku: string) => {
      const res = await api.get(`/api/admin/pos/products/sku/${sku}`);
      return res.data.data;
    },
  });
}

/** Calculate POS order totals (with optional coupon). */
export function usePosCalculate() {
  return useMutation({
    mutationFn: async (payload: PosCalculatePayload) => {
      const res = await api.post('/api/admin/pos/calculate', payload);
      return res.data.data;
    },
  });
}

/** Create an in-store POS order. */
export function useCreatePosOrder() {
  return useMutation({
    mutationFn: async (payload: CreatePosOrderPayload) => {
      const res = await api.post('/api/admin/pos/orders', payload);
      return res.data.data;
    },
  });
}
