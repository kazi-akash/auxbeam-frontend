import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { OrderFilters, CancelOrderPayload } from '@/lib/types';

/** Fetch the authenticated customer's order history. */
export function useMyOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders.myOrders(filters),
    queryFn: async () => {
      const res = await api.get('/api/orders', { params: filters });
      return res.data;
    },
  });
}

/** Cancel an order owned by the authenticated customer. */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderNumber,
      payload,
    }: {
      orderNumber: string;
      payload: CancelOrderPayload;
    }) => {
      const res = await api.post(`/api/orders/${orderNumber}/cancel`, payload);
      return res.data;
    },
    onSuccess: (_, { orderNumber }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderNumber) });
    },
  });
}

/**
 * Download the PDF invoice for an order.
 * Returns a Blob — the caller is responsible for triggering the browser download.
 */
export function useDownloadInvoice() {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const res = await api.get(`/api/orders/${orderNumber}/invoice`, {
        responseType: 'blob',
      });
      return res.data as Blob;
    },
  });
}
