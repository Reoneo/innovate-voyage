
import React from 'react';
import SeoHelmet from '@/components/home/SeoHelmet';
import HeroBackground from '@/components/home/HeroBackground';
import HeroTitle from '@/components/home/HeroTitle';
import SearchSection from '@/components/home/SearchSection';
import FeaturedProfileSection from '@/components/home/FeaturedProfileSection';
import RainbowWalletConnect from '@/components/home/RainbowWalletConnect';
import ThemeToggle from '@/components/home/ThemeToggle';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const IndexContent = () => {
  const { isDayMode } = useTheme();

  return (
    <div className={`min-h-screen relative ${isDayMode ? 'bg-white' : 'bg-slate-900'} overflow-x-hidden`}>
      <SeoHelmet />
      
      {/* Animated menu and theme toggle */}
      <ThemeToggle />
      
      {/* Schema.org structured data for better SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Recruitment.box",
        "alternateName": "Decentralized CV & Recruitment Engine",
        "url": "https://recruitment.box",
        "description": "Find talent on the blockchain with our decentralized CV & recruitment engine. Verify skills, connect with Web3 professionals, and hire with confidence using blockchain-verified credentials.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://recruitment.box/{search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Recruitment.box",
          "logo": {
            "@type": "ImageObject",
            "url": "https://recruitment.box/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png"
          }
        },
        "mainEntity": {
          "@type": "SoftwareApplication",
          "name": "Recruitment.box",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "description": "Decentralized recruitment platform for Web3 talent discovery and blockchain-verified professional credentials",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "250"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      })}
      </script>
      
      {/* Animated Professional Background */}
      <HeroBackground />
      
      {/* Content - Mobile optimized */}
      <div className="relative z-10 flex flex-col w-full">
        {/* Hero Section with SEO-optimized structure */}
        <section className="flex-1 py-2 px-2 sm:px-6 lg:px-8 flex flex-col justify-start pt-16 sm:pt-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* H1 tag for primary SEO keyword */}
            <header>
              <h1 className="sr-only">Recruitment.box - Decentralized CV and Recruitment Engine for Web3 Talent</h1>
            </header>
            
            {/* Compact Hero Title - Mobile optimized */}
            <div className="mb-4 px-2 sm:px-0">
              <HeroTitle />
            </div>
            
            {/* Search functionality for talent discovery - Mobile optimized */}
            <div role="search" aria-label="Search for blockchain professionals and Web3 talent" className="mb-4 px-2 sm:px-0">
              <SearchSection />
            </div>
            
            {/* Featured content for engagement - Mobile optimized */}
            <section aria-label="Featured blockchain professionals" className="px-1 sm:px-0">
              <FeaturedProfileSection />
            </section>
          </div>
        </section>

        {/* SEO Content Section - Hidden but crawlable */}
        <section className="sr-only" aria-label="SEO content for search engines">
          <h2>Web3 Recruitment Platform Features</h2>
          <article>
            <h3>Blockchain-Verified Professional Credentials</h3>
            <p>Discover verified Web3 talent through blockchain-based credentials. Our decentralized recruitment engine validates professional experience using smart contracts and on-chain activity.</p>
          </article>
          
          <article>
            <h3>Cryptocurrency and DeFi Talent Discovery</h3>
            <p>Find experienced blockchain developers, smart contract engineers, DeFi specialists, and crypto project managers. Our platform aggregates on-chain activity to showcase real Web3 experience.</p>
          </article>
          
          <article>
            <h3>ENS Domain Professional Profiles</h3>
            <p>Search professionals by their ENS domains and Ethereum addresses. Connect with verified blockchain talent through decentralized identity systems.</p>
          </article>
          
          <article>
            <h3>Smart Contract Development Hiring</h3>
            <p>Hire Solidity developers, Rust programmers, and blockchain architects. Verify coding skills through GitHub contributions and on-chain project deployments.</p>
          </article>
        </section>

        <div className="sr-only">
          <h2>Related Keywords and Services</h2>
          <ul>
            <li>blockchain recruitment platform</li>
            <li>web3 cv generator</li>
            <li>decentralized talent marketplace</li>
            <li>ethereum hiring solutions</li>
            <li>cryptocurrency job board</li>
            <li>smart contract developer hiring</li>
            <li>defi talent acquisition</li>
            <li>nft project recruitment</li>
            <li>dao contributor discovery</li>
            <li>web3 professional verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
