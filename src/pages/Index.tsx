
import React from 'react';
import SeoHelmet from '@/components/home/SeoHelmet';
import HeroBackground from '@/components/home/HeroBackground';
import HeroTitle from '@/components/home/HeroTitle';
import SearchSection from '@/components/home/SearchSection';
import ActionButtonsSection from '@/components/home/ActionButtonsSection';
import FeaturedProfileSection from '@/components/home/FeaturedProfileSection';
import RainbowWalletConnect from '@/components/home/RainbowWalletConnect';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <SeoHelmet />
      
      {/* Animated Professional Background */}
      <HeroBackground />
      
      {/* Top Left Wallet Connect */}
      <div className="absolute top-4 left-4 z-20">
        <RainbowWalletConnect />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto">
            <HeroTitle />
            <SearchSection />
            <ActionButtonsSection />
            <FeaturedProfileSection />
          </div>
        </section>

        {/* Hidden SEO Content */}
        <div className="sr-only">
          blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, 
          blockchain verification, crypto recruitment, web3 jobs, ens profiles,
          decentralized hiring, blockchain cv, web3 talent, crypto jobs,
          ethereum recruitment, blockchain jobs, web3 hiring platform
        </div>
      </div>
    </div>
  );
};

export default Index;
