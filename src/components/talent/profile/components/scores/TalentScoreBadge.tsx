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
      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-900 to-black h-full rounded-2xl shadow-lg border border-gray-800 px-0 py-[10px]">
        <div className="flex items-center justify-center w-full">
          <img alt="Talent Protocol" className="h-8 w-8 object-contain filter brightness-0 invert" src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749232800000&signature=Z8ASIkHi091SbRTNk9aH4V9qa0H34hecpLNXcQ1eR9Q&downloadName=logomark_dark.jpg" />
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