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
  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return <div onClick={handleClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-900 to-black h-full rounded-2xl shadow-lg border border-gray-800 px-0 py-[12px]">
        <div className="flex items-center justify-center w-full">
          <div className="text-white text-lg font-semibold mx-[10px]">Builder Score</div>
        </div>
        <div className="text-center w-full">
          <div className="text-4xl font-bold text-white mb-1">{score || 'N/A'}</div>
          <p className="text-sm text-gray-300">
            {score ? getBuilderTitle(score) : 'Unknown Level'}
          </p>
        </div>
      </div>
    </div>;
};
export default TalentScoreBadge;