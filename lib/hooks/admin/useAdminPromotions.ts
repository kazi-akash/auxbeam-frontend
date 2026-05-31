import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  CreatePromotionPayload,
  UpdatePromotionPayload,
  CreateCouponPayload,
  UpdateCouponPayload,
} from '@/lib/types';

// ─── Promotions ───────────────────────────────────────────────────────────────

export function useAdminPromotions(filters?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.promotions.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/promotions', { params: filters });
      return res.data;
    },
  });
}

export function useAdminPromotion(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.promotions.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/promotions/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePromotionPayload) => {
      const res = await api.post('/api/admin/promotions', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
    },
  });
}

export function useAdminUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdatePromotionPayload }) => {
      const res = await api.put(`/api/admin/promotions/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.promotions.single(id) });
    },
  });
}

export function useAdminDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/promotions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
    },
  });
}

export function useAdminTogglePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/promotions/${id}/toggle`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
    },
  });
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export function useAdminCoupons(filters?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.coupons.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/coupons', { params: filters });
      return res.data;
    },
  });
}

export function useAdminCoupon(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.coupons.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/coupons/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCouponUsage(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.coupons.usage(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/coupons/${id}/usage`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCouponPayload) => {
      const res = await api.post('/api/admin/coupons', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}

export function useAdminUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCouponPayload }) => {
      const res = await api.put(`/api/admin/coupons/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.coupons.single(id) });
    },
  });
}

export function useAdminDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/coupons/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}
