
import React from 'react';

const logos = [
  { src: "https://altcoinsbox.com/wp-content/uploads/2023/04/full-ethereum-name-service-logo.png", alt: "Ethereum Name Service" },
  { src: "https://web3.bio/web3bio-logo.png", alt: "Web3.bio" },
  { src: "https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/7c844b24-d8f5-417f-accb-574c88b75e26/Logo_TalentProtocol.jpg?table=block&id=507f9f8e-04b7-478b-8a33-8900e4838847&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1743948000000&signature=gk2ASkxTsqSqmE_gIMWkAlMMZ3Fdo1YOD9Smt-okG6s&downloadName=Logo_TalentProtocol.jpg", alt: "Talent Protocol" },
  { src: "https://etherscan.io/images/brandassets/etherscan-logo.svg", alt: "Etherscan" }
];

const PoweredBySection: React.FC = () => {
  return (
    <div className="w-full py-10 overflow-hidden bg-white">
      <div className="container mx-auto mb-4 text-center">
        <h2 className="text-2xl font-bold">Powered By</h2>
      </div>
      
      <div className="relative w-full overflow-hidden">
        <div className="flex logo-scroll">
          {/* Double the logos to create seamless scrolling effect */}
          {[...logos, ...logos].map((logo, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 transition-all duration-300"
              style={{ minWidth: '120px', height: '60px' }}
            >
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className="h-full object-contain logo-pause"
              />
            </div>
          ))}
        </div>
        
        <style>
          {`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            
            .logo-scroll {
              animation: scroll 30s linear infinite;
            }
            
            .logo-scroll:hover {
              animation-play-state: paused;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PoweredBySection;
