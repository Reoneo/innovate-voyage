import React from 'react';
import { Badge } from '@/components/ui/badge';
const HeroTitle: React.FC = () => {
  return <div className="text-center">
      
      
      {/* Logo Section */}
      <div className="mb-8 flex justify-center">
        <img src="/lovable-uploads/a076c050-83c6-41d1-9b4b-0c28b0dd9531.png" alt="Recruitment.box Logo" className="h-24 w-24 object-contain drop-shadow-lg" />
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
        Find Talent on the
        <br />
        <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
          Blockchain
        </span>
      </h1>
      
      <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
        <span className="text-blue-300 font-medium">Recruitment.box</span> is a{' '}
        <span className="text-slate-200 font-medium">decentralized CV & recruitment engine</span>.
        <br />
        Discover verified Web3 talent with blockchain-verified credentials.
      </p>
    </div>;
};
export default HeroTitle;