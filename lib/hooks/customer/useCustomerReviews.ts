import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { SubmitReviewPayload } from '@/lib/types';

/** Fetch all reviews written by the authenticated customer. */
export function useMyReviews(filters?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: queryKeys.myReviews.all(filters),
    queryFn: async () => {
      const res = await api.get('/api/reviews/my-reviews', { params: filters });
      return res.data.data;
    },
  });
}

/** Fetch reviewable products from a delivered order. */
export function useOrderReviewableProducts(orderNumber: string) {
  return useQuery({
    queryKey: queryKeys.myReviews.orderReviewable(orderNumber),
    queryFn: async () => {
      const res = await api.get(`/api/reviews/order/${orderNumber}`);
      return res.data.data;
    },
    enabled: !!orderNumber,
  });
}

/** Submit a new product review. */
export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      const res = await api.post('/api/reviews', payload);
      return res.data;
    },
    onSuccess: (_, { product_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myReviews.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.product(product_id),
      });
    },
  });
}

/** Mark a review as helpful. */
export function useMarkReviewHelpful() {
  return useMutation({
    mutationFn: async (reviewId: number) => {
      const res = await api.post(`/api/reviews/${reviewId}/helpful`);
      return res.data.data;
    },
  });
}
