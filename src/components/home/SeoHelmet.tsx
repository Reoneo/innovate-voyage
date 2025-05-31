
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHelmet: React.FC = () => {
  return (
    <Helmet>
      {/* Primary SEO Meta Tags */}
      <title>Recruitment.box | #1 Decentralized CV & Web3 Recruitment Engine | Blockchain Talent Discovery</title>
      <meta name="description" content="🚀 Find & hire verified Web3 talent with blockchain credentials. Recruitment.box offers decentralized CV generation, smart contract developer hiring, DeFi talent discovery & crypto recruitment solutions. Join 10,000+ Web3 professionals today!" />
      <meta name="keywords" content="blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, blockchain verification, crypto recruitment, web3 jobs, ens profiles, decentralized hiring, blockchain cv, web3 talent, crypto jobs, ethereum recruitment, blockchain jobs, web3 hiring platform, recruitment.box, decentralized recruitment engine, smart contract developers, defi talent, dao recruitment, nft project hiring, solidity developers, cryptocurrency jobs, blockchain careers, web3 professionals, ethereum developers, crypto talent marketplace" />
      
      {/* Enhanced Open Graph Meta Tags */}
      <meta property="og:title" content="Recruitment.box | #1 Decentralized CV & Web3 Recruitment Engine" />
      <meta property="og:description" content="🔥 Discover & hire verified Web3 talent with blockchain-verified credentials. Revolutionary decentralized recruitment platform for crypto companies & professionals. 10,000+ verified profiles!" />
      <meta property="og:image" content="https://recruitment.box/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Recruitment.box - Decentralized Web3 Recruitment Platform" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://recruitment.box" />
      <meta property="og:site_name" content="Recruitment.box" />
      <meta property="og:locale" content="en_US" />
      
      {/* Enhanced Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@recruitment_box" />
      <meta name="twitter:creator" content="@recruitment_box" />
      <meta name="twitter:title" content="Recruitment.box | #1 Decentralized CV & Web3 Recruitment Engine" />
      <meta name="twitter:description" content="🚀 Find & hire verified Web3 talent with blockchain credentials. Revolutionary decentralized recruitment for crypto companies. Join 10,000+ Web3 professionals!" />
      <meta name="twitter:image" content="https://recruitment.box/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      <meta name="twitter:image:alt" content="Recruitment.box - Web3 Talent Discovery Platform" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Recruitment.box Team" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://recruitment.box" />
      
      {/* Alternate Languages (for future internationalization) */}
      <link rel="alternate" hrefLang="en" href="https://recruitment.box" />
      <link rel="alternate" hrefLang="x-default" href="https://recruitment.box" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/png" href="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      <link rel="apple-touch-icon" href="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      
      {/* Theme Color for Mobile Browsers */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Schema.org JSON-LD for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Recruitment.box",
          "alternateName": "Web3 Recruitment Platform",
          "url": "https://recruitment.box",
          "logo": "https://recruitment.box/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png",
          "description": "Leading decentralized recruitment platform for Web3 talent discovery and blockchain-verified professional credentials",
          "foundingDate": "2024",
          "industry": "Human Resources Technology",
          "sameAs": [
            "https://twitter.com/recruitment_box",
            "https://github.com/recruitment-box",
            "https://linkedin.com/company/recruitment-box"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://recruitment.box"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SeoHelmet;
