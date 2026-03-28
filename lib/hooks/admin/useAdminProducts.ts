import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { ProductFilters } from '../public/useProducts';

// Fetch products (with pagination)
export const useAdminProducts = (filters?: ProductFilters, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

// Get single product
export const useAdminProduct = (id: number, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/products/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Handle FormData for file uploads
      const hasFiles = data.images?.some((img: any) => img instanceof File);
      
      if (hasFiles) {
        const formData = new FormData();
        // Append all fields to FormData
        Object.keys(data).forEach(key => {
          if (key !== 'images' && data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });
        // Append images
        data.images?.forEach((image: File, index: number) => {
          formData.append(`images[${index}]`, image);
        });
        
        return await api.post('/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      return await api.post('/api/admin/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/admin/products/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.id] });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};
