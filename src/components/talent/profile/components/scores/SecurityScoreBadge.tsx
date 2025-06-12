import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getThreatColor } from './utils/scoreUtils';
import { Shield } from 'lucide-react';
import type { WebacyData, ScoreBadgeProps } from './types';
interface SecurityScoreBadgeProps extends ScoreBadgeProps {
  webacyData: WebacyData | null;
}
const SecurityScoreBadge: React.FC<SecurityScoreBadgeProps> = ({
  webacyData,
  onClick,
  isLoading
}) => {
  if (isLoading) {
    return <Skeleton className="h-16 w-full rounded-lg" />;
  }
  const riskPercentage = webacyData?.riskScore !== undefined ? `${Math.round(webacyData.riskScore)}%` : '0%';
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return <div onClick={handleClick} className="cursor-pointer">
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 my-[3px]">
        <div className="flex-shrink-0">
          
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">Risk</div>
          <div className={`text-xs ${getThreatColor(webacyData?.threatLevel)} truncate`}>
            {riskPercentage}
          </div>
        </div>
      </div>
    </div>;
};
export default SecurityScoreBadge;