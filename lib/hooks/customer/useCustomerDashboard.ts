import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

/** Fetch the customer dashboard statistics and recent orders. */
export function useCustomerDashboard() {
  return useQuery({
    queryKey: queryKeys.customer.dashboard(),
    queryFn: async () => {
      const res = await api.get('/api/dashboard');
      return res.data.data;
    },
  });
}

/** Fetch the customer's full profile including addresses. */
export function useCustomerProfile() {
  return useQuery({
    queryKey: queryKeys.customer.profile(),
    queryFn: async () => {
      const res = await api.get('/api/profile');
      return res.data.data;
    },
  });
}
