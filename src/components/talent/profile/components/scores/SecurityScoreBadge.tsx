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
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
  const formattedScore = webacyData?.riskScore !== undefined ? Math.round(webacyData.riskScore) : 'N/A';
  return <div onClick={onClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 h-full shadow-lg border border-green-200 px-0 py-[12px]">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            
            <h3 className="text-lg font-semibold text-gray-800">Risk Score</h3>
          </div>
          <div className={`text-4xl font-bold mb-1 ${getThreatColor(webacyData?.threatLevel)}`}>
            {formattedScore}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            
            
          </div>
        </div>
      </div>
    </div>;
};
export default SecurityScoreBadge;