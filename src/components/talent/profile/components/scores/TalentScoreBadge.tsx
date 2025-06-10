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
        <div className="flex items-center justify-center w-full gap-2">
          <img alt="Talent Protocol" className="h-6 w-6" src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/fb53644d-903e-4508-8f0d-1370a6dd413f/Logo_BuilderScore_dark.jpg?table=block&id=739b3671-3897-4856-868d-eb365612ce70&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749578400000&signature=Qs1LFrCcyD8av0rqIwoI5aiZzx7xC6GeEaoPqUN9BmY&downloadName=Logo_BuilderScore_dark.jpg" />
          <div className="text-white text-lg font-semibold">Builder Score</div>
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