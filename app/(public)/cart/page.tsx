'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, ShoppingCart, Tag, ChevronDown, ChevronUp, X, Check, Loader2 } from 'lucide-react';
import Breadcrumb from '../_components/Breadcrumb';
import YouMayAlsoLike from '../_components/shop/YouMayAlsoLike';
import { useCart } from '@/lib/context/CartContext';
import { useAvailableCoupons, useCartSummary } from '@/lib/hooks/public/useCart';
import type { AvailableCoupon } from '@/lib/types';

export default function CartPage() {
  const { items, updateQuantity, removeItem, appliedCoupon, setAppliedCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showCouponList, setShowCouponList] = useState(false);

  const { data: availableCoupons, isLoading: couponsLoading } = useAvailableCoupons();
  const cartSummaryMutation = useCartSummary();

  // Server-computed summary (fetched on load and after coupon apply).
  const [serverSummary, setServerSummary] = useState<{
    subtotal: number;
    promotion_discount: number;
    coupon_discount: number;
    total: number;
  } | null>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // Deduplicate services by service_id (take max price when same service appears in multiple items)
  const serviceMap = new Map<number, { name: string; price: number }>();
  for (const item of items) {
    for (const svc of item.selectedServices ?? []) {
      const existing = serviceMap.get(svc.service_id);
      if (!existing || svc.price > existing.price) {
        serviceMap.set(svc.service_id, { name: svc.name, price: svc.price });
      }
    }
  }
  const serviceCost = Array.from(serviceMap.values()).reduce((sum, s) => sum + s.price, 0);

  // Fetch server summary whenever cart items change (to get accurate post-promotion subtotal).
  useEffect(() => {
    if (items.length === 0) { setServerSummary(null); return; }
    cartSummaryMutation.mutate(
      { items: items.map((i) => ({ product_id: i.product_id, variation_id: i.variation_id ?? null, quantity: i.quantity })) },
      { onSuccess: (data) => setServerSummary(data) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Display values: server returns raw subtotal + promotion_discount separately.
  const promotionDiscount = serverSummary?.promotion_discount ?? 0;
  const rawSubtotal = serverSummary?.subtotal ?? totalPrice;
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const subTotal = rawSubtotal - promotionDiscount + serviceCost - couponDiscount;

  function handleApplyCoupon(code: string) {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setCouponError(null);
    cartSummaryMutation.mutate(
      {
        items: items.map((i) => ({ product_id: i.product_id, variation_id: i.variation_id ?? null, quantity: i.quantity })),
        coupon_code: trimmed,
      },
      {
        onSuccess: (data) => {
          setServerSummary(data);
          if (data.coupon_error) {
            setCouponError(data.coupon_error);
          } else {
            setAppliedCoupon({ code: trimmed, discount: data.coupon_discount ?? 0 });
            setCouponCode('');
            setShowCouponList(false);
          }
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setCouponError(msg ?? 'Invalid coupon code.');
        },
      }
    );
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponCode('');
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 flex flex-col items-center gap-6">
          <ShoppingCart className="w-20 h-20 text-gray-300" />
          <p className="text-[20px] font-[500] text-gray-500">Your cart is empty</p>
          <Link href="/shop" className="bg-[#FDDE35] hover:bg-[#FACC15] text-[#181910] font-[600] px-8 py-3 rounded-md transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Add to Cart' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <h1 className="text-[20px] md:text-[24px] font-[600] text-[#161617] mb-4 md:mb-6">
          My Shopping Cart ({totalItems} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const discount = item.product.compare_price
                ? Math.round(((item.product.compare_price - item.product.price) / item.product.compare_price) * 100)
                : null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[16px] md:rounded-lg py-4 px-3 md:p-6 border border-[#E5E7EB]"
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.slug}`} className="w-[88px] h-[88px] md:w-32 md:h-32 bg-[#F3F4F6] rounded-[12px] md:rounded-lg flex-shrink-0 relative">
                      <Image
                        src={item.product.image || '/images/product-page/e289c177b94614ad421b2a48e6ed78c26793555a.png'}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-contain p-2"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 lg:flex lg:justify-between mb-5 lg:mb-0">
                        <div className="flex-1 md:max-w-[410px]">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="text-[14px] md:text-[18px] lg:text-[20px] font-[500] md:font-[600] text-[#1F2937] mb-[2px] md:mb-2 leading-snug hover:text-gray-600 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.selectedServices && item.selectedServices.length > 0 && (
                            <div className="mb-[4px]">
                              {item.selectedServices.map((svc) => (
                                <p key={svc.service_id} className="text-[12px] md:text-[14px] font-[400] text-[#6B7280]">
                                  {svc.name}{svc.price > 0 ? ` (+${svc.price.toFixed(2)} BDT)` : ''}
                                  {svc.scheduled_date && ` — ${svc.scheduled_date}${svc.scheduled_time ? ` ${svc.scheduled_time}` : ''}`}
                                </p>
                              ))}
                            </div>
                          )}
                          {item.bulbSize && (
                            <p className="text-[12px] md:text-[14px] font-[400] text-[#6B7280] mb-[11px] md:mb-4">
                              Bulb Size: {item.bulbSize}
                            </p>
                          )}

                          {/* Price */}
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                            <span className="text-[12px] md:text-[16px] font-[400] md:font-[600] text-[#1F2937]">
                              {item.product.price.toFixed(2)} BDT
                            </span>
                            {item.product.compare_price && (
                              <div className="flex items-center gap-2 md:gap-3">
                                <span className="text-[12px] md:text-[16px] font-[400] text-[#9CA3AF] line-through">
                                  BDT {item.product.compare_price.toFixed(2)}
                                </span>
                                {discount && (
                                  <span className="bg-[#EF4444] text-white text-[11px] md:text-[12px] font-[700] px-2 md:px-3 py-0.5 md:py-1 rounded-md">
                                    -{discount}% off
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls - Desktop */}
                        <div className="hidden lg:flex flex-col items-end justify-between">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-[#4D4C44] text-[16px] font-[600] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-[#030712] text-[16px] font-[400] w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-[#6A7282] text-[16px] font-[400] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls - Mobile */}
                      <div className="flex items-center justify-between lg:hidden md:pt-4">
                        <div className="flex items-center gap-4 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] py-[4px] px-[16px] max-w-[96px]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-[#374151] text-[20px] font-[600] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-[#1F2937] text-[18px] font-[500] w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-[#374151] text-[20px] font-[600] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-[#EF4444] hover:text-red-600 text-[16px] font-[500]"
                        >
                          <Trash2 size={20} strokeWidth={2.5} />
                          <span className="underline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#E5E7EB] rounded-lg p-4 md:p-6 shadow-sm lg:sticky lg:top-4">
              <h2 className="text-[18px] md:text-[20px] font-[600] text-[#101114] mb-[16px] md:mb-[20px]">
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-[20px] md:mb-[24px]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-[4px] px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-[13px] font-[600] text-green-700">{appliedCoupon.code}</span>
                      <span className="text-[12px] text-green-600">- {appliedCoupon.discount.toFixed(2)} BDT</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-gray-600 ml-2">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(null); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon(couponCode)}
                        className="w-full h-[48px] md:h-[52px] px-3 md:px-4 pr-28 md:pr-32 bg-white border border-gray-300 rounded-[4px] text-[14px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponCode)}
                        disabled={cartSummaryMutation.isPending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-[100px] md:w-[110px] h-[36px] md:h-[40px] bg-[#FDDE35] hover:bg-[#ffed4e] disabled:opacity-60 text-[#12100E] text-[12px] md:text-[13px] font-[600] px-2 rounded-[4px] flex items-center justify-center gap-1 whitespace-nowrap"
                      >
                        {cartSummaryMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply Coupon'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[12px] text-red-500 mt-1.5 px-1">{couponError}</p>
                    )}

                    {/* Available Coupons Toggle */}
                    <button
                      onClick={() => setShowCouponList((v) => !v)}
                      className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-[#374151] transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      View available coupons
                      {showCouponList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showCouponList && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-[8px] overflow-hidden">
                        {couponsLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                          </div>
                        ) : !availableCoupons?.length ? (
                          <p className="text-[13px] text-gray-400 text-center py-4">No coupons available.</p>
                        ) : (
                          <ul className="divide-y divide-gray-100 max-h-[260px] overflow-y-auto">
                            {(availableCoupons as AvailableCoupon[]).map((coupon) => (
                              <li key={coupon.id} className="p-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-[700] text-[13px] text-[#101114] tracking-wide">{coupon.code}</span>
                                      <span className="text-[11px] font-[600] text-[#FDDE35] bg-[#101114] px-1.5 py-0.5 rounded">
                                        {coupon.discount_type === 'percentage'
                                          ? `${coupon.discount_value}% OFF`
                                          : coupon.discount_type === 'free_shipping'
                                          ? 'FREE SHIP'
                                          : `${coupon.discount_value} BDT OFF`}
                                      </span>
                                    </div>
                                    {coupon.description && (
                                      <p className="text-[12px] text-gray-500 leading-snug">{coupon.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-x-3 mt-1">
                                      {coupon.min_order_amount && (
                                        <span className="text-[11px] text-gray-400">Min: {coupon.min_order_amount} BDT</span>
                                      )}
                                      {coupon.max_discount_amount && (
                                        <span className="text-[11px] text-gray-400">Max off: {coupon.max_discount_amount} BDT</span>
                                      )}
                                      {coupon.expires_at && (
                                        <span className="text-[11px] text-gray-400">
                                          Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleApplyCoupon(coupon.code)}
                                    disabled={cartSummaryMutation.isPending}
                                    className="flex-shrink-0 text-[12px] font-[600] text-[#101114] bg-[#FDDE35] hover:bg-[#ffed4e] disabled:opacity-60 px-2.5 py-1.5 rounded-[4px] whitespace-nowrap"
                                  >
                                    Apply
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4D4C44] text-[14px] md:text-[16px]">Total Items ({totalItems})</span>
                  <span className="font-[500] text-[14px] md:text-[16px] text-[#101114]">
                    {rawSubtotal.toFixed(2)} BDT
                  </span>
                </div>
                {promotionDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4D4C44] text-[14px] md:text-[16px]">Promotion Discount</span>
                    <span className="font-[500] text-[14px] md:text-[16px] text-green-600">
                      - {promotionDiscount.toFixed(2)} BDT
                    </span>
                  </div>
                )}
                {serviceCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4D4C44] text-[14px] md:text-[16px]">Services</span>
                    <span className="font-[500] text-[14px] md:text-[16px] text-[#101114]">
                      {serviceCost.toFixed(2)} BDT
                    </span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4D4C44] text-[14px] md:text-[16px]">Coupon Discount</span>
                    <span className="font-[500] text-[14px] md:text-[16px] text-green-600">
                      - {couponDiscount.toFixed(2)} BDT
                    </span>
                  </div>
                )}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between text-[16px] md:text-[18px] font-[600] text-[#101114] mb-4 md:mb-6 pt-3 md:pt-4 border-t border-gray-300">
                <span>Sub Total:</span>
                <span>{subTotal.toFixed(2)} BDT</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/checkout" className="block w-full bg-[#FDDE35] hover:bg-[#ffed4e] text-[#181910] text-[15px] md:text-[16px] font-[600] py-3 rounded-[4px] text-center">
                  Proceed to Checkout
                </Link>
                <Link href="/shop" className="block w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold text-[15px] md:text-base py-3 rounded-[4px] border border-gray-300 text-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <YouMayAlsoLike />
    </div>
  );
}
