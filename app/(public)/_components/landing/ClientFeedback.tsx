'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: 'Upgraded my Prado with Auxbeam LED straight, sharp, and glare-free.',
    name: 'Rakib Hasan',
    role: 'Automotive Enthusiast',
    image: '/images/landing/client-feedback/536c8bf6ec7eb35b36b1b8ec1953f4c098029a49.png',
  },
  {
    id: 2,
    quote: 'Auxbeam bulbs instantly improved my night driving visibility.',
    name: 'Tanvir Ahmed',
    role: 'Business Executive',
    image: '/images/landing/client-feedback/91409c62d10476f009ceb549f50a2ad82eecdbf1.png',
  },
  {
    id: 3,
    quote: 'Auxbeam LEDs deliver strong visibility in any condition.',
    name: 'Mizanur Rahman',
    role: 'Off-Road Driver',
    image: '/images/landing/client-feedback/c720ec2c5e57a0bc8d6ddfb287ceee26a9140229.png',
  },
  {
    id: 4,
    quote: 'Auxbeam LEDs deliver strong visibility in any condition.',
    name: 'Tanvir Ahmed',
    role: 'Business Executive',
    image: '/images/landing/client-feedback/cfa8138ad5135723dcedad5236627bc4d080c002.png',
  },
];

export default function ClientFeedback() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );

      const cards = gridRef.current?.querySelectorAll(':scope > div');
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-10 md:py-16 lg:py-[100px] bg-[#F9FAFB]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex items-start justify-between mb-8 md:mb-10 gap-4">
          <h2 className="text-xl md:text-2xl lg:text-[32px] font-[600] text-[#12100E] max-w-md leading-tight break-words">
            Feedback From Our Satisfied Customers
          </h2>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#D1D5DB] transition-colors"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#6A7282]" />
            </button>
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FCE32D] flex items-center justify-center hover:bg-[#e6cc28] transition-colors"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#12100E]" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative rounded-[8px] overflow-hidden h-[400px] sm:h-[440px] md:h-[480px] group cursor-pointer"
            >
              {/* Full Card Image */}
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
                  aria-label="Play video testimonial"
                >
                  <Play className="w-6 h-6 text-[#12100E] ml-1" fill="currentColor" />
                </button>
              </div>

              {/* Text Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-16 sm:pt-20">
                {/* Quote */}
                <p className="text-white text-sm md:text-[14px] font-[400] leading-relaxed mb-3 sm:mb-4 break-words">
                  {testimonial.quote}
                </p>

                {/* Customer Info */}
                <h3 className="text-white text-base md:text-lg lg:text-[20px] font-[500] mb-1 leading-snug break-words">
                  {testimonial.name}
                </h3>
                <p className="text-white/80 text-sm md:text-[14px] font-[400] break-words">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
