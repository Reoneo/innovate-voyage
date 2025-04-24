
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getThreatColor } from './utils/scoreUtils';
import type { WebacyData, ScoreBadgeProps } from './types';

interface SecurityScoreBadgeProps extends ScoreBadgeProps {
  webacyData: WebacyData | null;
}

const SecurityScoreBadge: React.FC<SecurityScoreBadgeProps> = ({ webacyData, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-6 rounded-lg bg-gradient-to-r from-green-300/20 to-green-100/10 h-full">
        <img 
          src="https://img.cryptorank.io/coins/webacy1675847088001.png" 
          alt="Webacy" 
          className="h-8 w-8 rounded-full" 
        />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Risk Score</h3>
          <div className={`text-3xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
            {webacyData?.riskScore !== undefined ? webacyData.riskScore : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreBadge;
