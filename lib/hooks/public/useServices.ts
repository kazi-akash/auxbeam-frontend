import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { ServiceType } from '@/lib/types/admin';

export interface PublicProductService {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: ServiceType;
  requires_scheduling: boolean;
  price: number;
  is_required: boolean;
  conditions: string | null;
}

export interface PaymentMethodOption {
  value: string;
  label: string;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  ssl_commerz: 'Credit / Debit Card (SSLCommerz)',
  bkash: 'bKash',
  nagad: 'Nagad',
  cash_on_delivery: 'Cash On Delivery',
  pos_on_delivery: 'POS On Delivery',
  cash_on_service: 'Cash On Service',
  pos_on_service: 'POS On Service',
  cod: 'Cash On Delivery',
};

export function useProductServices(productId: number | null) {
  return useQuery({
    queryKey: queryKeys.services.product(productId ?? 0),
    enabled: !!productId,
    queryFn: async () => {
      const res = await api.get(`/api/services/products/${productId}`);
      return res.data.data as PublicProductService[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePaymentMethods(deliveryType: string | null) {
  return useQuery({
    queryKey: queryKeys.services.paymentMethods(deliveryType ?? ''),
    enabled: !!deliveryType,
    queryFn: async () => {
      const res = await api.get('/api/services/payment-methods', { params: { delivery_type: deliveryType } });
      const raw: unknown[] = Array.isArray(res.data.data) ? res.data.data : [];
      return raw.reduce<PaymentMethodOption[]>((acc, m) => {
        const value = typeof m === 'string' ? m : typeof m === 'object' && m !== null && 'value' in m ? String((m as Record<string, unknown>).value) : String(m);
        if (!value) return acc;
        acc.push({ value, label: PAYMENT_METHOD_LABELS[value] ?? value });
        return acc;
      }, []);
    },
    staleTime: 10 * 60 * 1000,
  });
}
