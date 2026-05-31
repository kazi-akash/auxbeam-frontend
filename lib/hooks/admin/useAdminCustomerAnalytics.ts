import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

export function useAdminCustomerAnalyticsDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.customerAnalytics.dashboard(),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-analytics/dashboard');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminCustomerGrowthReport(filters?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.customerAnalytics.growthReport(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-analytics/growth-report', { params: filters });
      return res.data.data;
    },
  });
}

export function useAdminCustomerLtvDistribution() {
  return useQuery({
    queryKey: queryKeys.admin.customerAnalytics.ltvDistribution(),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-analytics/ltv-distribution');
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useAdminCustomerSpendingSummary(customerId: number) {
  return useQuery({
    queryKey: queryKeys.admin.customerAnalytics.spendingSummary(customerId),
    queryFn: async () => {
      const res = await api.get(`/api/admin/customer-analytics/${customerId}/spending-summary`);
      return res.data.data;
    },
    enabled: !!customerId,
  });
}

export function useAdminCalculateCustomerAnalytics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerId: number) => {
      const res = await api.post(`/api/admin/customer-analytics/${customerId}/calculate`);
      return res.data.data;
    },
    onSuccess: (_, customerId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerAnalytics.spendingSummary(customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerAnalytics.dashboard() });
    },
  });
}
