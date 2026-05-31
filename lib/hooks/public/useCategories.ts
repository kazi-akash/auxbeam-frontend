import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CategoryProductFilters } from '@/lib/types';

const CATEGORIES_CACHE_KEY = 'auxbeam_categories_cache';
const CATEGORIES_TTL = 60 * 60 * 1000; // 1 hour

function readCategoriesCache() {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (!raw) return undefined;
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(CATEGORIES_CACHE_KEY);
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}

function writeCategoriesCache(data: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CATEGORIES_CACHE_KEY,
      JSON.stringify({ data, expiresAt: Date.now() + CATEGORIES_TTL })
    );
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

/** Fetch the full category tree (with nested children). Cached in localStorage for 1 hour. */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.catalog.categories(),
    queryFn: async () => {
      const cached = readCategoriesCache();
      if (cached) return cached;
      const res = await api.get('/api/catalog/categories');
      writeCategoriesCache(res.data.data);
      return res.data.data;
    },
    staleTime: CATEGORIES_TTL,
    gcTime: CATEGORIES_TTL,
    initialData: readCategoriesCache,
  });
}

/** Fetch a single category by slug. */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: queryKeys.catalog.category(slug),
    queryFn: async () => {
      const res = await api.get(`/api/catalog/categories/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch paginated products belonging to a category. */
export function useCategoryProducts(slug: string, filters?: CategoryProductFilters) {
  return useQuery({
    queryKey: queryKeys.catalog.categoryProducts(slug, filters),
    queryFn: async () => {
      const res = await api.get(`/api/catalog/categories/${slug}/products`, {
        params: filters,
      });
      return res.data.data;
    },
    enabled: !!slug,
  });
}
