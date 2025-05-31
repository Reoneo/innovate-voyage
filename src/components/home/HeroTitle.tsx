
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroTitle: React.FC = () => {
  return (
    <div className="text-center">
      {/* Logo Section */}
      <div className="mb-8 flex justify-center">
        <img src="/lovable-uploads/45686091-6e2c-40f6-b4ee-fab6cb6b13ee.png" alt="Recruitment.box Logo" className="h-48 w-48 object-contain drop-shadow-lg" />
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
        Blockchain 
        <br />
        <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
          Talent & Careers
        </span>
      </h1>
    </div>
  );
};

export default HeroTitle;
