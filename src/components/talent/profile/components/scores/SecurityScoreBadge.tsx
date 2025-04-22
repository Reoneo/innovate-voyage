
import React from 'react';
import { ShieldAlert, Skeleton } from 'lucide-react';
import { getThreatColor } from './utils/scoreUtils';
import type { WebacyData, ScoreBadgeProps } from './types';

interface SecurityScoreBadgeProps extends ScoreBadgeProps {
  webacyData: WebacyData | null;
}

const SecurityScoreBadge: React.FC<SecurityScoreBadgeProps> = ({ webacyData, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-green-300/20 to-green-100/10">
        <ShieldAlert className={`h-8 w-8 ${getThreatColor(webacyData?.threatLevel)}`} />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Security Score</h3>
          <div className={`text-3xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
            {webacyData?.threatLevel || 'N/A'}
          </div>
          <p className="text-sm text-gray-600">
            Risk Score: {webacyData?.riskScore ?? 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreBadge;
