import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

/** Track an order by order number (public, no auth required). */
export function useTrackOrder(orderNumber: string) {
  return useQuery({
    queryKey: queryKeys.orders.track(orderNumber),
    queryFn: async () => {
      const res = await api.get(`/api/orders/${orderNumber}/track`);
      return res.data.data;
    },
    enabled: !!orderNumber,
  });
}

/** Fetch order details by order number (public; auth verifies ownership). */
export function useOrderDetails(orderNumber: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderNumber),
    queryFn: async () => {
      const res = await api.get(`/api/orders/${orderNumber}`);
      return res.data.data;
    },
    enabled: !!orderNumber,
  });
}
