'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CircleCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ShapingTheFuture() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, x: -50, scale: 0.97 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.0, ease: 'power2.out',
          scrollTrigger: { trigger: imgRef.current, start: 'top 87%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: textRef.current, start: 'top 87%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <div ref={imgRef} className="relative order-2 lg:order-1">
            <div className="relative w-full max-w-[602px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[592px] rounded-[8px] overflow-hidden mx-auto lg:mx-0">
              <Image
                src="/images/about-us/automotive-light-img.jpg"
                alt="Toyota truck with Auxbeam lighting in desert terrain"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div ref={textRef} className='max-w-[646px] order-1 lg:order-2'>
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-[600] text-[#12100E] mb-4 sm:mb-[16px]">
              Shaping The Future of Automotive Light.
            </h2>

            {/* Description */}
            <p className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400] leading-relaxed mb-8 sm:mb-[40px]">
              We envision a Bangladesh where every vehicle on the road is equipped with reliable,
              energy-efficient lighting solutions. From city commuters to off-road adventurers — we aim
              to be the go-to brand for automotive illumination.
            </p>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-[64px]">
              <div className="flex items-start gap-2 sm:gap-3">
                <CircleCheck className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400]">
                  Become Bangladesh's automotive lighting brand
                </span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <CircleCheck className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400]">
                  Expand product range to cover all vehicle categories
                </span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <CircleCheck className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400]">
                  Innovate with smart lighting technology solutions
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
        </div>
      </div>
    </section>
  );
}
