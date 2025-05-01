
import React from 'react';
import SeoHelmet from '@/components/home/SeoHelmet';
import HeroSection from '@/components/home/HeroSection';
import PoweredBySection from '@/components/home/PoweredBySection';
import FeaturesSection from '@/components/home/FeaturesSection';
import RoadmapSection from '@/components/home/RoadmapSection';
import Footer from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHelmet />
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <HeroSection />

        <div id="features" className="py-16">
          <PoweredBySection />
          <FeaturesSection />
        </div>

        <div className="py-16 text-center">
          <RoadmapSection />
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
