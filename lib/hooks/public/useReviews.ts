import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { Review, ReviewStats } from '@/lib/types/customer';
import type { PaginatedData } from '@/lib/types/api';

export interface ProductReviewFilters {
  page?: number;
  per_page?: number;
}

export interface ProductReviewsData {
  reviews: PaginatedData<Review>;
  stats: ReviewStats;
}

/** Fetch paginated reviews and rating stats for a product. */
export function useProductReviews(productId: number, filters?: ProductReviewFilters) {
  return useQuery({
    queryKey: queryKeys.reviews.product(productId, filters),
    queryFn: async () => {
      const res = await api.get(`/api/products/${productId}/reviews`, {
        params: filters,
      });
      return res.data.data as ProductReviewsData;
    },
    enabled: !!productId,
  });
}
