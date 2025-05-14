
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { WebacyData } from '../../scores/types';

interface ThreatLevelCardProps {
  securityData: WebacyData | null;
  isLoading: boolean;
}

const ThreatLevelCard: React.FC<ThreatLevelCardProps> = ({ securityData, isLoading }) => {
  const getThreatBgColor = (level?: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'HIGH': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getThreatDescription = (level?: string) => {
    switch (level) {
      case 'LOW': return 'This wallet is safe and poses low to no risk to others.';
      case 'MEDIUM': return 'This wallet has some suspicious activity and poses a moderate risk.';
      case 'HIGH': return 'This wallet has highly suspicious activity and poses a significant risk.';
      default: return 'Unable to determine the security level of this wallet.';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-100">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-5 w-48" />
      </div>
    );
  }

  return (
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
        <div className={`text-3xl font-bold ${getThreatBgColor(securityData?.threatLevel)}`}>
          {securityData?.threatLevel || 'UNKNOWN'}
        </div>
        <p className="text-sm text-center text-green-800">
          {getThreatDescription(securityData?.threatLevel)}
        </p>
      </div>
    </div>
  );
};

export default ThreatLevelCard;
