
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TallyBadgeProps } from '../scores/types';

const TallyBadge: React.FC<TallyBadgeProps> = ({ walletAddress, onClick, loading }) => {
  if (loading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div 
      onClick={onClick} 
      className="cursor-pointer transition-all hover:opacity-80 p-4 rounded-lg bg-white shadow-md border border-gray-200"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img 
            src="https://cdn-icons-png.freepik.com/512/7554/7554364.png" 
            alt="Tally DAO" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Tally DAO</h3>
          <p className="text-sm text-muted-foreground">
            DAO governance insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default TallyBadge;
