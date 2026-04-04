import { Shield, Zap, Wrench, Headphones } from 'lucide-react';
import Image from 'next/image';

export default function WhatMakesUsDifferent() {
  return (
    <section className="relative py-16 md:py-24 h-[577px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/about-us/what-makes-us-different.png"
          alt="Background"
          fill
          className="object-cover opacity-10"
        />
      </div>
      
      {/* Background Color Overlay */}
      <div className="absolute inset-0 bg-[#422006]" style={{ mixBlendMode: 'multiply' }} />
      
      <div className="container mx-auto relative z-10">
        {/* Heading and Description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[32px] font-[600] text-white mb-[29px]">
            What Makes Us Different
          </h2>
          <p className="text-white text-[16px] font-[400] max-w-3xl mx-auto leading-relaxed">
            We go beyond selling automotive lighting — we deliver a complete experience built
            on quality, performance, and trust, tailored for drivers in Bangladesh.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1312px] mx-auto">
          {/* Card 1 */}
          <div className="bg-[#FEF9C3] rounded-[8px] w-full max-w-[313px] h-[234px] pt-[21px] pl-[16px] pr-[16px] mx-auto">
            <div className="w-12 h-12 bg-[#FDDE35] rounded-[8px] flex items-center justify-center mb-8">
              <Shield className="w-[24px] h-[24px] text-[#12100E]" />
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] mb-[16px]">
              100% Authentic Products
            </h3>
            <p className="text-[#4D4C44] text-[14px] font-[400] leading-relaxed">
              Every product is officially sourced from Auxbeam with verified authenticity and guaranteed performance.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FEF9C3] rounded-[8px] w-full max-w-[313px] h-[234px] pt-[21px] pl-[16px] pr-[16px] pb-[16px] mx-auto">
            <div className="w-12 h-12 bg-[#FDDE35] rounded-[8px] flex items-center justify-center mb-8">
              <Zap className="w-[24px] h-[24px] text-[#12100E]" />
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] mb-[16px]">
              Performance Driven
            </h3>
            <p className="text-[#4D4C44] text-[14px] font-[400] leading-relaxed">
              Engineered for maximum output — our LED solutions deliver superior brightness and longevity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FEF9C3] rounded-[8px] w-full max-w-[313px] h-[234px] pt-[21px] pl-[16px] pr-[16px] pb-[16px] mx-auto">
            <div className="w-12 h-12 bg-[#FDDE35] rounded-[8px] flex items-center justify-center mb-8">
              <Wrench className="w-[24px] h-[24px] text-[#12100E]" />
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] mb-[16px]">
              Expert Installation
            </h3>
            <p className="text-[#4D4C44] text-[14px] font-[400] leading-relaxed">
              Professional installation support for selected products with step-by-step guidance.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#FEF9C3] rounded-[8px] w-full max-w-[313px] h-[234px] pt-[21px] pl-[16px] pr-[16px] pb-[16px] mx-auto">
            <div className="w-12 h-12 bg-[#FDDE35] rounded-[8px] flex items-center justify-center mb-8">
              <Headphones className="w-[24px] h-[24px] text-[#12100E]" />
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] mb-[16px]">
              Dedicated Support
            </h3>
            <p className="text-[#4D4C44] text-[14px] font-[400] leading-relaxed">
              Our customer service team is always ready to assist with pre-sales and after-sales queries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
