
import React from 'react';
import ThreeJsBackground from './ThreeJsBackground';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {/* Three.js animated cube background */}
      <ThreeJsBackground />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
    </div>
  );
};

export default HeroBackground;
