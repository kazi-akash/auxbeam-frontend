'use client';

import { useState } from 'react';
import ProductReviews from './ProductReviews';

type TabType = 'description' | 'specifications' | 'shipping' | 'reviews';

interface ProductDetailsProps {
  reviewCount?: number;
}

export default function ProductDetails({ reviewCount = 132 }: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs = [
    { id: 'description' as TabType, label: 'Description' },
    { id: 'specifications' as TabType, label: 'Specifications' },
    { id: 'shipping' as TabType, label: 'Shipping & Refund' },
    { id: 'reviews' as TabType, label: `Reviews (${reviewCount})` },
  ];

  return (
    <div className="w-full font-sans">
      {/* Tab Navigation */}
      <div className="flex items-center gap-[16px] mb-[16px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory touch-pan-x">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 lg:px-6 py-2.5 lg:py-3 text-[12px] lg:text-[14px] font-[600] transition-colors rounded-[4px] whitespace-nowrap flex-shrink-0 snap-start ${
              activeTab === tab.id
                ? 'bg-[#FDDE35] text-[#12100E]'
                : 'bg-[#FFFFFF] text-[#4D4C44] hover:bg-gray-50 border border-[#E5E7EB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'description' && (
        <div className="bg-white p-4 lg:p-[32px] border border-gray-200 rounded-[6px]">
          {/* Product Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
            
            <div className="space-y-6">
              {/* LED DOUBLE-SIDED CHIP */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">LED DOUBLE-SIDED CHIP</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm text-gray-700 leading-relaxed">
                    F2 series led light bulbs with 360° illumination CSP LED double-sided chips, provide up to 300% more light with a 6500K Xenon white clearer color. Luminous Flux: 10000lm/set (5000lm/bulb),3 times brighter than the halogen lamp.
                  </li>
                </ul>
              </div>

              {/* Better Light Output */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Better Light Output</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm text-gray-700 leading-relaxed">
                    Engineering beam pattern design throw light on the road evenly at an appropriate angle without foggy light. Soft white light in a solid beam pattern, will not dazzle oncoming traffic.
                  </li>
                </ul>
              </div>

              {/* 50000 Hours Longer Lifespan */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">50000 Hours Longer Lifespan</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm text-gray-700 leading-relaxed">
                    All-in-one aviation 6063 aluminum profile as heat conduction system,360-degree heat radiating; High-speed mute fan(12000R/Min), high airflow for faster cooling rate, ensures maximum heat dissipation.
                  </li>
                </ul>
              </div>

              {/* Built In Can-Bus */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Built In Can-Bus</h3>
                <ul className="list-disc pl-5 space-y-3">
                  <li className="text-sm text-gray-700 leading-relaxed">
                    New upgraded driver system, improves the compatibility with 99% of vehicle's computer system without error.
                  </li>
                  <li className="text-sm text-gray-700 leading-relaxed">
                    Some sensitive car brands like Mercedes-Benz, BMW, Volvo, Dodge, Ford Fusion, Ford Focus, Ford Escape, etc, may flicker after installation (not a quality issue), specific Canbus decoders are needed.
                  </li>
                  <li className="text-sm text-gray-700 leading-relaxed">
                    New upgraded driver system, improves the compatibility with 99% of vehicle's computer system without error.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Package Included */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Included</h2>
            <ul className="list-disc pl-5">
              <li className="text-sm text-gray-700 leading-relaxed">2 PCs LED Light Bulbs</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Faq</h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="text-sm text-gray-700 leading-relaxed">2 PCs LED Light Bulbs</li>
            </ul>
            
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">
                How can I get the right led bulbs for my vehicle?
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  Two ways to help you find the right bulbs:
                  <div className="mt-1">
                    1) Go to{' '}
                    <a href="#" className="text-gray-900 underline hover:text-gray-700">
                      SELECT YOUR VEHICLE
                    </a>{' '}
                    to select your Year Make Model to get the right bulbs for your vehicle.
                  </div>
                  <div className="mt-1">
                    2) Please contact us at customer@auxbeam.com, and tell us about the Year Make Model of your vehicle. Let us know which LED bulb you're interested in, so we can check the fitment and get back to you as soon as possible.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Attention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Attention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-sm text-gray-700 leading-relaxed">
                Please allow a 1-3cm (0.4-1.18") difference due to manual measurement and slight color variation for different display settings.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                Due to the difference between different monitors, the picture may not reflect the actual color of the item.
              </li>
            </ul>
          </section>
        </div>
      )}

      {activeTab === 'specifications' && (
        <div className="bg-white p-4 lg:p-[32px] border border-gray-200 rounded-[6px]">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Specifications</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-sm text-gray-700 leading-relaxed">LED Type: CSP 1860</li>
              <li className="text-sm text-gray-700 leading-relaxed">Efficacy(2/pcs): 52W</li>
              <li className="text-sm text-gray-700 leading-relaxed">LED Quantity(per bulb):</li>
              <li className="text-sm text-gray-700 leading-relaxed">12pcs (Single beam socket)</li>
              <li className="text-sm text-gray-700 leading-relaxed">24pcs (H4&La beam socket)</li>
              <li className="text-sm text-gray-700 leading-relaxed">Effective Lumen(2/pcs): 10000LM</li>
              <li className="text-sm text-gray-700 leading-relaxed">Current Draw: 2.1A</li>
              <li className="text-sm text-gray-700 leading-relaxed">Operating Voltage: 9-12V</li>
              <li className="text-sm text-gray-700 leading-relaxed">Color: 6500K Cool White</li>
              <li className="text-sm text-gray-700 leading-relaxed">Material: Aviation 6063 Aluminum</li>
              <li className="text-sm text-gray-700 leading-relaxed">Heat Dissipation Mode: Fan Dissipation</li>
              <li className="text-sm text-gray-700 leading-relaxed">LED Lifetime: 50000 hours</li>
              <li className="text-sm text-gray-700 leading-relaxed">Waterproof: IP68</li>
              <li className="text-sm text-gray-700 leading-relaxed">Ambient Operating Temperature: -40celsius degree - 150celsius degree</li>
            </ul>
          </section>
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="bg-white p-4 lg:p-[32px] border border-gray-200 rounded-[6px]">
          {/* International Shipping */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">International Shipping</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              Auxbeam Lighting is shipping worldwide covering North and South America, Europe, Asia, Africa, Oceania and more. 
              We employ the services of major, trusted international carriers to ensure your package arrives at your destination safely. 
              U.S. domestic orders are shipped from our USA warehouse for the fastest delivery times but exceptions may occur based on stock shortage - because of which we may have to ship from China. International orders are shipped from our China warehouse.
            </p>
          </section>

          {/* Shipping Time */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Time</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li className="text-sm text-gray-700 leading-relaxed">U.S. domestic shipping: about 3-5 Working Days</li>
              <li className="text-sm text-gray-700 leading-relaxed">International shipping: about 8-15 working days</li>
              <li className="text-sm text-gray-700 leading-relaxed">A standard processing time of up to 48 hours is required before the order is shipped out.</li>
              <li className="text-sm text-gray-700 leading-relaxed">
                Due to challenges posed by the pandemic, our carrier is temporarily experiencing shipping delays, which may delay your delivery. We are always work to get your package to you as quickly and safely as possible.
              </li>
            </ul>
          </section>

          {/* Shipping Cost */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Cost</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We offer free shipping on all of our products to customers in the Continental U.S. when orders over $19.99. Customers in other regions need to pay additional shipping costs(Specific amount please kindly refer to your checkout page).
            </p>
          </section>

          {/* Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tracking</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Your tracking number will be sent in email immediately after we ship the order out. You may follow the link in the email to check the estimated arrival time of your order.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              (Please note that tracking information will only be updated online in 1 working day after your order has been shipped.)
            </p>
          </section>

          {/* Additional Notes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Notes</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-sm text-gray-700 leading-relaxed">
                If the wrong information is provided (address, phone, email) and results in your shipment being undeliverable, the customer is responsible for the shipping cost for the 2nd shipment.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                We do not offer overnight shipping.
                <div className="mt-1">
                  If you have any questions, please feel free to contact us via email: Customer@auxbeam.com
                </div>
              </li>
            </ul>
          </section>
        </div>
      )}

      {activeTab === 'reviews' && (
        <ProductReviews 
          totalReviews={reviewCount}
          averageRating={5}
          currentPage={1}
          totalPages={5}
        />
      )}
    </div>
  );
}
