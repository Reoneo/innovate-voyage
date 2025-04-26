
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getBuilderTitle } from './utils/scoreUtils';
import { ScoreBadgeProps } from './types';

interface TalentScoreBadgeProps extends ScoreBadgeProps {
  score: number | null;
  talentId?: string;
}

const TalentScoreBadge: React.FC<TalentScoreBadgeProps> = ({ score, onClick, isLoading, talentId }) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    // Open Talent Protocol in new tab if talentId is provided
    if (talentId) {
      window.open(`https://app.talentprotocol.com/${talentId}`, '_blank');
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-black h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">Talent Score</h3>
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
