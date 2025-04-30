
import { useState, useEffect } from 'react';
import type { WebacyData, ThreatLevel } from '../../scores/types';

export function useWebacyData(walletAddress?: string) {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchWebacyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const addressResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
          headers: {
            'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          }
        });
        
        if (!addressResponse.ok) {
          throw new Error('Failed to fetch address data');
        }
        
        const addressData = await addressResponse.json();
        
        const approvalsResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}/approvals`, {
          headers: {
            'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          }
        });
        
        if (!approvalsResponse.ok) {
          throw new Error('Failed to fetch approvals data');
        }
        
        const approvalsData = await approvalsResponse.json();
        
        const quickProfileResponse = await fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
          headers: {
            'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          }
        });
        
        if (!quickProfileResponse.ok) {
          throw new Error('Failed to fetch quick profile data');
        }
        
        const quickProfileData = await quickProfileResponse.json();
        
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
        
        setSecurityData({
          riskScore: addressData.riskScore,
          threatLevel,
          walletAddress,
          approvals: {
            count: approvalsData.totalCount || 0,
            riskyCount: approvalsData.riskyCount || 0
          },
          quickProfile: {
            transactions: quickProfileData.numTransactions,
            contracts: quickProfileData.numContracts,
            riskLevel: quickProfileData.riskLevel
          }
        });

        setRiskHistory(quickProfileData.riskHistory || []);
      } catch (err) {
        console.error('Error fetching Webacy data:', err);
        setError('Failed to fetch security data');
        setSecurityData({ threatLevel: 'UNKNOWN' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebacyData();
  }, [walletAddress]);

  return { securityData, isLoading, error, riskHistory };
}
