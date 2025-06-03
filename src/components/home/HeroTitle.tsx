import React from 'react';
import { Badge } from '@/components/ui/badge';
const HeroTitle: React.FC = () => {
  return <div className="text-center">
      {/* Logo Section - Smaller for compact view */}
      <div className="mb-4 flex justify-center">
        <img src="/lovable-uploads/ffc0e4c4-e1f3-45ef-8f61-8fbbb29803c5.png" alt="Recruitment.box Logo" className="h-32 w-32 object-contain drop-shadow-lg" />
      </div>
      
      <h1 className="md:text-5xl font-bold tracking-tight text-white mb-4 text-3xl">
        Blockchain 
        <br />
        <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
          Talent & Careers
        </span>
      </h1>
    </div>;
};
export default HeroTitle;