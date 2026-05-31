import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { ReportFilters } from '@/lib/types';

export function useAdminSalesReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: queryKeys.admin.reports.sales(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/reports/sales', { params: filters });
      return res.data.data;
    },
  });
}

export function useAdminProductsReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: queryKeys.admin.reports.products(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/reports/products', { params: filters });
      return res.data.data;
    },
  });
}

export function useAdminCustomersReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: queryKeys.admin.reports.customers(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/reports/customers', { params: filters });
      return res.data.data;
    },
  });
}

export function useAdminInventoryReport() {
  return useQuery({
    queryKey: queryKeys.admin.reports.inventory(),
    queryFn: async () => {
      const res = await api.get('/api/admin/reports/inventory');
      return res.data.data;
    },
  });
}

export function useAdminOrderStatusReport(filters?: Pick<ReportFilters, 'date_from' | 'date_to'>) {
  return useQuery({
    queryKey: queryKeys.admin.reports.orderStatus(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/reports/order-status', { params: filters });
      return res.data.data;
    },
  });
}
