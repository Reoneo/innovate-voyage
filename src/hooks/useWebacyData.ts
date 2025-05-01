
import { useState, useEffect } from 'react';
import type { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';

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
        // Use the correct endpoint with chain parameter
        const response = await fetch(`https://api.webacy.com/v2/quick-profile/${walletAddress}?chain=eth`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          },
          cache: 'no-store' // Ensure no caching
        });
        
        if (!response.ok) {
          console.error('Webacy API error:', response.status, response.statusText);
          throw new Error('Failed to fetch security data');
        }
        
        const data = await response.json();
        console.log('Webacy Quick Profile Response:', data);
        
        // Fetch risk items if available
        const riskItemsResponse = await fetch(
          `https://api.webacy.com/v2/addresses/${walletAddress}/risk-items?chain=eth`,
          {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'Key-ID': 'eujjkt9ao5'
            },
            cache: 'no-store'
          }
        );
        
        let riskItems = [];
        if (riskItemsResponse.ok) {
          const riskData = await riskItemsResponse.json();
          console.log('Webacy Risk Items:', riskData);
          riskItems = riskData.data || [];
        }

        let threatLevel: ThreatLevel = 'UNKNOWN';
        if (data.score !== undefined) {
          if (data.score < 30) {
            threatLevel = 'LOW';
          } else if (data.score < 70) {
            threatLevel = 'MEDIUM';
          } else {
            threatLevel = 'HIGH';
          }
        }
        
        setSecurityData({
          riskScore: data.score || 0,
          threatLevel,
          walletAddress,
          approvals: {
            count: data.numApprovals || 0,
            riskyCount: data.numRiskyApprovals || 0
          },
          quickProfile: {
            transactions: data.numTransactions || 0,
            contracts: data.numContracts || 0,
            riskLevel: threatLevel
          },
          riskItems: riskItems,
          riskHistory: data.riskHistory || []
        });

        setRiskHistory(data.riskHistory || []);
        
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
