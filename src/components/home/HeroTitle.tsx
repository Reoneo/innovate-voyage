
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroTitle: React.FC = () => {
  return (
    <div className="text-center">
      <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
        🚀 The Future of Recruitment
      </Badge>
      
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
        Find Talent on the
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Blockchain</span>
      </h1>
      
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
        Recruitment.box is the first decentralized CV & recruitment engine. 
        Discover verified Web3 talent, post jobs, and hire with confidence using blockchain-verified credentials.
      </p>
    </div>
  );
};

export default HeroTitle;
