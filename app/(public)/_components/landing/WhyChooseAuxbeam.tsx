'use client';

import Image from 'next/image';
import { Check, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhyChooseAuxbeam() {
  const features = [
    {
      icon: Check,
      title: '100% Authentic Premium Products',
      description:
        'We provide genuine, high-performance Auxbeam LED light bulbs engineered for superior brightness, durability, and long lifespan.',
    },
    {
      icon: Truck,
      title: 'Fast Nationwide Delivery',
      description:
        'Quick and secure shipping across Bangladesh with reliable packaging and order tracking.',
    },
    {
      icon: CreditCard,
      title: 'EMI Available',
      description:
        'Upgrade your vehicle today and pay in easy monthly installments — fast approval and flexible options.',
    },
    {
      icon: ShieldCheck,
      title: 'Warranty & After-Sales Service',
      description:
        'Enjoy peace of mind with product warranty coverage and responsive customer support whenever you need help.',
    },
  ];

  const sectionRef     = useRef<HTMLElement>(null);
  const leftPanelRef   = useRef<HTMLDivElement>(null);
  const rightImgRef    = useRef<HTMLDivElement>(null);
  const headingRef     = useRef<HTMLHeadingElement>(null);
  const subRef         = useRef<HTMLParagraphElement>(null);
  const featuresRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left panel slide in from left
      gsap.fromTo(
        leftPanelRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: leftPanelRef.current, start: 'top 86%', toggleActions: 'play none none none' },
        }
      );

      // Right image scale + fade
      gsap.fromTo(
        rightImgRef.current,
        { opacity: 0, scale: 1.04 },
        {
          opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: rightImgRef.current, start: 'top 86%', toggleActions: 'play none none none' },
        }
      );

      // Stagger feature rows within the left panel
      const featureItems = featuresRef.current?.querySelectorAll(':scope > div');
      if (featureItems?.length) {
        gsap.fromTo(
          featureItems,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.6, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: featuresRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-10 md:pb-16 lg:pb-20">
      <div className="grid lg:grid-cols-2 lg:h-[702px]">
        {/* Left Side - Content with brown background */}
        <div ref={leftPanelRef} className="bg-[#422006] px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:p-16 flex items-center">
          <div className="w-full max-w-[725px] mx-auto lg:ml-auto lg:mr-0">
            {/* Heading */}
            <h2 ref={headingRef} className="text-xl md:text-2xl lg:text-[32px] font-[600] text-white mb-4 md:mb-6 leading-tight break-words">
              Why Choose Auxbeam Bangladesh?
            </h2>

            {/* Subheading */}
            <p ref={subRef} className="text-sm md:text-base lg:text-[16px] font-[400] text-white/90 mb-8 md:mb-12 leading-relaxed break-words">
              We don&apos;t just sell car light bulbs — we deliver performance, safety, and
              reliability. Auxbeam Bangladesh brings you authentic, high-performance automotive
              lighting solutions backed by local support and professional service.
            </p>

            {/* Features */}
            <div ref={featuresRef} className="space-y-6 md:space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4 sm:gap-5 lg:gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] bg-[#FDB913] rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#422006]" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg lg:text-[20px] font-[600] text-white mb-2 leading-snug break-words">
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-[14px] font-[400] text-white/80 leading-relaxed break-words">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div ref={rightImgRef} className="relative h-[500px] lg:h-full">
          <Image
            src="/images/landing/why-choose-auxbeam/752b5c1c483c65b97ac8407f71b29f6f432d5e81.jpg"
            alt="Auxbeam LED lights on vehicle in forest"
            fill
            className="object-cover object-right"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={95}
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
