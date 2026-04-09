import Image from 'next/image';

export default function PoweringEveryDrive() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full max-w-[602px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[701px] rounded-lg overflow-hidden mx-auto lg:mx-0">
              <Image
                src="/images/about-us/powering-every-drive-img.jpg"
                alt="Auxbeam showroom with automotive lighting products"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-[600] text-[#12100E] mb-4 sm:mb-[16px]">
              Powering Every Drive with Precision Performance & Trust
            </h2>

            {/* Description */}
            <p className="text-[#4D4C44] text-[14px] sm:text-[16px] font-[400] leading-relaxed mb-8 sm:mb-12">
              Auxbeam Bangladesh is dedicated to delivering world-class automotive lighting solutions to drivers who demand more from their vehicles. From high-performance LED headlight bulbs to advanced off-road lighting systems, our products are engineered for superior brightness, durability, and reliability.
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-[646px]">
              {/* Stat 1 */}
              <div className="bg-[#F9FAFB] w-full max-w-[313px] h-auto min-h-[180px] sm:min-h-[212px] rounded-[8px] p-5 sm:p-[24px] border-[0.5px] border-[#E5E7EB] mx-auto">
                <div className="text-[28px] sm:text-[32px] font-[600] text-[#12100E] mb-12 sm:mb-[70px]">500+</div>
                <div className="text-[18px] sm:text-[20px] font-[500] text-[#12100E] mb-1">Happy Customers</div>
                <div className="text-[14px] sm:text-[16px] text-[#4D4C44] text-[400]">Satisfied drivers across Bangladesh</div>
              </div>

              {/* Stat 2 */}
              <div className="bg-[#F9FAFB] w-full max-w-[313px] h-auto min-h-[180px] sm:min-h-[212px] rounded-[8px] p-5 sm:p-[24px] border-[0.5px] border-[#E5E7EB] mx-auto">
                <div className="text-[28px] sm:text-[32px] font-[600] text-[#12100E] mb-12 sm:mb-[70px]">03+</div>
                <div className="text-[18px] sm:text-[20px] font-[500] text-[#12100E] mb-1">Years of Experience</div>
                <div className="text-[14px] sm:text-[16px] text-[#4D4C44] text-[400]">Dedicated to automotive excellence</div>
              </div>

              {/* Stat 3 */}
              <div className="bg-[#F9FAFB] w-full max-w-[313px] h-auto min-h-[180px] sm:min-h-[212px] rounded-[8px] p-5 sm:p-[24px] border-[0.5px] border-[#E5E7EB] mx-auto">
                <div className="text-[28px] sm:text-[32px] font-[600] text-[#12100E] mb-12 sm:mb-[70px]">100%</div>
                <div className="text-[18px] sm:text-[20px] font-[500] text-[#12100E] mb-1">Customer Satisfaction</div>
                <div className="text-[14px] sm:text-[16px] text-[#4D4C44] text-[400]">Your Satisfaction, Our Commitment</div>
              </div>

              {/* Stat 4 */}
              <div className="bg-[#F9FAFB] w-full max-w-[313px] h-auto min-h-[180px] sm:min-h-[212px] rounded-[8px] p-5 sm:p-[24px] border-[0.5px] border-[#E5E7EB] mx-auto">
                <div className="text-[28px] sm:text-[32px] font-[600] text-[#12100E] mb-12 sm:mb-[70px]">24/7</div>
                <div className="text-[18px] sm:text-[20px] font-[500] text-[#12100E] mb-1">Customer Support</div>
                <div className="text-[14px] sm:text-[16px] text-[#4D4C44] text-[400]">Always here to help you</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
