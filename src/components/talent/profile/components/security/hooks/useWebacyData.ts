
import { useState, useEffect } from 'react';

// Types for Webacy data
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface WebacyData {
  riskScore?: number;
  threatLevel?: ThreatLevel;
  approvals?: {
    count: number;
    riskyCount: number;
  };
  quickProfile?: {
    transactions?: number;
    contracts?: number;
    riskLevel?: string;
  };
}

const API_KEY = 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb';
const KEY_ID = 'eujjkt9ao5';

/**
 * Hook to fetch and manage Webacy security data for a wallet address
 */
export const useWebacyData = (walletAddress?: string) => {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    
    console.log(`WebacyData Hook: Fetching data for address: ${walletAddress}`);
    setIsLoading(true);
    setError(null);
    
    // For testing purposes only - always assign a default threatLevel
    // This ensures component rendering even if API calls fail
    setSecurityData({ threatLevel: 'LOW' });
    
    const fetchWebacyData = async () => {
      try {
        // Fetch address data
        const addressResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
          headers: {
            'X-API-KEY': API_KEY,
            'Key-ID': KEY_ID
          }
        });
        
        if (!addressResponse.ok) {
          throw new Error('Failed to fetch address data');
        }
        
        const addressData = await addressResponse.json();
        console.log(`WebacyData Hook: Address data received for ${walletAddress}:`, addressData);
        
        // Fetch approvals data
        const approvalsResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}/approvals`, {
          headers: {
            'X-API-KEY': API_KEY,
            'Key-ID': KEY_ID
          }
        });
        
        if (!approvalsResponse.ok) {
          throw new Error('Failed to fetch approvals data');
        }
        
        const approvalsData = await approvalsResponse.json();
        
        // Fetch quick profile data
        const quickProfileResponse = await fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
          headers: {
            'X-API-KEY': API_KEY,
            'Key-ID': KEY_ID
          }
        });
        
        if (!quickProfileResponse.ok) {
          throw new Error('Failed to fetch quick profile data');
        }
        
        const quickProfileData = await quickProfileResponse.json();
        
        // Determine threat level
        let threatLevel: ThreatLevel = 'UNKNOWN';
        if (addressData.riskScore !== undefined) {
          if (addressData.riskScore < 30) {
            threatLevel = 'LOW';
          } else if (addressData.riskScore < 70) {
            threatLevel = 'MEDIUM';
          } else {
            threatLevel = 'HIGH';
          }
        }
        
        const newSecurityData = {
          riskScore: addressData.riskScore,
          threatLevel,
          approvals: {
            count: approvalsData.totalCount || 0,
            riskyCount: approvalsData.riskyCount || 0
          },
          quickProfile: {
            transactions: quickProfileData.numTransactions,
            contracts: quickProfileData.numContracts,
            riskLevel: quickProfileData.riskLevel
          }
        };
        
        console.log(`WebacyData Hook: Compiled security data for ${walletAddress}:`, newSecurityData);
        setSecurityData(newSecurityData);
      } catch (err) {
        console.error('Error fetching Webacy data:', err);
        setError('Failed to fetch security data');
        // Still set a default threat level to ensure the component renders
        setSecurityData({ threatLevel: 'UNKNOWN' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebacyData();
  }, [walletAddress]);

  return { securityData, isLoading, error };
};
