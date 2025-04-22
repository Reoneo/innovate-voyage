
import React from 'react';
import { Star, Skeleton } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getBuilderTitle } from './utils/scoreUtils';
import { ScoreBadgeProps } from './types';

interface TalentScoreBadgeProps extends ScoreBadgeProps {
  score: number | null;
}

const TalentScoreBadge: React.FC<TalentScoreBadgeProps> = ({ score, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-yellow-300/20 to-yellow-100/10">
        <Star className="h-8 w-8 text-yellow-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-yellow-700">Talent Score</h3>
          <div className="text-3xl font-bold text-yellow-600">{score || 'N/A'}</div>
          <p className="text-sm text-yellow-600/80">
            {score ? getBuilderTitle(score) : 'Unknown Level'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TalentScoreBadge;
