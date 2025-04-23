
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getBuilderTitle } from './utils/scoreUtils';
import { ScoreBadgeProps } from './types';

interface TalentScoreBadgeProps extends ScoreBadgeProps {
  score: number | null;
}

const TalentScoreBadge: React.FC<TalentScoreBadgeProps> = ({ score, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-6 rounded-lg bg-black h-full">
        <img 
          src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1745424000000&signature=pukHgWBup44dUkcNvZ3kNuSwwsHf8sh8vHkObZqgaNA&downloadName=logomark_dark.jpg" 
          alt="Talent Protocol" 
          className="h-8 w-8 rounded-full" 
        />
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
