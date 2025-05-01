
import React from 'react';

interface FloatingLogoProps {
  imageUrl: string;
  index: number;
  totalLogos: number;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({ imageUrl, index, totalLogos }) => {
  const spacing = 100 / totalLogos;
  const position = spacing * index + spacing / 2;
  
  return (
    <div 
      className="absolute" 
      style={{
        left: `${position}%`, 
        transform: 'translateX(-50%)',
        top: '50%',
        marginTop: '-20px',
        zIndex: 1
      }}
    >
      <img 
        src={imageUrl} 
        alt="Web3 logo" 
        className="h-12 md:h-14 object-contain opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  );
};

export default FloatingLogo;
