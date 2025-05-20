
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getBuilderTitle } from './utils/scoreUtils';
import { ScoreBadgeProps } from './types';

interface TalentScoreBadgeProps extends ScoreBadgeProps {
  score: number | null;
  talentId?: string;
}

const TalentScoreBadge: React.FC<TalentScoreBadgeProps> = ({
  score,
  onClick,
  isLoading,
  talentId
}) => {
  // Use a simple div instead of skeleton for faster rendering
  if (isLoading) {
    return (
      <div className="h-28 w-full bg-gray-100 rounded-md animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }
  
  // Return a simple div when clicked rather than making it a button
  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 bg-black h-full px-0 rounded-full py-[21px]">
        <div className="flex items-center justify-center w-full">
          <div className="text-white text-lg font-semibold">Builder Score</div>
        </div>
        <div className="text-center w-full mt-2">
          <div className="text-3xl font-bold text-white">{score || 'N/A'}</div>
          <p className="text-sm text-white/80">
            {score ? getBuilderTitle(score) : 'Unknown Level'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TalentScoreBadge;
