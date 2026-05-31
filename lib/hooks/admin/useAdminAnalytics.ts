import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  AnalyticsDateFilters,
  VisitorSessionFilters,
  PageViewFilters,
  CartEventFilters,
  CheckoutFunnelFilters,
} from '@/lib/types/admin';

export function useAnalyticsDashboard(filters?: AnalyticsDateFilters) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.dashboard(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/dashboard', { params: filters });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useAnalyticsVisitors(filters?: VisitorSessionFilters) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.visitors(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/visitors', { params: filters });
      return res.data;
    },
  });
}

export function useAnalyticsVisitorDetails(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.visitorDetails(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/analytics/visitors/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAnalyticsProductViews(filters?: AnalyticsDateFilters & { sort_by?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.productViews(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/product-views', { params: filters });
      return res.data;
    },
  });
}

export function useAnalyticsCheckoutFunnel(filters?: CheckoutFunnelFilters) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.checkoutFunnel(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/checkout-funnel', { params: filters });
      return res.data;
    },
  });
}

export function useAnalyticsAbandonedCarts(filters?: CheckoutFunnelFilters) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.abandonedCarts(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/abandoned-carts', { params: filters });
      return res.data;
    },
  });
}

export function useAnalyticsCartEvents(filters?: CartEventFilters) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.cartEvents(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/cart-events', { params: filters });
      return res.data;
    },
  });
}

export function useAnalyticsPageViews(filters?: PageViewFilters) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.pageViews(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/page-views', { params: filters });
      return res.data;
    },
  });
}

export function useAnalyticsSearch(filters?: AnalyticsDateFilters & { no_results?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.analytics.search(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics/search', { params: filters });
      return res.data;
    },
  });
}
