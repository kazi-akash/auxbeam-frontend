'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TrustUs() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef   = useRef<HTMLElement>(null);
  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  // Keep refs for accordion content panels for smooth height animation
  const contentRefs  = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 87%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 50, scale: 0.97 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.0, ease: 'power2.out',
          scrollTrigger: { trigger: rightRef.current, start: 'top 87%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate accordion content panel open
  function handleAccordion(index: number) {
    const next = openIndex === index ? -1 : index;
    setOpenIndex(next);

    // Micro-animation: bounce the chevron button
    const btn = sectionRef.current?.querySelectorAll('[data-accordion-btn]')[index];
    if (btn) {
      gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
    }
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left: Content */}
          <div ref={leftRef} className="order-2 lg:order-1">
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-[600] text-[#12100E] mb-3 sm:mb-4">
              The Core Reasons to Trust Us
            </h2>

            {/* Description */}
            <p className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400] leading-relaxed mb-6 sm:mb-8">
              We're committed to delivering premium automotive lighting with unmatched service and
              support across Bangladesh.
            </p>

            {/* Accordion */}
            <div className="space-y-3 sm:space-y-4">
              {accordionItems.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden transition-all ${
                    openIndex === index ? 'bg-[#F3F4F6]' : 'bg-[#F3F4F6]'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    data-accordion-btn
                    onClick={() => handleAccordion(index)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                  >
                    <span className="text-[16px] sm:text-[20px] font-[500] text-[#12100E] pr-2">
                      {item.title}
                    </span>
                    <div
                      className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        openIndex === index ? 'bg-[#FCE32D]' : 'bg-[#E5E7EB]'
                      }`}
                    >
                      {openIndex === index ? (
                        <ChevronUp className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-black" />
                      ) : (
                        <ChevronDown className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-[#6B7280]" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {openIndex === index && (
                    <div
                      ref={(el) => { contentRefs.current[index] = el; }}
                      className="px-3 sm:px-4 pb-3 sm:pb-4"
                    >
                      <p className="text-[#4D4C44] text-[13px] sm:text-[14px] font-[400] leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div ref={rightRef} className="relative order-1 lg:order-2">
            <div className="relative w-full max-w-[602px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[592px] rounded-[8px] overflow-hidden mx-auto lg:ml-auto">
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
