
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

const TestNetIcon: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 z-20">
      <Badge variant="outline" className="bg-orange-100 border-orange-300 text-orange-700 font-medium">
        <Zap className="w-3 h-3 mr-1" />
        TestNet
      </Badge>
    </div>
  );
};

export default TestNetIcon;
