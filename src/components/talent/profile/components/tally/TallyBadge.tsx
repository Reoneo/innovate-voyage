
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from '../scores/types';
import { TallyData } from '@/types/tally';

interface TallyBadgeProps extends ScoreBadgeProps {
  walletAddress: string;
  tallyData?: TallyData | null;
}

const TallyBadge: React.FC<TallyBadgeProps> = ({ walletAddress, onClick, isLoading, tallyData }) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-purple-400/20 to-purple-100/10 h-full">
        <div className="text-center relative flex-grow flex flex-col items-center justify-center w-full">
          <div className="relative mb-2">
            <img 
              src="https://assets.tally.xyz/tally-logo.svg" 
              alt="Tally" 
              className="h-14 w-14"
            />
          </div>
          <p className="text-sm font-medium text-gray-800 mb-1">
            {tallyData?.governorInfo.name || 'Governance'}
          </p>
          <p className="text-xs text-gray-600">
            {tallyData?.votingInfo.votingPower ? 
              `${tallyData.votingInfo.votingPower} voting power` : 
              'View your governance data'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TallyBadge;
