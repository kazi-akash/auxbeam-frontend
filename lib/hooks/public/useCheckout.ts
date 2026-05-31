import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  ShippingMethodsPayload,
  CheckoutPreviewPayload,
  CheckoutPayload,
} from '@/lib/types';

/** Fetch available shipping methods for the given cart + address. */
export function useShippingMethods() {
  return useMutation({
    mutationFn: async (payload: ShippingMethodsPayload) => {
      const res = await api.post('/api/checkout/shipping-methods', payload);
      return res.data.data;
    },
  });
}

/** Preview the checkout totals before placing the order. */
export function useCheckoutPreview() {
  return useMutation({
    mutationFn: async (payload: CheckoutPreviewPayload) => {
      const res = await api.post('/api/checkout/preview', payload);
      return res.data.data;
    },
  });
}

/** Place an order (supports both guest and authenticated users). */
export function useProcessCheckout() {
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const res = await api.post('/api/checkout/process', payload);
      return res.data.data;
    },
  });
}

/** Get the payment status for an order. */
export function usePaymentStatus(orderNumber: string) {
  return useQuery({
    queryKey: queryKeys.payments.status(orderNumber),
    queryFn: async () => {
      const res = await api.get(`/api/payments/${orderNumber}/status`);
      return res.data.data;
    },
    enabled: !!orderNumber,
    refetchInterval: (query) => {
      // Poll every 3 s while payment is still pending
      const status = query.state.data?.payment_status;
      return status === 'pending' ? 3000 : false;
    },
  });
}

/** Retry a failed payment for an existing order. */
export function useRetryPayment() {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const res = await api.post(`/api/payments/${orderNumber}/retry`);
      return res.data.data;
    },
  });
}

/** Pay the remaining balance on a preorder. */
export function usePayPreorderBalance() {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const res = await api.post(`/api/payments/${orderNumber}/pay-preorder-balance`);
      return res.data.data;
    },
  });
}
