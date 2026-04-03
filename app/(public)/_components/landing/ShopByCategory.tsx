import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  return (
    <section className="pt-[250px] pb-[100px] md:py-[100px]">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-[600] text-[#12100E]">Shop by Categories</h2>
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-[#FCE32D] flex items-center justify-center text-black hover:bg-[#e6cc28] transition-colors"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative w-full max-w-[300px] lg:max-w-none h-[424px] mx-auto rounded-[8px] overflow-hidden block"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white text-[24px] font-semibold">
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
