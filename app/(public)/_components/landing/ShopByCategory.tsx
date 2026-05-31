'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: 'Led Light Bulbs',
    image: '/images/landing/shop-by-category/6cdbfa1b06fbd1f86cb48df36bc3071d568e571c.png',
    href: '#',
  },
  {
    title: 'Led Light Bars',
    image: '/images/landing/shop-by-category/fe8b97769c0d6d4329b7bb009525ce660e5fec2f.jpg',
    href: '#',
  },
  {
    title: 'Led Off Road Lights',
    image: '/images/landing/shop-by-category/70faa81470560edae1c25a4a8d48913b89134be9.jpg',
    href: '#',
  },
  {
    title: 'RGB Led Light',
    image: '/images/landing/shop-by-category/f66d8aa9cce7f5894e0242bd72a2805969eae8ea.jpg',
    href: '#',
  },
];

export default function ShopByCategory() {
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

      const cards = gridRef.current?.querySelectorAll(':scope > a');
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.75, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="pt-10 md:pt-[100px] pb-12 md:pb-[100px] md:py-[100px] bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div ref={headerRef} className="flex items-center justify-between mb-8 gap-4">
          <h2 className="text-xl md:text-2xl lg:text-[32px] font-[600] text-[#12100E] leading-tight break-words">Shop by Categories</h2>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#6A7282] hover:bg-gray-200 transition-colors"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FCE32D] flex items-center justify-center text-black hover:bg-[#e6cc28] transition-colors"
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative w-full sm:max-w-[313px] lg:max-w-none h-[350px] sm:h-[400px] md:h-[424px] mx-auto rounded-[8px] overflow-hidden block"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

              <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                <h3 className="text-white text-lg md:text-xl lg:text-[24px] font-semibold leading-snug break-words">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
