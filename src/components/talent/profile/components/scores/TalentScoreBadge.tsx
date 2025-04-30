
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
        <div className="flex items-center justify-start w-full">
          <div className="text-white text-lg font-semibold mr-3">Builder Score</div>
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img 
              src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1746064800000&signature=NrmlObpAbCJOzeEZfVJ7zb-a2H4jiI9HQ1OcbvA6ckY&downloadName=logomark_dark.jpg" 
              alt="Builder Score" 
              className="h-full w-full object-cover"
            />
          </div>
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
