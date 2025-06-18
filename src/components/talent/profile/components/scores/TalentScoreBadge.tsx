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
  return <div onClick={handleClick} className="cursor-pointer group transition-transform duration-200">
      <div className="flex flex-col items-center gap-2 p-6 bg-white/95 shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 w-full min-h-[120px] transition-all my-0 rounded-sm">
        <div className="text-center w-full">
          <div className="text-4xl font-bold text-primary mb-2 group-hover:text-purple-600 transition-colors">
            {score ?? 'N/A'}
          </div>
          <p className="text-gray-500 font-medium text-sm">
            {score ? getBuilderTitle(score) : 'Unknown Level'}
          </p>
        </div>
      </div>
    </div>;
};
export default TalentScoreBadge;