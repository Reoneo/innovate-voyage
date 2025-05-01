
import React from 'react';
import FloatingLogo from './FloatingLogo';

const logoUrls = [
  "https://altcoinsbox.com/wp-content/uploads/2023/04/full-ethereum-name-service-logo.png",
  "https://web3.bio/web3bio-logo.png",
  "https://cdn.publish0x.com/prod/fs/cachedimages/230573382-6a4061168e36bfea7f9ff3375f58f4f0e97b5d13f5c05413a12b04e7ba76270c.png",
  "https://etherscan.io/images/brandassets/etherscan-logo.svg"
];

const PoweredBySection: React.FC = () => {
  return (
    <div className="text-center mb-16 relative overflow-hidden">
      <h2 className="text-3xl font-bold mb-4">Powered by</h2>
      
      <div className="h-20 w-full relative mb-6">
        {logoUrls.map((url, index) => (
          <FloatingLogo 
            key={index} 
            imageUrl={url} 
            index={index} 
            totalLogos={logoUrls.length} 
          />
        ))}
      </div>
    </div>
  );
};

export default PoweredBySection;
