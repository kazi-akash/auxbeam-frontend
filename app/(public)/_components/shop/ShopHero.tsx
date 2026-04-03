import Image from 'next/image';
import Link from 'next/link';

export default function ShopHero() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[460px] bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/shop/1b67c2f43c4e0b8d54c7a2f7ea626f6d14d85cfe.jpg"
          alt="Shop All Products"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="relative h-full container mx-auto flex flex-col justify-center">
        <div className="max-w-xl">
          <nav className="text-gray-300 text-sm md:text-base font-medium mb-4 flex items-center space-x-2">
            <Link href="/" className="hover:text-white transition-colors font-normal text-[14px]">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-semibold text-[14px]">All Product</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-white tracking-tight">
            All Products
          </h1>
        </div>
      </div>
    </div>
  );
}
