
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getThreatColor } from './utils/scoreUtils';
import { TrendingUp, Info } from 'lucide-react';
import type { WebacyData, ScoreBadgeProps } from './types';

interface SecurityScoreBadgeProps extends ScoreBadgeProps {
  webacyData: WebacyData | null;
}

const SecurityScoreBadge: React.FC<SecurityScoreBadgeProps> = ({ webacyData, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-green-300/20 to-green-100/10 h-full">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-gray-700">Risk Score</h3>
          <div className={`text-3xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
            {webacyData?.riskScore !== undefined ? webacyData.riskScore : 'N/A'}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>View Risk History</span>
            <Info className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreBadge;
