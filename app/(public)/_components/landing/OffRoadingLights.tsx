import Image from 'next/image';
import Link from 'next/link';

export default function OffRoadingLights() {
  return (
    <section className="pt-5 pb-5 md:pt-8 md:pb-8 bg-white">
      <div className="container mx-auto bg-white px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 lg:gap-6">
        {/* Large Left Card - Led Off Road Lights */}
        <Link
          href="/shop?category=off-road-lights"
          className="relative group overflow-hidden rounded-[8px] h-[320px] sm:h-[400px] md:h-[500px] lg:h-[630px] block"
        >
          <Image
            src="/images/landing/off-roading-lights/18afe27e021b3b5b293d07807a171ee3c5770c31.jpg"
            alt="Led Off Road Lights"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 lg:p-10">
            <h3 className="text-xl md:text-2xl lg:text-[32px] font-[600] leading-tight text-white mb-4 md:mb-6 break-words">
              Led Off Road
              <br />
              Lights
            </h3>
            <button className="bg-[#FDDE35] text-[#12100E] px-4 sm:px-6 py-2 sm:py-3 rounded-[4px] font-[600] hover:bg-[#e6cc28] transition-colors text-sm md:text-base lg:text-[16px] inline-flex items-center gap-2 sm:w-auto justify-center">
              Shop Off Road Lights
            </button>
          </div>
        </Link>

        {/* Right Column - 3 Cards */}
        <div className="grid md:grid-rows-2 gap-2 md:gap-4 lg:gap-6">
          {/* Top Row - 2 Small Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 lg:gap-6">
            {/* Led Light Bar */}
            <Link
              href="/shop?category=light-bar"
              className="relative group overflow-hidden rounded-[8px] h-[240px] sm:h-[280px] md:h-full block"
            >
              <Image
                src="/images/landing/off-roading-lights/9fd85d61974cb5e49c0a3aa244e1bcde19c6eb0d.png"
                alt="Led Light Bar"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                <h4 className="text-lg md:text-xl lg:text-[24px] font-[600] leading-snug text-white mb-2 sm:mb-3 break-words">
                  Led Light
                  <br />
                  Bar
                </h4>
                <span className="text-[#FDDE35] text-sm md:text-base lg:text-[16px] font-[600] inline-flex items-center gap-2">
                  Shop Led Lights Bar
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Remote Control Switch Panel */}
            <Link
              href="/shop?category=switch-panel"
              className="relative group overflow-hidden rounded-[8px] h-[240px] sm:h-[280px] md:h-full block"
            >
              <Image
                src="/images/landing/off-roading-lights/722df1345390b2b02f8ed49d283bd6aac6ec04c5.png"
                alt="Remote Control Switch Panel"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                <h4 className="text-lg md:text-xl lg:text-[24px] font-[600] leading-snug text-white mb-2 sm:mb-3 break-words">
                  Remote Control
                  <br />
                  Switch Panel
                </h4>
                <span className="text-[#FDDE35] text-sm md:text-base lg:text-[16px] font-[600] inline-flex items-center gap-2">
                  Shop Switch Panel
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Bottom Row - Large Card */}
          <Link
            href="/shop?category=light-bulbs"
            className="relative group overflow-hidden rounded-[8px] h-[240px] sm:h-[280px] md:h-[303px] block"
          >
            <Image
              src="/images/landing/off-roading-lights/3f19a4a1c9404be9d3e56b2923facace869555cd.jpg"
              alt="Led Light Bulbs"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
              <h4 className="text-xl md:text-2xl lg:text-[32px] font-[600] leading-tight text-white mb-3 md:mb-4 break-words">
                Led Light
                <br />
                Bulbs
              </h4>
              <span className="bg-[#FDDE35] text-[#12100E] px-4 sm:px-6 py-2 sm:py-3 rounded-[4px] font-[600] hover:bg-[#e6cc28] transition-colors text-sm md:text-base lg:text-[16px] inline-flex items-center gap-2 sm:w-auto justify-center">
                Shop Led Lights Bulbs
              </span>
            </div>
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}
