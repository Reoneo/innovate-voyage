
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
  
  // Risk color based on score (0 = green, 100 = red)
  const getRiskColor = (score?: number) => {
    if (score === undefined || score === null) return 'bg-gray-200 text-gray-700';
    
    // Calculate a color gradient from green to red
    if (score <= 10) return 'bg-green-500 text-white';
    if (score <= 30) return 'bg-green-400 text-white';
    if (score <= 50) return 'bg-yellow-400 text-white';
    if (score <= 70) return 'bg-orange-400 text-white';
    if (score <= 90) return 'bg-red-400 text-white';
    return 'bg-red-600 text-white';
  };

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
          <div className={`text-3xl font-bold px-3 py-1 rounded ${getRiskColor(webacyData?.riskScore)}`}>
            {webacyData?.riskScore !== undefined ? webacyData.riskScore : 'N/A'}
          </div>
          <p className="text-sm text-gray-600">
            {webacyData?.threatLevel || 'Unknown Level'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreBadge;
