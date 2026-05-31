import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  CartSummaryPayload,
  ValidateCouponPayload,
  CheckAvailabilityPayload,
} from '@/lib/types';

/**
 * Compute cart totals, apply promotions, and optionally validate a coupon.
 * Works for both guests and authenticated users.
 */
export function useCartSummary() {
  return useMutation({
    mutationFn: async (payload: CartSummaryPayload) => {
      const res = await api.post('/api/cart/summary', payload);
      return res.data.data;
    },
  });
}

/** Validate a coupon code against the current cart. */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: async (payload: ValidateCouponPayload) => {
      const res = await api.post('/api/cart/validate-coupon', payload);
      return res.data.data;
    },
  });
}

/** Check whether a product (+ optional variation) has enough stock. */
export function useCheckAvailability() {
  return useMutation({
    mutationFn: async (payload: CheckAvailabilityPayload) => {
      const res = await api.post('/api/cart/check-availability', payload);
      return res.data.data;
    },
  });
}

/** Fetch all publicly available coupons. */
export function useAvailableCoupons() {
  return useQuery({
    queryKey: queryKeys.cart.availableCoupons(),
    queryFn: async () => {
      const res = await api.get('/api/cart/available-coupons');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
