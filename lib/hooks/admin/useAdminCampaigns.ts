import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  AdminCampaignFilters,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  PreviewRecipientsPayload,
} from '@/lib/types/admin';

export function useAdminCampaigns(filters?: AdminCampaignFilters) {
  return useQuery({
    queryKey: queryKeys.admin.campaigns.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/campaigns', { params: filters });
      return res.data;
    },
  });
}

export function useAdminCampaign(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.campaigns.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/campaigns/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCampaignStatistics(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.campaigns.statistics(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/campaigns/${id}/statistics`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCampaignPayload) => {
      const res = await api.post('/api/admin/campaigns', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns'] });
    },
  });
}

export function useAdminUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCampaignPayload }) => {
      const res = await api.put(`/api/admin/campaigns/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.campaigns.single(id) });
    },
  });
}

export function useAdminDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/campaigns/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns'] });
    },
  });
}

export function useAdminSendCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/campaigns/${id}/send`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.campaigns.single(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.campaigns.statistics(id) });
    },
  });
}

export function useAdminPreviewCampaignRecipients() {
  return useMutation({
    mutationFn: async (payload: PreviewRecipientsPayload) => {
      const res = await api.post('/api/admin/campaigns/preview-recipients', payload);
      return res.data.data as { count: number; preview: { id: number; email: string; first_name?: string; last_name?: string }[] };
    },
  });
}
