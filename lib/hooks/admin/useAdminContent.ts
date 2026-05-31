import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CreatePolicyPayload, CreateBannerPayload, CreateFlashDealPayload } from '@/lib/types';

// ─── Policies ─────────────────────────────────────────────────────────────────

export function useAdminPolicies() {
  return useQuery({
    queryKey: queryKeys.admin.content.policies(),
    queryFn: async () => {
      const res = await api.get('/api/admin/content/policies');
      return res.data.data;
    },
  });
}

export function useAdminPolicy(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.content.policy(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/content/policies/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePolicyPayload) => {
      const res = await api.post('/api/admin/content/policies', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.policies() });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.policies() });
    },
  });
}

export function useAdminUpdatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreatePolicyPayload>;
    }) => {
      const res = await api.put(`/api/admin/content/policies/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.policies() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.policy(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.policies() });
    },
  });
}

// ─── CMS Pages ────────────────────────────────────────────────────────────────

export function useAdminCmsPages() {
  return useQuery({
    queryKey: queryKeys.admin.content.pages(),
    queryFn: async () => {
      const res = await api.get('/api/admin/content/pages');
      return res.data;
    },
  });
}

export function useAdminCmsPage(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.content.page(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/content/pages/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.post('/api/admin/content/pages', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.pages() });
    },
  });
}

export function useAdminUpdateCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Record<string, unknown>;
    }) => {
      const res = await api.put(`/api/admin/content/pages/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.pages() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.page(id) });
    },
  });
}

export function useAdminDeleteCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/content/pages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.pages() });
    },
  });
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export function useAdminBanners() {
  return useQuery({
    queryKey: queryKeys.admin.content.banners(),
    queryFn: async () => {
      const res = await api.get('/api/admin/content/banners');
      return res.data;
    },
  });
}

export function useAdminCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBannerPayload) => {
      const res = await api.post('/api/admin/content/banners', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.banners() });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.banners() });
    },
  });
}

export function useAdminUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateBannerPayload>;
    }) => {
      const res = await api.put(`/api/admin/content/banners/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.banners() });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.banners() });
    },
  });
}

export function useAdminDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/content/banners/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.content.banners() });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.banners() });
    },
  });
}

// ─── Flash Deals (Admin) ──────────────────────────────────────────────────────

export function useAdminFlashDeals() {
  return useQuery({
    queryKey: queryKeys.admin.flashDeals.list(),
    queryFn: async () => {
      const res = await api.get('/api/admin/flash-deals');
      return res.data;
    },
  });
}

export function useAdminFlashDeal(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.flashDeals.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/flash-deals/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateFlashDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateFlashDealPayload) => {
      const res = await api.post('/api/admin/flash-deals', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.flashDeals.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.flashDeals.active() });
    },
  });
}

export function useAdminUpdateFlashDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateFlashDealPayload>;
    }) => {
      const res = await api.put(`/api/admin/flash-deals/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.flashDeals.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.flashDeals.single(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.flashDeals.active() });
    },
  });
}

export function useAdminDeleteFlashDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/flash-deals/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.flashDeals.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.flashDeals.active() });
    },
  });
}
