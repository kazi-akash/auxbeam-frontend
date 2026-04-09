'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Breadcrumb from '../_components/Breadcrumb';
import YouMayAlsoLike from '../_components/shop/YouMayAlsoLike';

interface CartItem {
  id: string;
  name: string;
  image: string;
  bulbSize: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'F2 Series 10000LM 52W LED Headlight Bulbs 6500K Cool White',
      image: '/images/landing/best-selling-products/2e7873338809bb4c9d78fb2995a6bc2026e5f1aa.png',
      bulbSize: '(2pcs) 9005/HB3/H10',
      price: 6000.99,
      originalPrice: 7000.99,
      discount: 40,
      quantity: 1,
    },
    {
      id: '2',
      name: 'GX Series 25000LM 120W LED Headlight Bulbs 6500K Cool White',
      image: '/images/landing/best-selling-products/6c3a6ef62f11f9fae812d5d2fdbd02f0a1bfe18f.png',
      bulbSize: '(2pcs) 9005/HB3/H10',
      price: 11500.99,
      quantity: 1,
    },
    {
      id: '3',
      name: '3 Inch 136W 6000K Double Hyperboloid Bi-LED Headlight',
      image: '/images/landing/best-selling-products/a5375ec89708c75248641ad73a28e3c292df0e86.png',
      bulbSize: '(2pcs) 9005/HB3/H10',
      price: 36248.99,
      quantity: 1,
    },
  ]);

  const [couponCode, setCouponCode] = useState('');

  const homeInstallation = 999.99;
  const promoDiscount = 0.0;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subTotal = totalPrice + homeInstallation - promoDiscount;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Add to Cart' }
      ]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <h1 className="text-[20px] md:text-[24px] font-[600] text-[#161617] mb-4 md:mb-6">
          My Shopping Cart ({totalItems} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 md:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[16px] md:rounded-lg py-4 px-3 md:p-6 border border-[#E5E7EB]"
              >
                {/* Top Section: Image and Details */}
                <div className="flex gap-4 md:gap-6">
                  {/* Product Image */}
                  <div className="w-[88px] h-[88px] md:w-32 md:h-32 bg-[#F3F4F6] rounded-[12px] md:rounded-lg flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 lg:flex lg:justify-between mb-5 lg:mb-0">
                      <div className="flex-1 md:max-w-[410px]">
                        <h3 className="text-[14px] md:text-[18px] lg:text-[20px] font-[500] md:font-[600] text-[#1F2937] mb-[2px] md:mb-2 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[12px] md:text-[14px] font-[400] text-[#6B7280] mb-[11px] md:mb-4">
                          Bulb Size: {item.bulbSize}
                        </p>

                        {/* Price and Discount */}
                        <div className="flex items-center gap-3 mb-0 md:mb-0">
                          <span className="text-[12px] md:text-[16px] font-[400] md:font-[600] text-[#1F2937]">
                            {item.price.toFixed(2)} BDT
                          </span>
                          {item.originalPrice && (
                            <>
                              <span className="text-[12px] md:text-[16px] font-[400] text-[#9CA3AF] line-through">
                                BDT {item.originalPrice.toFixed(2)}
                              </span>
                              <span className="bg-[#EF4444] text-white text-[13px] md:text-[12px] font-[700] px-3 py-1 rounded-md">
                                -{item.discount}% off
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls - Desktop Only */}
                      <div className="hidden lg:flex flex-col items-end justify-between">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-[#4D4C44] text-[16px] font-[600] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-[#030712] text-[16px] font-[400] w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
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

                    {/* Bottom Section: Quantity Controls and Remove - Mobile/Tablet */}
                    <div className="flex items-center justify-between lg:hidden md:pt-4">
                      <div className="flex items-center gap-4 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] py-[4px] px-[16px] max-w-[96px]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[#374151] text-[20px] font-[600] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-[#1F2937] text-[18px] font-[500] w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
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
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#E5E7EB] rounded-lg p-4 md:p-6 shadow-sm lg:sticky lg:top-4">
              <h2 className="text-[18px] md:text-[20px] font-[600] text-[#101114] mb-[16px] md:mb-[20px]">
                Order Summary
              </h2>

              {/* Coupon Input */}
              <div className="relative mb-[20px] md:mb-[24px]">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full h-[48px] md:h-[52px] px-3 md:px-4 pr-28 md:pr-40 bg-white border border-gray-300 rounded-[4px] text-[14px] md:text-base font-normal placeholder:text-gray-500 placeholder:text-[14px] md:placeholder:text-base placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[90px] md:w-[115px] h-[36px] md:h-[40px] bg-[#FDDE35] hover:bg-[#ffed4e] text-[#12100E] text-[13px] md:text-[14px] font-[600] p-[8px] md:p-[10px] rounded-[4px] whitespace-nowrap">
                  Apply Coupon
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4D4C44] text-[14px] md:text-[16px] font-400">Total Items ({totalItems})</span>
                  <span className="font-[500] text-[14px] md:text-[16px] text-[#101114]">
                    {totalPrice.toFixed(2)} BDT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4D4C44] text-[14px] md:text-[16px] font-400">Home Installation Service</span>
                  <span className="font-[500] text-[14px] md:text-[16px] text-[#101114]">
                    {homeInstallation.toFixed(2)} BDT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4D4C44] text-[14px] md:text-[16px] font-400">Promo Discount</span>
                  <span className="font-[500] text-[14px] md:text-[16px] text-[#101114]">
                    {promoDiscount.toFixed(2)} BDT
                  </span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between text-[16px] md:text-[18px] font-[600] text-[#101114] mb-4 md:mb-6 pt-3 md:pt-4 border-t border-gray-300">
                <span>Sub Total:</span>
                <span>{subTotal.toFixed(2)} BDT</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a href="/checkout" className="block w-full bg-[#FDDE35] hover:bg-[#ffed4e] text-[#181910] text-[15px] md:text-[16px] font-[600] py-3 rounded-[4px] text-center">
                  Proceed to Checkout
                </a>
                <a href="/shop" className="block w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold text-[15px] md:text-base py-3 rounded-[4px] border border-gray-300 text-center">
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <YouMayAlsoLike />
    </div>
  );
}
