
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroTitle: React.FC = () => {
  return (
    <div className="text-center">
      <Badge variant="secondary" className="mb-6 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 shadow-lg shadow-cyan-500/25 animate-pulse">
        🚀 Next-Gen Recruitment Protocol
      </Badge>
      
      <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-8 relative">
        <span className="relative z-10">Find Talent on the</span>
        <br />
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse relative z-10">
          Blockchain
        </span>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-3xl animate-pulse"></div>
      </h1>
      
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
        <span className="text-cyan-300">Recruitment.box</span> is the first{' '}
        <span className="text-purple-300 font-semibold">decentralized CV & recruitment engine</span>.
        <br />
        Discover verified Web3 talent with{' '}
        <span className="text-blue-300">blockchain-verified credentials</span>.
      </p>
    </div>
  );
};

export default HeroTitle;
