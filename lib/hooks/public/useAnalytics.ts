import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface PageViewPayload {
  page_url: string;
  page_title?: string;
  referrer?: string;
  session_id?: string;
}

interface ProductViewPayload {
  product_id: number;
  session_id?: string;
}

interface CartEventPayload {
  event_type: 'add_to_cart' | 'remove_from_cart' | 'update_cart';
  product_id: number;
  quantity: number;
  session_id?: string;
}

interface SearchPayload {
  query: string;
  results_count?: number;
  session_id?: string;
}

/** Fire-and-forget analytics hooks — errors are silently swallowed. */

export function useTrackPageView() {
  return useMutation({
    mutationFn: async (payload: PageViewPayload) => {
      const res = await api.post('/api/analytics/track/page-view', payload);
      return res.data;
    },
    onError: () => {
      // Analytics failures must never surface to the user
    },
  });
}

export function useTrackProductView() {
  return useMutation({
    mutationFn: async (payload: ProductViewPayload) => {
      const res = await api.post('/api/analytics/track/product-view', payload);
      return res.data;
    },
    onError: () => {},
  });
}

export function useTrackCartEvent() {
  return useMutation({
    mutationFn: async (payload: CartEventPayload) => {
      const res = await api.post('/api/analytics/track/cart-event', payload);
      return res.data;
    },
    onError: () => {},
  });
}

export function useTrackCheckout() {
  return useMutation({
    mutationFn: async (payload?: Record<string, unknown>) => {
      const res = await api.post('/api/analytics/track/checkout', payload);
      return res.data;
    },
    onError: () => {},
  });
}

export function useTrackSearch() {
  return useMutation({
    mutationFn: async (payload: SearchPayload) => {
      const res = await api.post('/api/analytics/track/search', payload);
      return res.data;
    },
    onError: () => {},
  });
}

/** Submit visitor popup (newsletter / lead capture). */
export function useVisitorPopup() {
  return useMutation({
    mutationFn: async (payload: { email: string; name?: string; phone?: string }) => {
      const res = await api.post('/api/visitor-popup', payload);
      return res.data;
    },
  });
}
