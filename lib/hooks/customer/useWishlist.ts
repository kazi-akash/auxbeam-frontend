import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

/** Fetch the authenticated customer's wishlist. */
export function useWishlist(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.wishlist.all(),
    queryFn: async () => {
      const res = await api.get('/api/wishlist');
      return res.data.data;
    },
    enabled: options?.enabled !== false,
    staleTime: 60 * 1000,
  });
}

/** Check whether a specific product is in the wishlist. */
export function useWishlistCheck(productId: number) {
  return useQuery({
    queryKey: queryKeys.wishlist.check(productId),
    queryFn: async () => {
      const res = await api.get(`/api/wishlist/check/${productId}`);
      return res.data.data as { in_wishlist: boolean };
    },
    enabled: !!productId,
    staleTime: 60 * 1000,
  });
}

/** Add a product to the wishlist. */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await api.post('/api/wishlist', { product_id: productId });
      return res.data.data;
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.check(productId) });
    },
  });
}

/** Remove a wishlist item by its wishlist entry ID. */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/wishlist/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
    },
  });
}

/** Remove a wishlist item by product ID. */
export function useRemoveFromWishlistByProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await api.delete(`/api/wishlist/product/${productId}`);
      return res.data;
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.check(productId) });
    },
  });
}

/** Clear the entire wishlist. */
export function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/wishlist/clear');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
    },
  });
}
