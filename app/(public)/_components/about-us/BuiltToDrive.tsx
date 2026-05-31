'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CircleCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BuiltToDrive() {
  const sectionRef  = useRef<HTMLElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div ref={leftRef} className='max-w-[646px]'>
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-[600] text-[#12100E] mb-4 sm:mb-[16px]">
              Built to Drive Real Performance.
            </h2>

            {/* Description */}
            <p className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400] leading-relaxed mb-8 sm:mb-[40px]">
              Our mission is to make premium automotive lighting accessible to every driver in
              Bangladesh. We believe safer roads start with better visibility — and we're committed to
              delivering that through authentic, high-performance products.
            </p>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-[64px]">
              <div className="flex items-start gap-2 sm:gap-3">
                <CircleCheck className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400]">
                  Deliver authentic Auxbeam products at fair prices
                </span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <CircleCheck className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400]">
                  Provide expert guidance for every vehicle type
                </span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <CircleCheck className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400]">
                  Build a safer driving experience across Bangladesh
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 sm:gap-3 bg-[#FCE32D] text-black py-2 sm:py-[8px] px-2 sm:px-[8px] pl-4 sm:pl-5 rounded-[4px] font-[600] hover:bg-[#e6cc28] transition-colors text-[16px] sm:text-base"
            >
              <span>Explore Our Products</span>
              <div className="bg-black p-1 rounded-sm flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </Link>

          </div>

          {/* Right: Image */}
          <div ref={rightRef} className="relative">
            <div className="relative w-full max-w-[602px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[592px] rounded-[8px] overflow-hidden mx-auto lg:ml-auto">
              <Image
                src="/images/about-us/build-to-drive-img.jpg"
                alt="Toyota truck with Auxbeam lighting on highway"
                fill
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
