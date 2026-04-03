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
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-[24px] font-[600] text-[#161617] mb-6">
          My Shopping Cart ({totalItems} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 border border-[#E5E7EB]"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-[20px] font-[500] text-[#12100E] mb-2">
                      {item.name}
                    </h3>
                    <p className="text-[14px] font-400 text-[#4D4C44] mb-4">
                      Bulb Size: {item.bulbSize}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[16px] font-[400] text-[#12100E]">
                        {item.price.toFixed(2)} BDT
                      </span>
                      {item.originalPrice && (
                        <>
                          <span className="text-[16px] font-[400] text-gray-400 line-through">
                            BDT {item.originalPrice.toFixed(2)}
                          </span>
                          <span className="bg-red-500 text-white text-[12px] font-[600] px-2 py-1 rounded">
                            {item.discount}% off
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-[#4D4C44] text-[16px] font-400 text-[16px] font-[600] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-[#030712] text-[16px] font-[400] w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="ext-[#6A7282] text-[16px] font-[400] hover:text-gray-900 w-6 h-6 flex items-center justify-center"
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
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#E5E7EB] rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-[20px] font-[600] text-[#101114] mb-[20px]">
                Order Summary
              </h2>

              {/* Coupon Input */}
              <div className="relative mb-[24px]">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full h-[52px] px-4 pr-40 bg-white border border-gray-300 rounded-[4px] text-base font-normal placeholder:text-gray-500 placeholder:text-base placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[115px] h-[40px] bg-[#FDDE35] hover:bg-[#ffed4e] text-[#12100E] text-[14px] font-[600] p-[10px] rounded-[4px] text-sm whitespace-nowrap">
                  Apply Coupon
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4D4C44] text-[16px] font-400">Total Items ({totalItems})</span>
                  <span className="font-[500] text-[16px] text-[#101114]">
                    {totalPrice.toFixed(2)} BDT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4D4C44] text-[16px] font-400">Home Installation Service</span>
                  <span className="font-[500] text-[16px] text-[#101114]">
                    {homeInstallation.toFixed(2)} BDT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4D4C44] text-[16px] font-400">Promo Discount</span>
                  <span className="font-[500] text-[16px] text-[#101114]">
                    {promoDiscount.toFixed(2)} BDT
                  </span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between text-[18px] font-[600] text-[#101114] mb-6 pt-4 border-t border-gray-300">
                <span>Sub Total:</span>
                <span>{subTotal.toFixed(2)} BDT</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a href="/checkout" className="block w-full bg-[#FDDE35] hover:bg-[#ffed4e] text-[#181910] text-[16px] font-[600] py-3 rounded-[4px] text-center">
                  Proceed to Checkout
                </a>
                <a href="/shop" className="block w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-[4px] border border-gray-300 text-center">
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
