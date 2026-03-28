import Hero from './_components/landing/Hero';
import ShopByCategory from './_components/landing/ShopByCategory';
import BestSellingProducts from './_components/landing/BestSellingProducts';
import OffRoadingLights from './_components/landing/OffRoadingLights';
import NewArrivalProducts from './_components/landing/NewArrivalProducts';
import PopularAccessories from './_components/landing/PopularAccessories';
import ClientFeedback from './_components/landing/ClientFeedback';
import LightingSolutions from './_components/landing/LightingSolutions';
import CallToAction from './_components/landing/CallToAction';
import WhyChooseAuxbeam from './_components/landing/WhyChooseAuxbeam';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      {/* shop by category section */}
      <ShopByCategory />
      {/* best selling products */}
      <BestSellingProducts />
      {/* off roading lights  */}
      <OffRoadingLights />
      {/* new arrival products */}
      <NewArrivalProducts />

       {/* why choose auxbeam */}
      {/* <WhyChooseAuxbeam /> */}

      {/* popular accessories */}
      <PopularAccessories />

      {/* client feedback */}
      <ClientFeedback />

      {/* lighting-solutions */}
      <LightingSolutions />

      {/* call to action */}
      <CallToAction />
    </div>
  );
}
