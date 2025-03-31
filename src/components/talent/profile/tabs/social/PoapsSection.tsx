
import React from 'react';
import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PoapsProps {
  poaps?: Array<{
    id: string;
    name: string;
    image_url: string;
    created_date?: string;
    description?: string;
    event?: string;
  }>;
}

const PoapsSection: React.FC<PoapsProps> = ({ poaps = [] }) => {
  if (!poaps || poaps.length === 0) {
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
          <Award className="h-4 w-4" /> 
          POAPs
        </h4>
        <p className="text-sm text-muted-foreground">No POAPs found</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
        <Award className="h-4 w-4" /> 
        POAPs
      </h4>
      <div className="flex flex-wrap gap-2">
        {poaps.map((poap) => (
          <div 
            key={poap.id}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border mb-1">
              <img 
                src={poap.image_url} 
                alt={poap.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <Badge variant="outline" className="text-xs">
              {poap.name}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoapsSection;
