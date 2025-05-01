
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHelmet: React.FC = () => {
  return (
    <Helmet>
      <title>Recruitment.box | Decentralized CV & Recruitment Engine</title>
      <meta name="description" content="A decentralized CV & recruitment engine powered by blockchain data. Find talent, verify skills, and connect with professionals in Web3." />
      <meta name="keywords" content="blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, blockchain verification" />
      <meta property="og:title" content="Recruitment.box | Decentralized CV & Recruitment Engine" />
      <meta property="og:description" content="A decentralized CV & recruitment engine powered by blockchain data. Find talent, verify skills, and connect with professionals in Web3." />
      <meta property="og:image" content="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Recruitment.box | Decentralized CV & Recruitment Engine" />
      <meta name="twitter:description" content="A decentralized CV & recruitment engine powered by blockchain data. Find talent, verify skills, and connect with professionals in Web3." />
      <meta name="twitter:image" content="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
      <link rel="canonical" href="https://recruitment.box" />
    </Helmet>
  );
};

export default SeoHelmet;
