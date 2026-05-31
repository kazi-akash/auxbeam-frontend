import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { AdminReviewFilters, RespondToReviewPayload } from '@/lib/types';

export function useAdminReviews(filters?: AdminReviewFilters) {
  return useQuery({
    queryKey: queryKeys.admin.reviews.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/reviews', { params: filters });
      return res.data;
    },
  });
}

export function useAdminReviewStatistics() {
  return useQuery({
    queryKey: queryKeys.admin.reviews.statistics(),
    queryFn: async () => {
      const res = await api.get('/api/admin/reviews/statistics');
      return res.data.data;
    },
  });
}

export function useAdminReview(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.reviews.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/reviews/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/reviews/${id}/approve`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.single(id) });
    },
  });
}

export function useAdminRejectReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/reviews/${id}/reject`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.single(id) });
    },
  });
}

export function useAdminRespondToReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: RespondToReviewPayload;
    }) => {
      const res = await api.post(`/api/admin/reviews/${id}/respond`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.single(id) });
    },
  });
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/reviews/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.list() });
    },
  });
}
