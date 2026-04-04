import Image from 'next/image';
import Link from 'next/link';

export default function AboutUsHero() {
  return (
    <section className="relative h-[490px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/about-us/hero-img.jpg"
        alt="Off-road vehicle in action"
        fill
        className="object-cover"
        priority
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50" />
      
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center text-sm text-white/90">
            <li>
              <Link 
                href="/"
                className="hover:text-white transition-colors text-[14px] font-[400]"
              >
                Home
              </Link>
            </li>
            <li className="mx-2 text-white/60 font-[600]">/</li>
            <li className="text-white text-[14px] font-[600] font-medium">About Us</li>
          </ol>
        </nav>
        
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          About Us
        </h1>
      </div>
    </section>
  );
}
