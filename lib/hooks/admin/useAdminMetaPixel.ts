import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  MetaPixelEventFilters,
  SaveMetaPixelConfigPayload,
} from '@/lib/types/admin';

// ─── Configuration ────────────────────────────────────────────────────────────

export function useMetaPixelConfiguration() {
  return useQuery({
    queryKey: queryKeys.admin.metaPixel.configuration(),
    queryFn: async () => {
      const res = await api.get('/api/admin/meta-pixel/configuration');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveMetaPixelConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveMetaPixelConfigPayload) => {
      const res = await api.post('/api/admin/meta-pixel/configuration', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.metaPixel.configuration() });
    },
  });
}

export function useToggleMetaPixelActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/admin/meta-pixel/configuration/toggle');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.metaPixel.configuration() });
    },
  });
}

// ─── Events ───────────────────────────────────────────────────────────────────

export function useMetaPixelEvents(filters?: MetaPixelEventFilters) {
  return useQuery({
    queryKey: queryKeys.admin.metaPixel.events(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/meta-pixel/events', { params: filters });
      return res.data;
    },
  });
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export function useMetaPixelStatistics(filters?: { date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.metaPixel.statistics(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/meta-pixel/statistics', { params: filters });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Enhanced Reports ─────────────────────────────────────────────────────────

export function useEnhancedReportUtmCampaign(filters?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.enhancedReports.utmCampaign(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/enhanced-reports/utm-campaign', { params: filters });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useEnhancedReportOrderSource(filters?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.enhancedReports.orderSource(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/enhanced-reports/order-source', { params: filters });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
