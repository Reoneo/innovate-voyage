
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getThreatColor } from './utils/scoreUtils';
import { Shield, Info } from 'lucide-react';
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
          <div className="flex items-center justify-center gap-2">
            <img 
              src="https://img.cryptorank.io/coins/webacy1675847088001.png" 
              alt="Webacy Logo" 
              className="h-6 w-6"
            />
            <h3 className="text-lg font-semibold text-gray-700">Risk Score</h3>
          </div>
          <div className={`text-3xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
            {webacyData?.riskScore !== undefined ? webacyData.riskScore : 'N/A'}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>View Security Details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreBadge;
