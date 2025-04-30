
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
          <div className="flex items-center justify-center mb-1">
            <img 
              src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/fb53644d-903e-4508-8f0d-1370a6dd413f/Logo_BuilderScore_dark.jpg?table=block&id=739b3671-3897-4856-868d-eb365612ce70&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1746036000000&signature=s3FclHLaOXqcajs0CEedyhwMIWDp-mg3IZLFcYV_mGQ&downloadName=Logo_BuilderScore_dark.jpg" 
              alt="Builder Score" 
              className="h-36" // Changed from h-18 to h-36 (2x larger)
            />
          </div>
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
