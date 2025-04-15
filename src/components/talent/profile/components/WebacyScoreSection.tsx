
import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WebacyScoreSectionProps {
  walletAddress: string;
}

interface WebacyData {
  riskScore?: number;
  riskLevel?: string;
  approvals?: any[];
  quickProfile?: any;
}

const WebacyScoreSection: React.FC<WebacyScoreSectionProps> = ({ walletAddress }) => {
  const [webacyData, setWebacyData] = useState<WebacyData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebacyData = async () => {
      if (!walletAddress) return;
      
      setLoading(true);
      setError(null);

      try {
        const headers = {
          'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb'
        };

        // Fetch main address data
        const addressResponse = await fetch(
          `https://api.webacy.com/addresses/${walletAddress}`,
          { headers, cache: 'no-store' }
        );
        
        // Fetch approvals data
        const approvalsResponse = await fetch(
          `https://api.webacy.com/addresses/${walletAddress}/approvals`,
          { headers, cache: 'no-store' }
        );
        
        // Fetch quick profile data
        const quickProfileResponse = await fetch(
          `https://api.webacy.com/quick-profile/${walletAddress}`,
          { headers, cache: 'no-store' }
        );

        if (!addressResponse.ok) {
          throw new Error(`Address data fetch failed: ${addressResponse.status}`);
        }

        const addressData = await addressResponse.json();
        const approvalsData = approvalsResponse.ok ? await approvalsResponse.json() : [];
        const quickProfileData = quickProfileResponse.ok ? await quickProfileResponse.json() : {};

        setWebacyData({
          riskScore: addressData.riskScore,
          riskLevel: addressData.riskLevel,
          approvals: approvalsData,
          quickProfile: quickProfileData
        });
      } catch (err) {
        console.error('Error fetching Webacy data:', err);
        setError('Failed to load security score');
      } finally {
        setLoading(false);
      }
    };

    fetchWebacyData();
  }, [walletAddress]);

  // Function to determine color based on risk score
  const getRiskColor = (score?: number): string => {
    if (score === undefined) return 'text-gray-400';
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Function to get risk label
  const getRiskLabel = (level?: string): string => {
    if (!level) return 'Unknown';
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <Shield className={`h-5 w-5 ${getRiskColor(webacyData.riskScore)}`} />
              <span className="font-medium">Security Score</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Security score by Webacy</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {loading ? (
        <div className="mt-2 text-sm text-muted-foreground">Loading score...</div>
      ) : error ? (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : (
        <div className="mt-2 flex flex-col items-center">
          <div className={`text-lg font-bold ${getRiskColor(webacyData.riskScore)}`}>
            {typeof webacyData.riskScore === 'number' ? webacyData.riskScore : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">
            {getRiskLabel(webacyData.riskLevel)} Risk
          </div>
          {webacyData.approvals && webacyData.approvals.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              {webacyData.approvals.length} Active Approvals
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebacyScoreSection;
