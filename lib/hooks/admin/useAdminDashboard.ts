import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

/** Fetch the admin dashboard summary. */
export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: async () => {
      const res = await api.get('/api/admin/dashboard');
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

/** Fetch profit report for dashboard KPI. */
export function useEnhancedReportProfit(filters?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.enhancedReports.profit(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/enhanced-reports/profit', { params: filters });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/** Fetch COD vs Paid comparison for dashboard. */
export function useEnhancedReportCodVsPaid(filters?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.enhancedReports.codVsPaid(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/enhanced-reports/cod-vs-paid', { params: filters });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/** Fetch top selling products for dashboard. */
export function useEnhancedReportProductPerformance(filters?: { start_date?: string; end_date?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.enhancedReports.productPerformance(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/enhanced-reports/product-performance', { params: filters });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
