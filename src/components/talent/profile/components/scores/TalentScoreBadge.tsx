
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
    return <Skeleton className="h-16 w-full rounded-2xl" />;
  }
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full h-32 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-xl hover:bg-gray-50 focus:outline-none gap-2"
      style={{ minWidth: 0 }}
    >
      <div className="text-lg font-semibold text-gray-900">Builder Score</div>
      <div className="text-3xl font-bold text-blue-700">{score !== null && score !== undefined ? score : '--'}</div>
      <div className="text-xs text-gray-600">Talent</div>
    </button>
  );
};
export default TalentScoreBadge;
