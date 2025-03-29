
import React from 'react';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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

const TalentGrid: React.FC<TalentGridProps> = ({ isLoading, passportData }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-muted/60">
            <div className="p-4 pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
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
      <div className="flex flex-col items-center justify-center p-12 text-center border border-muted/50 rounded-xl bg-muted/10">
        <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-2xl font-medium mb-2">No profiles found</h3>
        <p className="text-muted-foreground max-w-md">
          Try searching for a Web3 identity using an ENS name (.eth or .box domain) or Ethereum wallet address
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
