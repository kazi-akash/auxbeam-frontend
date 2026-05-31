import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  CreateVariationTypePayload,
  CreateVariationOptionPayload,
  BulkCreateVariationOptionsPayload,
} from '@/lib/types';

// ─── Variation Types ──────────────────────────────────────────────────────────

export function useAdminVariations() {
  return useQuery({
    queryKey: queryKeys.admin.variations.list(),
    queryFn: async () => {
      const res = await api.get('/api/admin/variations');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminVariation(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.variations.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/variations/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVariationTypePayload) => {
      const res = await api.post('/api/admin/variations', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.variations.list() });
    },
  });
}

export function useAdminUpdateVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateVariationTypePayload>;
    }) => {
      const res = await api.put(`/api/admin/variations/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.variations.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.variations.single(id) });
    },
  });
}

export function useAdminDeleteVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/variations/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.variations.list() });
    },
  });
}

// ─── Variation Options ────────────────────────────────────────────────────────

export function useAdminVariationOptions(variationId: number) {
  return useQuery({
    queryKey: queryKeys.admin.variations.options(variationId),
    queryFn: async () => {
      const res = await api.get(`/api/admin/variations/${variationId}/options`);
      return res.data.data;
    },
    enabled: !!variationId,
  });
}

export function useAdminCreateVariationOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      variationId,
      payload,
    }: {
      variationId: number;
      payload: CreateVariationOptionPayload;
    }) => {
      const res = await api.post(`/api/admin/variations/${variationId}/options`, payload);
      return res.data.data;
    },
    onSuccess: (_, { variationId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.variations.options(variationId),
      });
    },
  });
}

export function useAdminBulkCreateVariationOptions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      variationId,
      payload,
    }: {
      variationId: number;
      payload: BulkCreateVariationOptionsPayload;
    }) => {
      const res = await api.post(
        `/api/admin/variations/${variationId}/options/bulk`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: (_, { variationId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.variations.options(variationId),
      });
    },
  });
}

export function useAdminUpdateVariationOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      variationId,
      optionId,
      payload,
    }: {
      variationId: number;
      optionId: number;
      payload: Partial<CreateVariationOptionPayload>;
    }) => {
      const res = await api.put(
        `/api/admin/variations/${variationId}/options/${optionId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: (_, { variationId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.variations.options(variationId),
      });
    },
  });
}

export function useAdminDeleteVariationOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      variationId,
      optionId,
    }: {
      variationId: number;
      optionId: number;
    }) => {
      const res = await api.delete(
        `/api/admin/variations/${variationId}/options/${optionId}`,
      );
      return res.data;
    },
    onSuccess: (_, { variationId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.variations.options(variationId),
      });
    },
  });
}
