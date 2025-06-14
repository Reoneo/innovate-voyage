
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
  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 px-0 py-[10px] my-[2px] hover:shadow-md transition-shadow duration-200 min-h-[120px] w-full">
        <div className="text-center w-full">
          <div className="text-4xl font-bold text-gray-800 mb-1 my-0 leading-none">{score || 'N/A'}</div>
          <p className="text-gray-500 py-0 font-normal text-base">{score ? getBuilderTitle(score) : 'Unknown Level'}</p>
        </div>
      </div>
    </div>
  );
};
export default TalentScoreBadge;
