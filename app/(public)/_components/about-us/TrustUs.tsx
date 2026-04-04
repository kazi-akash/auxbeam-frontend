'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TrustUs() {
  const [openIndex, setOpenIndex] = useState(0);

  const accordionItems = [
    {
      title: '{01} Authorized Auxbeam Distributor',
      content: 'We are the only authorized distributor of Auxbeam products in Bangladesh, ensuring every product you buy is 100% genuine with manufacturer warranty.',
    },
    {
      title: '{02} Nationwide Fast Delivery',
      content: 'Fast and reliable delivery service across Bangladesh to get your products to you quickly.',
    },
    {
      title: '{03} Flexible EMI Options',
      content: 'Easy payment plans available to make premium lighting solutions accessible to everyone.',
    },
    {
      title: '{04} After-Sales Excellence',
      content: 'Comprehensive support and service after your purchase to ensure complete satisfaction.',
    },
    {
      title: '{05} Community of Enthusiasts',
      content: 'Join a growing community of automotive lighting enthusiasts and off-road adventurers.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Content */}
          <div>
            {/* Heading */}
            <h2 className="text-3xl md:text-[32px] font-[600] text-[#12100E] mb-4">
              The Core Reasons to Trust Us
            </h2>

            {/* Description */}
            <p className="text-[#4D4C44] text-[16px] font-[400] leading-relaxed mb-8">
              We're committed to delivering premium automotive lighting with unmatched service and
              support across Bangladesh.
            </p>

            {/* Accordion */}
            <div className="space-y-4">
              {accordionItems.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden transition-all ${
                    openIndex === index ? 'bg-[#F3F4F6]' : 'bg-[#F3F4F6]'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="text-[20px] font-[500] text-[#12100E]">
                      {item.title}
                    </span>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        openIndex === index ? 'bg-[#FCE32D]' : 'bg-[#E5E7EB]'
                      }`}
                    >
                      {openIndex === index ? (
                        <ChevronUp className="w-[16px] h-[16px] text-black" />
                      ) : (
                        <ChevronDown className="w-[16px] h-[16px] text-[#6B7280]" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {openIndex === index && (
                    <div className="px-4 pb-4">
                      <p className="text-[#4D4C44] text-[14px] font-[400] leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative w-full max-w-[602px] h-[592px] rounded-[8px] overflow-hidden ml-auto">
              <Image
                src="/images/about-us/trust-us-img.jpg"
                alt="White Toyota truck with Auxbeam lighting in snowy terrain"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
