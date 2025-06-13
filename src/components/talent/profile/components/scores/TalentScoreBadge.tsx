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
      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-900 to-black h-full shadow-lg border border-gray-800 my-0 mx-0 px-px py-[8px] rounded-sm">
        <div className="flex items-center justify-center w-full gap-2">
          
          
        </div>
        <div className="text-center w-full">
          <div className="text-4xl font-bold text-white mb-1 my-0">{score || 'N/A'}</div>
          <p className="text-gray-300 py-0 font-normal text-sm">
            {score ? getBuilderTitle(score) : 'Unknown Level'}
          </p>
        </div>
      </div>
    </div>;
};
export default TalentScoreBadge;