'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Image overlay fades from darker to normal
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.85 },
        { opacity: 1, duration: 1.4 }
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 36, skewY: 1.5 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.9 },
          "-=0.9"
        )
        .fromTo(
          bodyRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.55"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 18, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65 },
          "-=0.45"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-[400px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex flex-col justify-center bg-gray-900">
      {/* Background Image */}
      <div ref={overlayRef} className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/landing/hero-section/71ef64f0a132ffbfab7877b54277bf12903f24b2.jpg"
          alt="Auxbeam Automotive Lighting"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark Overlay for Text Readability - Enhanced for mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/30 md:from-black/20 md:via-black/40 md:to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto z-10 pt-12 sm:pt-16 md:pt-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl">
          <h1
            ref={headingRef}
            className="font-sans text-2xl xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-semibold leading-tight tracking-[-0.01em] text-white mb-4 sm:mb-5 md:mb-6 break-words"
            style={{ opacity: 0 }}
          >
            Next-Level <br />
            Automotive Lighting <br />
            Starts Here
          </h1>
          <p
            ref={bodyRef}
            className="font-sans text-sm sm:text-[15px] md:text-[16px] font-normal leading-relaxed tracking-[-0.01em] text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-lg break-words"
            style={{ opacity: 0 }}
          >
            Upgrade your ride with powerful, durable Auxbeam <br className="hidden lg:block" />Led snow available across Bangladesh.
          </p>
          <Link
            ref={ctaRef}
            href="/shop"
            className="inline-flex items-center gap-2 sm:gap-3 bg-[#FCE32D] text-black py-2 sm:py-[8px] px-2 sm:px-[8px] pl-4 sm:pl-5 rounded-[4px] font-bold hover:bg-[#e6cc28] transition-colors text-sm sm:text-base sm:w-auto justify-center"
            style={{ opacity: 0 }}
          >
            <span>Explore Our Lights</span>
            <div className="bg-black p-1 rounded-sm flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
