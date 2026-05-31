import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

/** Fetch all currently active flash deals. */
export function useActiveFlashDeals() {
  return useQuery({
    queryKey: queryKeys.flashDeals.active(),
    queryFn: async () => {
      const res = await api.get('/api/flash-deals');
      return res.data.data;
    },
    staleTime: 60 * 1000, // 1 min — deals are time-sensitive
  });
}

/** Fetch upcoming (not yet started) flash deals. */
export function useUpcomingFlashDeals() {
  return useQuery({
    queryKey: queryKeys.flashDeals.upcoming(),
    queryFn: async () => {
      const res = await api.get('/api/flash-deals/upcoming');
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

/** Fetch a single flash deal by ID. */
export function useFlashDeal(id: number) {
  return useQuery({
    queryKey: queryKeys.flashDeals.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/flash-deals/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
