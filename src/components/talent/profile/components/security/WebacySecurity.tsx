
import React from 'react';
import { useWebacyData } from '@/hooks/useWebacyData';
import SecuritySummary from './SecuritySummary';
import { Loader2 } from 'lucide-react';

interface WebacySecurityProps {
  walletAddress: string;
}

const WebacySecurity: React.FC<WebacySecurityProps> = ({ walletAddress }) => {
  const { loading, error, securityScore } = useWebacyData(walletAddress);

  return (
    <div className="w-full mt-6">
      <h3 className="flex items-center justify-center gap-2 text-xl font-medium mb-4">
        <img
          src="https://img.cryptorank.io/coins/webacy1675847088001.png"
          alt="Webacy"
          className="w-6 h-6"
        />
        Threat Level
      </h3>
      
      <div className="px-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 text-center">
            Error loading security data
          </div>
        ) : (
          <SecuritySummary
            score={securityScore.score}
            level={securityScore.level}
            description={securityScore.description}
          />
        )}
      </div>
    </div>
  );
};

export default WebacySecurity;
