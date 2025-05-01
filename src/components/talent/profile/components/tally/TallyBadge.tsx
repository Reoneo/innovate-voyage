
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from '../scores/types';
import { useTallyData } from '@/hooks/useTallyData';

interface TallyBadgeProps extends ScoreBadgeProps {
  walletAddress: string;
}

const TallyBadge: React.FC<TallyBadgeProps> = ({ walletAddress, onClick, isLoading: propIsLoading }) => {
  const { tallyData, isLoading: hookIsLoading } = useTallyData(walletAddress);
  const isLoading = propIsLoading || hookIsLoading;

  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-yellow-300/20 to-yellow-100/10 h-full">
        <div className="text-center relative flex-grow flex flex-col items-center justify-center w-full">
          <div className="relative">
            <img 
              src={tallyData?.daoIcon || "/placeholder.svg"} 
              alt="Tally DAO" 
              className="h-16 w-16 mb-2 object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <p className="text-sm font-medium">{tallyData?.daoName || "Tally DAO"}</p>
          {tallyData && (
            <p className="text-xs text-gray-500">
              {tallyData.votingPower ? `Voting Power: ${tallyData.votingPower}` : "No voting power"}
            </p>
          )}
          {!tallyData && (
            <p className="text-xs text-gray-500">View DAO participation</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TallyBadge;
