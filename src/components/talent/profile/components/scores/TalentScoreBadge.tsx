
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
    return <Skeleton className="h-20 w-full rounded-lg" />;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer group transition-transform duration-200">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary group-hover:text-purple-600 transition-colors">
              {score ?? 'N/A'}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Talent Score
            </p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">
              {score ? getBuilderTitle(score) : 'Unknown Level'}
            </p>
            <p className="text-xs text-gray-500">
              Professional Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentScoreBadge;
