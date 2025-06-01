
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroTitle: React.FC = () => {
  return (
    <div className="text-center">
      <p className="text-lg md:text-xl text-slate-300 mb-4">
        Decentralized CV & Recruitment Engine
      </p>
      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
        Powered by Blockchain Technology
      </Badge>
    </div>
  );
};

export default HeroTitle;
