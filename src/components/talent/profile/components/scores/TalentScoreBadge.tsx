
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';

interface TalentScoreBadgeProps extends ScoreBadgeProps {
  score: number | null;
  talentId: string;
}
const TalentScoreBadge: React.FC<TalentScoreBadgeProps> = ({
  score,
  onClick,
  isLoading
}) => {
  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-2xl" />;
  }
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full h-24 rounded-2xl bg-transparent transition-all p-0 border-0 outline-none gap-2 hover:bg-gray-50"
      style={{ minWidth: 0 }}
      type="button"
    >
      <div className="text-lg font-semibold text-gray-900 mb-1">Builder Score</div>
      <div className="text-2xl font-bold text-blue-700">{score !== null && score !== undefined ? score : '--'}</div>
      <div className="text-xs text-gray-600 -mt-1">Talent</div>
    </button>
  );
};
export default TalentScoreBadge;
