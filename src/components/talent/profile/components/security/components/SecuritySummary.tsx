
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ThreatLevel } from '../hooks/useWebacyData';
import { getThreatBgColor, getThreatDescription } from '../utils/securityUtils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SecuritySummaryProps {
  isLoading: boolean;
  threatLevel?: ThreatLevel;
  onClick?: () => void;
}

const SecuritySummary: React.FC<SecuritySummaryProps> = ({ 
  isLoading, 
  threatLevel, 
  onClick 
}) => {
  console.log("SecuritySummary rendering with:", { isLoading, threatLevel });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-100">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-5 w-48" />
      </div>
    );
  }

  // Determine background gradient based on threat level
  let bgGradient = "bg-gradient-to-r from-green-300 to-green-100";
  if (threatLevel === 'MEDIUM') {
    bgGradient = "bg-gradient-to-r from-yellow-300 to-yellow-100";
  } else if (threatLevel === 'HIGH') {
    bgGradient = "bg-gradient-to-r from-red-300 to-red-100";
  } else if (!threatLevel || threatLevel === 'UNKNOWN') {
    bgGradient = "bg-gradient-to-r from-gray-300 to-gray-100";
  }

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-lg ${bgGradient} cursor-pointer transition-all hover:opacity-90 shadow-sm`}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src="https://img.cryptorank.io/coins/webacy1675847088001.png" alt="Webacy" />
          <AvatarFallback>W</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold text-gray-900">Threat Level</h3>
      </div>
      
      <div className={`text-3xl font-bold px-4 py-2 rounded-md ${getThreatBgColor(threatLevel)}`}>
        {threatLevel || 'UNKNOWN'}
      </div>
      <p className="text-sm text-center text-gray-800">
        {getThreatDescription(threatLevel)}
      </p>
    </div>
  );
};

export default SecuritySummary;
