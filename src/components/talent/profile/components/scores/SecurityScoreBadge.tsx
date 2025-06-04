
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

  const formattedScore = webacyData?.riskScore !== undefined ? Math.round(webacyData.riskScore) : null;
  
  // Color coding based on risk score
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score === 0) return 'text-green-600';
    if (score <= 30) return 'text-yellow-600';
    if (score <= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBgGradient = (score: number | null) => {
    if (score === null) return 'from-gray-50 to-gray-100';
    if (score === 0) return 'from-green-50 to-green-100';
    if (score <= 30) return 'from-yellow-50 to-yellow-100';
    if (score <= 70) return 'from-orange-50 to-orange-100';
    return 'from-red-50 to-red-100';
  };

  const getBorderColor = (score: number | null) => {
    if (score === null) return 'border-gray-200';
    if (score === 0) return 'border-green-200';
    if (score <= 30) return 'border-yellow-200';
    if (score <= 70) return 'border-orange-200';
    return 'border-red-200';
  };

  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${getBgGradient(formattedScore)} h-32 shadow-lg border ${getBorderColor(formattedScore)} px-0 py-3`}>
        <div className="text-center space-y-2 w-full">
          <div className="text-lg font-semibold text-gray-800">
            Risk Score
          </div>
          <div className="flex items-center justify-center">
            <img src="https://img.cryptorank.io/coins/webacy1675847088001.png" alt="Webacy Logo" className="h-8 w-8" />
          </div>
          <div className={`text-lg font-bold ${getScoreColor(formattedScore)}`}>
            {formattedScore !== null ? formattedScore : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreBadge;
