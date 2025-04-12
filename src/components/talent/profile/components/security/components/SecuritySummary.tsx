
import React from 'react';
import { Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ThreatLevel } from '../hooks/useWebacyData';
import { getThreatBgColor, getThreatDescription } from '../utils/securityUtils';

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
    <div 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-green-300 to-green-100 cursor-pointer transition-all hover:opacity-80"
    >
      <h3 className="text-lg font-semibold text-green-900">Threat Level</h3>
      <div className={`text-4xl font-bold px-4 py-2 rounded-md ${getThreatBgColor(threatLevel)}`}>
        {threatLevel || 'UNKNOWN'}
      </div>
      <p className="text-sm text-center text-green-800">
        {getThreatDescription(threatLevel)}
      </p>
    </div>
  );
};

export default SecuritySummary;
