
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield } from 'lucide-react';
import type { ScoreBadgeProps } from './types';

interface SecurityScoreBadgeProps extends ScoreBadgeProps {}

const SecurityScoreBadge: React.FC<SecurityScoreBadgeProps> = ({
  onClick,
  isLoading
}) => {
  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group transition-transform duration-200"
    >
      <div className="flex flex-col items-center gap-2 p-6 bg-white/95 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 w-full min-h-[120px] transition-all">
        <div className="flex items-center justify-center mb-2">
          <Shield className="w-7 h-7 text-gray-400 group-hover:text-purple-500 transition-colors" />
        </div>
        <div className="text-center w-full">
          <span className="text-2xl font-bold text-primary group-hover:text-purple-600 transition-colors">
            Analyze
          </span>
          <p className="text-gray-500 font-medium text-sm">
            Security Score
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreBadge;
