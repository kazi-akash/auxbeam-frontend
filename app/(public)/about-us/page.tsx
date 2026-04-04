import AboutUsHero from '../_components/about-us/AboutUsHero';
import PoweringEveryDrive from '../_components/about-us/PoweringEveryDrive';
import BuiltToDrive from '../_components/about-us/BuiltToDrive';
import ShapingTheFuture from '../_components/about-us/ShapingTheFuture';
import WhatMakesUsDifferent from '../_components/about-us/WhatMakesUsDifferent';
import TrustUs from '../_components/about-us/TrustUs';

export const metadata = {
  title: 'About Us | Auxbeam',
  description: 'Learn more about Auxbeam, our mission, and our values.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AboutUsHero />

      {/* Powering Every Drive Section */}
      <PoweringEveryDrive />

      {/* Built to Drive Section */}
      <BuiltToDrive />

      {/* Shaping The Future Section */}
      <ShapingTheFuture />

      {/* What Makes Us Different */}
      <WhatMakesUsDifferent />

      {/* Trust Us */}
      <TrustUs />
      
    </div>
  );
}
