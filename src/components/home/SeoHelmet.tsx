
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHelmet: React.FC = () => {
  return (
    <Helmet>
      <title>Tokenized WEB2 & WEB3 Domain NFT Naming Service</title>
      <meta name="description" content="Smith.box offers tokenized WEB2 & WEB3 domain NFT naming." />
      <meta name="keywords" content="blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, blockchain verification, tokenized domains, NFT naming" />
      <meta property="og:title" content="Tokenized WEB2 & WEB3 Domain NFT Naming Service" />
      <meta property="og:description" content="Smith.box offers tokenized WEB2 & WEB3 domain NFT naming." />
      <meta property="og:image" content="https://i.imgur.com/ngwLlPH.jpeg" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Tokenized WEB2 & WEB3 Domain NFT Naming Service" />
      <meta name="twitter:description" content="Smith.box offers tokenized WEB2 & WEB3 domain NFT naming." />
      <meta name="twitter:image" content="https://i.imgur.com/ngwLlPH.jpeg" />
      <link rel="canonical" href="https://smith.box" />
    </Helmet>
  );
};

export default SeoHelmet;
