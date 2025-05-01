
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from '../scores/types';

interface TallyBadgeProps extends ScoreBadgeProps {
  walletAddress: string;
}

const TallyBadge: React.FC<TallyBadgeProps> = ({ walletAddress, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-yellow-300/20 to-yellow-100/10 h-full">
        <div className="text-center relative flex-grow flex flex-col items-center justify-center w-full">
          <div className="relative">
            <img 
              src="https://cdn-icons-png.freepik.com/512/7554/7554364.png" 
              alt="Tally DAO" 
              className="h-32 w-32 mb-2"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">Tally DAO</p>
        </div>
      </div>
    </div>
  );
};

export default TallyBadge;
