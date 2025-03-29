
import React from 'react';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TalentProfileCard from './TalentProfileCard';
import { BlockchainPassport } from '@/lib/utils';

interface TalentGridProps {
  isLoading: boolean;
  passportData: Array<BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
    hasMoreSkills: boolean;
  }>;
  clearFilters: () => void;
}

const TalentGrid: React.FC<TalentGridProps> = ({ isLoading, passportData, clearFilters }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4 pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (passportData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No profiles found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {passportData.map((passport) => (
        <TalentProfileCard 
          key={passport.owner_address} 
          passport={passport} 
        />
      ))}
    </div>
  );
};

export default TalentGrid;
