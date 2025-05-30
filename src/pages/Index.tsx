
import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PoweredBySection from '@/components/home/PoweredBySection';
import RoadmapSection from '@/components/home/RoadmapSection';
import Footer from '@/components/home/Footer';
import SeoHelmet from '@/components/home/SeoHelmet';
import EnsSearch from '@/components/search/EnsSearch';

const Index = () => {
  return (
    <>
      <SeoHelmet />
      <Helmet>
        <title>Recruitment.box - Decentralized CV & Recruitment Engine</title>
        <meta name="description" content="Build your Web3 professional identity with Recruitment.box. Showcase your skills, POAPs, GitHub contributions, and blockchain activity in one decentralized profile." />
        <meta name="keywords" content="Web3, recruitment, ENS, blockchain, CV, portfolio, decentralized, ethereum, talent, skills" />
        <meta property="og:title" content="Recruitment.box - Decentralized CV & Recruitment Engine" />
        <meta property="og:description" content="Build your Web3 professional identity with verifiable credentials and blockchain-based achievements." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recruitment.box - Decentralized CV & Recruitment Engine" />
        <meta name="twitter:description" content="Build your Web3 professional identity with verifiable credentials and blockchain-based achievements." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <HeroSection />
        <FeaturesSection />
        
        {/* ENS User Search Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Discover Web3 Talent Worldwide
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Search for ENS users by country and explore their decentralized profiles. 
                Connect with Web3 talent from around the globe.
              </p>
            </div>
            <EnsSearch />
          </div>
        </section>
        
        <PoweredBySection />
        <RoadmapSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
