
import { useState, useEffect } from 'react';
import type { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';

export function useWebacyData(walletAddress?: string) {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  // Function to fetch data with better error handling
  const fetchWebacyData = async (address: string) => {
    setIsLoading(true);
    
    try {
      // Short timeout to prevent long-hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Use the correct endpoint with chain parameter
      const response = await fetch(`https://api.webacy.com/v2/quick-profile/${address}?chain=eth`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
          'Key-ID': 'eujjkt9ao5'
        },
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('Webacy API error:', response.status, response.statusText);
        throw new Error('Failed to fetch security data');
      }
      
      const data = await response.json();
      
      // Set basic threat level even if full data isn't available
      let threatLevel: ThreatLevel = 'UNKNOWN';
      let riskScore = 0;
      
      if (data.score !== undefined) {
        riskScore = data.score;
        if (data.score < 30) {
          threatLevel = 'LOW';
        } else if (data.score < 70) {
          threatLevel = 'MEDIUM';
        } else {
          threatLevel = 'HIGH';
        }
      }
      
      setSecurityData({
        riskScore,
        threatLevel,
        walletAddress: address,
        approvals: {
          count: data.numApprovals || 0,
          riskyCount: data.numRiskyApprovals || 0
        },
        quickProfile: {
          transactions: data.numTransactions || 0,
          contracts: data.numContracts || 0,
          riskLevel: threatLevel
        },
        riskHistory: data.riskHistory || []
      });

      setRiskHistory(data.riskHistory || []);
      setError(null);
      
    } catch (err: any) {
      console.error('Error fetching Webacy data:', err);
      
      // Handle timeout errors specifically
      if (err.name === 'AbortError') {
        setError('Request timed out');
      } else {
        setError('Failed to fetch security data');
      }
      
      // Set minimal data for display
      setSecurityData({ 
        threatLevel: 'UNKNOWN',
        riskScore: 0,
        walletAddress
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    fetchWebacyData(walletAddress);
    
    // Setup automatic retry with exponential backoff if initial fetch fails
    const retryTimeout = setTimeout(() => {
      if (error && retryCount < 2) { // Limit to 2 retries
        console.log(`Retrying Webacy data fetch (${retryCount + 1})...`);
        setRetryCount(prev => prev + 1);
        fetchWebacyData(walletAddress);
      }
    }, Math.pow(2, retryCount) * 3000); // 3s, 6s, 12s

    return () => clearTimeout(retryTimeout);
  }, [walletAddress, error, retryCount]);

  return { securityData, isLoading, error, riskHistory };
}
