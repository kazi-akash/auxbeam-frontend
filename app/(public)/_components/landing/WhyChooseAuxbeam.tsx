import Image from 'next/image';
import { Check, Truck, CreditCard, ShieldCheck } from 'lucide-react';

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

  return (
    <section className="relative w-full overflow-hidden pb-16 lg:pb-20">
      <div className="grid lg:grid-cols-2 lg:h-[702px]">
        {/* Left Side - Content with brown background */}
        <div className="bg-[#422006] px-6 py-16 md:px-12 md:py-20 lg:p-16 flex items-center">
          <div className="w-full max-w-[725px] mx-auto lg:ml-auto lg:mr-0">
            {/* Heading */}
            <h2 className="text-[32px] lg:text-[32px] font-[600] text-white mb-6 leading-tight">
              Why Choose Auxbeam Bangladesh?
            </h2>

            {/* Subheading */}
            <p className="text-[16px] font-[400] text-white/90 mb-12 leading-relaxed">
              We don&apos;t just sell car light bulbs — we deliver performance, safety, and
              reliability. Auxbeam Bangladesh brings you authentic, high-performance automotive
              lighting solutions backed by local support and professional service.
            </p>

            {/* Features */}
            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-5 lg:gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-[40px] h-[40px] bg-[#FDB913] rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#422006]" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-[20px] font-[600] text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[14px] font-[400] text-white/80 leading-relaxed">
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
        <div className="relative h-[500px] lg:h-full">
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
