'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, Truck, CheckCircle2, Loader2, Tag } from 'lucide-react';
import Breadcrumb from '../_components/Breadcrumb';
import { useShippingMethods, useCheckoutPreview, useProcessCheckout } from '@/lib/hooks/public/useCheckout';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import type { ShippingMethod, ShippingMethodOption, PaymentMethod } from '@/lib/types/order';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const EMPTY_FORM: FormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'ssl_commerz', label: 'Credit / Debit Card (SSLCommerz)' },
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'cod', label: 'Cash On Delivery' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items: cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const shippingMethodsMutation = useShippingMethods();
  const checkoutPreviewMutation = useCheckoutPreview();
  const processCheckout = useProcessCheckout();

  const shippingOptions: ShippingMethodOption[] = shippingMethodsMutation.data ?? [];
  const preview = checkoutPreviewMutation.data;

  // Subtotal from cart
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── Fetch shipping methods on mount ───────────────────────────────────────
  useEffect(() => {
    if (cartItems.length === 0) return;
    shippingMethodsMutation.mutate({
      items: cartItems.map((i) => ({
        product_id: i.product_id,
        variation_id: i.variation_id ?? null,
        quantity: i.quantity,
      })),
      subtotal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select recommended method
  useEffect(() => {
    if (shippingOptions.length > 0 && !selectedShipping) {
      const recommended = shippingOptions.find((o) => o.recommended) ?? shippingOptions[0];
      setSelectedShipping(recommended.code);
    }
  }, [shippingOptions, selectedShipping]);

  // ── Fetch preview when shipping method changes ─────────────────────────────
  useEffect(() => {
    if (!selectedShipping || cartItems.length === 0) return;
    checkoutPreviewMutation.mutate({
      items: cartItems.map((i) => ({
        product_id: i.product_id,
        variation_id: i.variation_id ?? null,
        quantity: i.quantity,
        price: i.product.price,
      })),
      shipping_method: selectedShipping,
      coupon_code: couponCode || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShipping, couponCode]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShipping) {
      toast.error('Please select a shipping method');
      return;
    }

    const payload = user
      ? {
          items: cartItems.map((i) => ({
            product_id: i.product_id,
            variation_id: i.variation_id ?? null,
            quantity: i.quantity,
            price: i.product.price,
          })),
          shipping_method: selectedShipping,
          payment_method: selectedPayment,
          coupon_code: couponCode || undefined,
          notes: undefined,
        }
      : {
          items: cartItems.map((i) => ({
            product_id: i.product_id,
            variation_id: i.variation_id ?? null,
            quantity: i.quantity,
            price: i.product.price,
          })),
          guest_email: formData.email,
          guest_name: formData.fullName,
          guest_phone: formData.phoneNumber,
          shipping_address: {
            address_line_1: formData.streetAddress,
            city: formData.city,
            state: formData.state || undefined,
            postal_code: formData.zipCode || undefined,
            country: 'Bangladesh',
            phone: formData.phoneNumber,
          },
          shipping_method: selectedShipping,
          payment_method: selectedPayment,
          coupon_code: couponCode || undefined,
        };

    processCheckout.mutate(payload, {
      onSuccess: (data) => {
        clearCart();
        if (data?.payment?.gateway_url) {
          window.location.href = data.payment.gateway_url;
        } else {
          toast.success('Order placed successfully!');
          router.push(`/orders/${data?.order?.order_number ?? ''}`);
        }
      },
      onError: (e: any) => {
        toast.error(e.response?.data?.message ?? 'Failed to place order. Please try again.');
      },
    });
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const shippingCost = preview?.shipping_cost ?? 0;
  const couponDiscount = preview?.coupon_discount ?? 0;
  const total = preview?.total ?? subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* ── Left Column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">

              {/* Shipping Information Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#12100E]">
                  Shipping Information
                </h2>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-[#ffd700] hover:bg-[#ffed4e] text-gray-900 font-medium px-4 py-2 rounded text-sm"
                >
                  <Plus size={16} />
                  Add Address
                </button>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-300">
                  Contact Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text" id="fullName" name="fullName"
                        value={formData.fullName} onChange={handleInputChange}
                        placeholder="Full Name" required={!user}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel" id="phoneNumber" name="phoneNumber"
                        value={formData.phoneNumber} onChange={handleInputChange}
                        placeholder="+880..." required={!user}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {!user && (
                    <div>
                      <label htmlFor="email" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email" id="email" name="email"
                        value={formData.email} onChange={handleInputChange}
                        placeholder="your@email.com" required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-300">
                  Shipping Address
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="streetAddress" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                      Street, House, Apartment <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" id="streetAddress" name="streetAddress"
                      value={formData.streetAddress} onChange={handleInputChange}
                      placeholder="Enter Street Address, House No, Apartment No"
                      required={!user}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="city" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text" id="city" name="city"
                        value={formData.city} onChange={handleInputChange}
                        placeholder="e.g. Dhaka" required={!user}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        State / Division
                      </label>
                      <input
                        type="text" id="state" name="state"
                        value={formData.state} onChange={handleInputChange}
                        placeholder="e.g. Dhaka"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text" id="zipCode" name="zipCode"
                        value={formData.zipCode} onChange={handleInputChange}
                        placeholder="e.g. 1200"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Shipping Method Selection ──────────────────────────────── */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Shipping Method
                  </h3>
                </div>

                {shippingMethodsMutation.isPending ? (
                  <div className="flex items-center gap-3 py-6 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading shipping options…</span>
                  </div>
                ) : shippingOptions.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">
                    No shipping methods available. Please check your cart items.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.code}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedShipping === option.code
                            ? 'border-[#ffd700] bg-yellow-50/40'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.code}
                          checked={selectedShipping === option.code}
                          onChange={() => setSelectedShipping(option.code)}
                          className="mt-0.5 w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {option.name}
                            </span>
                            {option.recommended && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3" /> Recommended
                              </span>
                            )}
                            {option.is_free && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                          {option.delivery_time && (
                            <p className="text-xs text-gray-400 mt-1">
                              Estimated: {option.delivery_time}
                            </p>
                          )}
                          {!option.is_free && option.free_shipping_min_order && (
                            <p className="text-xs text-emerald-600 mt-1">
                              Free shipping on orders over ৳
                              {Number(option.free_shipping_min_order).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {option.is_free ? (
                            <span className="text-sm font-bold text-emerald-600">Free</span>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              ৳{Number(option.cost).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Payment Method ─────────────────────────────────────────── */}
              <div className="bg-white rounded-lg border border-[#E5E7EB]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E5E7EB]">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Select a Payment Method
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
                    className="text-gray-400 hover:text-gray-600 transition-transform"
                    style={{ transform: isPaymentExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {isPaymentExpanded && (
                  <div className="p-4 sm:p-6 space-y-3">
                    {PAYMENT_METHODS.map((pm) => (
                      <label
                        key={pm.value}
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                          selectedPayment === pm.value
                            ? 'border-[#ffd700] bg-yellow-50/40'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.value}
                          checked={selectedPayment === pm.value}
                          onChange={() => setSelectedPayment(pm.value)}
                          className="w-5 h-5 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                        />
                        <span className="text-sm font-medium text-gray-900">{pm.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column — Order Summary ─────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-[#E5E7EB] rounded-lg p-4 sm:p-6 lg:sticky lg:top-4 space-y-4">
                <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#101114]">
                  Order Summary
                </h2>

                {/* Cart items */}
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">Your cart is empty.</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.product_id}-${item.variation_id}`} className="flex gap-2 sm:gap-3">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded flex-shrink-0 relative">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              unoptimized
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] sm:text-[14px] font-[400] text-gray-900 mb-1 line-clamp-2">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[13px] sm:text-[14px] font-[600] text-gray-900">
                              ৳{(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              × {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Coupon */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedShipping && cartItems.length > 0) {
                        checkoutPreviewMutation.mutate({
                          items: cartItems.map((i) => ({
                            product_id: i.product_id,
                            variation_id: i.variation_id ?? null,
                            quantity: i.quantity,
                            price: i.product.price,
                          })),
                          shipping_method: selectedShipping,
                          coupon_code: couponCode || undefined,
                        });
                      }
                    }}
                    className="px-3 py-2.5 text-sm font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 transition whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 sm:space-y-3 border-t border-b py-4 border-[#D1D5DC]">
                  <div className="flex justify-between text-[13px] sm:text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900">৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] sm:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    {checkoutPreviewMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : shippingCost === 0 && selectedShipping ? (
                      <span className="font-semibold text-emerald-600">Free</span>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        ৳{shippingCost.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[13px] sm:text-sm">
                      <span className="text-emerald-600">Coupon Discount</span>
                      <span className="font-semibold text-emerald-600">
                        −৳{couponDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between text-base sm:text-[18px] font-[600] text-[#101114]">
                  <span>Total:</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  disabled={processCheckout.isPending || cartItems.length === 0 || !selectedShipping}
                  className="w-full flex items-center justify-center gap-2 bg-[#FDDE35] hover:bg-[#ffed4e] disabled:opacity-60 disabled:cursor-not-allowed text-[#181910] text-[14px] sm:text-[16px] font-[600] py-2.5 sm:py-3 rounded transition-colors"
                >
                  {processCheckout.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {processCheckout.isPending ? 'Placing Order…' : 'Place Order'}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  By placing your order you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
