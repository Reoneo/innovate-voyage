
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Github } from 'lucide-react';
import { ScoreBadgeProps } from './types';

interface GitHubActivityBadgeProps extends ScoreBadgeProps {
  username: string;
}

const GitHubActivityBadge: React.FC<GitHubActivityBadgeProps> = ({
  username,
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
    <div onClick={handleClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-50 to-gray-100 h-full rounded-2xl shadow-lg border border-gray-200">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Github className="h-6 w-6 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-800">GitHub Activity</h3>
          </div>
          <div className="text-sm text-gray-600">
            <div>@{username}</div>
            <div className="mt-1">View Contributions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubActivityBadge;
