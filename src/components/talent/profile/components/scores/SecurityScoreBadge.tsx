import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getThreatColor } from './utils/scoreUtils';
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
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
  const formattedScore = webacyData?.riskScore !== undefined ? Math.round(webacyData.riskScore) : 'N/A';
  return <div onClick={onClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 h-32 shadow-lg border border-green-200 px-0 py-3">
        <div className="text-center space-y-2 w-full">
          <div className="text-sm font-semibold text-gray-800">
            Risk Score: {formattedScore}
          </div>
          <div className="flex items-center justify-center">
            <img src="https://img.cryptorank.io/coins/webacy1675847088001.png" alt="Webacy Logo" className="h-8 w-8" />
          </div>
          
        </div>
      </div>
    </div>;
};
export default SecurityScoreBadge;