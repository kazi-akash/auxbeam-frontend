'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Breadcrumb from '../_components/Breadcrumb';

interface CheckoutItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    district: '',
    zipCode: '',
  });

  // Mock cart items from cart page
  const [checkoutItems] = useState<CheckoutItem[]>([
    {
      id: '1',
      name: 'F2 Series 10000LM 52W LED Headlight Bulbs 6500K Cool White',
      image: '/images/landing/best-selling-products/2e7873338809bb4c9d78fb2995a6bc2026e5f1aa.png',
      price: 6000.99,
      originalPrice: 7000.99,
      discount: 40,
      quantity: 1,
    },
    {
      id: '2',
      name: 'GX Series 25000LM 120W LED Headlight Bulbs 6500K Cool White',
      image: '/images/landing/best-selling-products/6c3a6ef62f11f9fae812d5d2fdbd02f0a1bfe18f.png',
      price: 11500.99,
      quantity: 1,
    },
    {
      id: '3',
      name: '3 Inch 136W 6000K Double Hyperboloid Bi-LED Headlight',
      image: '/images/landing/best-selling-products/a5375ec89708c75248641ad73a28e3c292df0e86.png',
      price: 36248.99,
      quantity: 1,
    },
  ]);

  const homeInstallation = 999.99;
  const promoDiscount = 0.0;

  const totalItems = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subTotal = totalPrice + homeInstallation - promoDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout submission
    console.log('Checkout data:', formData);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Add to Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Shipping Information */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Shipping Information Header */}
            <div className="">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#12100E]">Shipping Information</h2>
                <button className="flex items-center justify-center gap-2 bg-[#ffd700] hover:bg-[#ffed4e] text-gray-900 font-medium px-4 py-2 rounded text-sm">
                  <Plus size={16} />
                  Add Address
                </button>
              </div>

              {/* Saved Addresses Section */}
              <div className="mb-4 sm:mb-6 bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Address Card 1 - Selected */}
                  <div className="border-2 border-[#ffd700] rounded-lg p-4 sm:p-5 bg-white relative flex flex-col">
                    <div className="space-y-2.5 sm:space-y-3 flex-grow">
                      {/* Name */}
                      <div className="flex items-center gap-2 text-gray-900">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 sm:w-[18px] sm:h-[18px]">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="text-[13px] sm:text-sm font-normal">Tracy Craig</span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 sm:w-[18px] sm:h-[18px]">
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="m2 7 10 7 10-7"></path>
                        </svg>
                        <span className="text-[13px] sm:text-sm truncate">jamie_robertson@icloud.com</span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 sm:w-[18px] sm:h-[18px]">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span className="text-[13px] sm:text-sm">+1567673241662</span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-gray-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="text-[13px] sm:text-sm">262 Swansea, Swansea</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 sm:mt-2">
                      <button className="flex items-center justify-center gap-1 sm:gap-1.5 flex-1 px-2 sm:px-3 py-2 bg-red-50 text-red-500 rounded text-[13px] sm:text-sm font-medium hover:bg-red-100 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                      <button className="flex items-center justify-center gap-1 sm:gap-1.5 flex-1 px-2 sm:px-3 py-2 bg-[#F3F4F6] text-[#181910] rounded text-[13px] sm:text-sm font-medium hover:bg-gray-100 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Address Card 2 */}
                  <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 transition-colors cursor-pointer flex flex-col">
                    <div className="space-y-3 flex-grow">
                      {/* Name */}
                      <div className="flex items-center gap-2 text-gray-900">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="text-sm font-normal">Roosevelt Fletcher</span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="m2 7 10 7 10-7"></path>
                        </svg>
                        <span className="text-sm">arturogross@yahoo.com</span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span className="text-sm">+61639346012l8</span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-gray-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="text-sm">333 Main Street, Tewksbury</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                      <button className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 bg-red-50 text-red-500 rounded text-sm font-medium hover:bg-red-100 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remove
                      </button>
                      <button className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 bg-[#F3F4F6] text-[#181910] rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Address Card 3 */}
                  <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 transition-colors cursor-pointer flex flex-col">
                    <div className="space-y-3 flex-grow">
                      {/* Name */}
                      <div className="flex items-center gap-2 text-gray-900">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="text-sm font-normal">Dawn Stevenson</span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="m2 7 10 7 10-7"></path>
                        </svg>
                        <span className="text-sm">stevenson@icloud.com</span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span className="text-sm">+2013631827685</span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-gray-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="text-sm">Drive, Raynham MA 2767</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 pt-4">
                      <button className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 bg-red-50 text-red-500 rounded text-sm font-medium hover:bg-red-100 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remove
                      </button>
                      <button className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 bg-[#F3F4F6] text-[#181910] rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <div className="mb-6 sm:mb-8 bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-300">Contact Information</h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className='mb-6 sm:mb-8 bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]'>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-300">Shipping Address</h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Street Address */}
                    <div>
                      <label htmlFor="streetAddress" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                        Street, House, Apartment <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="Enter Street Address, House No, Apartment No"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>

                    {/* City, District, Zip-code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {/* City */}
                      <div>
                        <label htmlFor="city" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        >
                          <option value="">Select City</option>
                          <option value="dhaka">Dhaka</option>
                          <option value="chittagong">Chittagong</option>
                          <option value="sylhet">Sylhet</option>
                        </select>
                      </div>

                      {/* District */}
                      <div>
                        <label htmlFor="district" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                          District <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        >
                          <option value="">Select District</option>
                          <option value="dhaka">Dhaka</option>
                          <option value="gazipur">Gazipur</option>
                          <option value="narayanganj">Narayanganj</option>
                        </select>
                      </div>

                      {/* Zip-code */}
                      <div>
                        <label htmlFor="zipCode" className="block text-[13px] sm:text-sm font-medium text-gray-700 mb-2">
                          Zip-code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="Enter Zip code"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded text-[13px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg border border-[#E5E7EB]">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E5E7EB]">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select a Payment Method</h2>
                <button 
                  onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
                  className="text-gray-400 hover:text-gray-600 transition-transform"
                  style={{ transform: isPaymentExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-6 sm:h-6">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>

              {isPaymentExpanded && (
                <div className="p-4 sm:p-6">
                  {/* Payment Options */}
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {/* Credit/Debit Card */}
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      defaultChecked
                      className="w-5 h-5 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                    />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    <span className="text-base font-medium text-gray-900">Credit / Debit Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='2' fill='%23EB001B'/%3E%3Crect x='12' width='8' height='20' fill='%23FF5F00'/%3E%3Crect x='12' width='20' height='20' rx='2' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" className="h-5" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='2' fill='%231434CB'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-weight='bold' font-size='10'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" className="h-5" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='2' fill='%23FF6000'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-weight='bold' font-size='6'%3EDISCOVER%3C/text%3E%3C/svg%3E" alt="Discover" className="h-5" />
                  </div>
                </label>

                {/* Cash On Delivery */}
                <label className="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    className="w-5 h-5 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                  />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-3 text-gray-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                    <path d="M12 18V6"></path>
                  </svg>
                  <span className="ml-3 text-base font-medium text-gray-900">Cash On Delivery</span>
                </label>

                {/* SSL Commerce */}
                <label className="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ssl"
                    className="w-5 h-5 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                  />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-3 text-gray-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"></path>
                  </svg>
                  <span className="ml-3 text-base font-medium text-gray-900">SSL Commerce</span>
                </label>
              </div>

              {/* Secure Card Details */}
              <div className='bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]'>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Secure Card Details</h3>

                <div className="space-y-3 sm:space-y-4">
                  {/* Name on Card */}
                  <div>
                    <label htmlFor="cardName" className="block text-[13px] sm:text-base font-medium text-gray-900 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="Jon Doe"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded text-[13px] sm:text-base text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label htmlFor="cardNumber" className="block text-[13px] sm:text-base font-medium text-gray-900 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="435 298 771 563"
                      maxLength={19}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded text-[13px] sm:text-base text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  {/* Expiry Date and CVC */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Expiry Date */}
                    <div>
                      <label htmlFor="expiryDate" className="block text-[13px] sm:text-base font-medium text-gray-900 mb-2">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="expiryDate"
                        name="expiryDate"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded text-[13px] sm:text-base text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                      >
                        <option value="">MM/YY</option>
                        <option value="01/25">01/25</option>
                        <option value="02/25">02/25</option>
                        <option value="03/25">03/25</option>
                      </select>
                    </div>

                    {/* CVC */}
                    <div>
                      <label htmlFor="cvc" className="block text-[13px] sm:text-base font-medium text-gray-900 mb-2">
                        CVC <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="cvc"
                        name="cvc"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded text-[13px] sm:text-base text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                      >
                        <option value="">123</option>
                        <option value="123">123</option>
                        <option value="456">456</option>
                        <option value="789">789</option>
                      </select>
                    </div>
                  </div>
                </div>

                </div>

                {/* Save Information Checkbox */}
                <div className="mt-4 sm:mt-6">
                  <label className="flex items-start sm:items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 bg-yellow-400 border-yellow-400 rounded focus:ring-yellow-400 checked:bg-yellow-400 mt-0.5 sm:mt-0 flex-shrink-0"
                      defaultChecked
                    />
                    <span className="text-[13px] sm:text-base text-gray-700">
                      Save my information for faster checkout next time
                    </span>
                  </label>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#E5E7EB] rounded-lg p-4 sm:p-6 lg:sticky lg:top-4">
              <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#101114] mb-4 sm:mb-6">Order Summary</h2>

              {/* Product List */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3">
                    {/* Product Image */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded flex-shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] sm:text-[14px] font-[400] text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-[13px] sm:text-[14px] font-[600] text-gray-900">
                          {item.price.toFixed(2)} BDT
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                              BDT {item.originalPrice.toFixed(2)}
                            </span>
                            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded">
                              {item.discount}% off
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 border-t border-b py-4 border-[#D1D5DC]">
                <div className="flex justify-between text-[13px] sm:text-sm">
                  <span className="text-gray-600">Total Items ({totalItems})</span>
                  <span className="font-semibold text-gray-900">
                    {totalPrice.toFixed(2)} BDT
                  </span>
                </div>
                <div className="flex justify-between text-[13px] sm:text-sm">
                  <span className="text-gray-600">Home Installation Service</span>
                  <span className="font-semibold text-gray-900">
                    {homeInstallation.toFixed(2)} BDT
                  </span>
                </div>
                <div className="flex justify-between text-[13px] sm:text-sm">
                  <span className="text-gray-600">Promo Discount</span>
                  <span className="font-semibold text-gray-900">
                    {promoDiscount.toFixed(2)} BDT
                  </span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between text-base sm:text-[18px] font-[600] text-[#101114] mb-4 sm:mb-6 pt-2">
                <span>Sub Total:</span>
                <span>{subTotal.toFixed(2)} BDT</span>
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                className="w-full bg-[#FDDE35] hover:bg-[#ffed4e] text-[#181910] text-[14px] sm:text-[16px] font-[600] py-2.5 sm:py-3 rounded transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
