import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CreateShippingRatePayload } from '@/lib/types';

// ─── Shipping Rates ───────────────────────────────────────────────────────────

export function useAdminShippingRates() {
  return useQuery({
    queryKey: queryKeys.admin.shipping.rates(),
    queryFn: async () => {
      const res = await api.get('/api/admin/shipping-rates');
      return res.data;
    },
  });
}

export function useAdminShippingRate(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.shipping.rate(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/shipping-rates/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateShippingRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateShippingRatePayload) => {
      const res = await api.post('/api/admin/shipping-rates', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipping.rates() });
    },
  });
}

export function useAdminUpdateShippingRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateShippingRatePayload>;
    }) => {
      const res = await api.put(`/api/admin/shipping-rates/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipping.rates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipping.rate(id) });
    },
  });
}

export function useAdminDeleteShippingRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/shipping-rates/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipping.rates() });
    },
  });
}

// ─── Shipping Classes ─────────────────────────────────────────────────────────

export function useAdminShippingClasses() {
  return useQuery({
    queryKey: queryKeys.admin.shipping.classes(),
    queryFn: async () => {
      const res = await api.get('/api/admin/shipping-classes');
      return res.data;
    },
  });
}

export function useAdminCreateShippingClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) => {
      const res = await api.post('/api/admin/shipping-classes', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipping.classes() });
    },
  });
}

export function useAdminUpdateShippingClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: { name?: string; description?: string };
    }) => {
      const res = await api.put(`/api/admin/shipping-classes/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipping.classes() });
    },
  });
}

export function useAdminDeleteShippingClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/shipping-classes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipping.classes() });
    },
  });
}
