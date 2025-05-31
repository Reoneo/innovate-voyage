
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHelmet: React.FC = () => {
  return (
    <Helmet>
      <title>Recruitment.box | Decentralized CV & Recruitment Engine</title>
      <meta name="description" content="Recruitment.box offers Web3 recruitment services, blockchain-verified CVs, decentralized hiring platform, and crypto talent discovery for Web3 companies and professionals." />
      <meta name="keywords" content="blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, blockchain verification, crypto recruitment, web3 jobs, ens profiles, decentralized hiring, blockchain cv, web3 talent, crypto jobs, ethereum recruitment, blockchain jobs, web3 hiring platform, recruitment.box, decentralized recruitment engine" />
      <meta property="og:title" content="Recruitment.box | Decentralized CV & Recruitment Engine" />
      <meta property="og:description" content="Find talent on the blockchain with our decentralized CV & recruitment engine. Verify skills, connect with Web3 professionals, and hire with confidence using blockchain-verified credentials." />
      <meta property="og:image" content="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Recruitment.box | Decentralized CV & Recruitment Engine" />
      <meta name="twitter:description" content="Find talent on the blockchain with our decentralized CV & recruitment engine. Verify skills, connect with Web3 professionals, and hire with confidence." />
      <meta name="twitter:image" content="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      <link rel="canonical" href="https://recruitment.box" />
    </Helmet>
  );
};

export default SeoHelmet;
