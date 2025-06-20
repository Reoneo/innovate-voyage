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
  return <div onClick={onClick} className="cursor-pointer group transition-transform duration-200">
      
    </div>;
};
export default SecurityScoreBadge;