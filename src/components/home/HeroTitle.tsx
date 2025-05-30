
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroTitle: React.FC = () => {
  return (
    <div className="text-center">
      <Badge variant="secondary" className="mb-6 px-4 py-2 bg-slate-800/80 text-slate-300 border-slate-600/50">
        🚀 Professional Recruitment Platform
      </Badge>
      
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
        Find Talent on the
        <br />
        <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
          Blockchain
        </span>
      </h1>
      
      <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
        <span className="text-blue-300 font-medium">Recruitment.box</span> is the first{' '}
        <span className="text-slate-200 font-medium">decentralized CV & recruitment engine</span>.
        <br />
        Discover verified Web3 talent with blockchain-verified credentials.
      </p>
    </div>
  );
};

export default HeroTitle;
