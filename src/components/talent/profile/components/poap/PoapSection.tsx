
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PoapCard from './PoapCard';

interface POAP {
  id: string;
  name: string;
  description: string;
  image: string;
  event: {
    start_date: string;
    end_date: string;
    country?: string;
    city?: string;
  };
}

interface PoapSectionProps {
  poaps: POAP[];
  isLoading?: boolean;
}

const PoapSection: React.FC<PoapSectionProps> = ({ poaps = [], isLoading = false }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Proof of Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg aspect-square" />
            ))}
          </div>
        ) : poaps && poaps.length > 0 ? (
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2">
            {poaps.map((poap) => (
              <PoapCard key={poap.id} poap={poap} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No POAPs found</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PoapSection;
