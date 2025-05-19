import { useState, useEffect } from 'react';
import type { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';

// Create a cache to store API responses by wallet address
const responseCache = new Map<string, WebacyData>();

export function useWebacyData(walletAddress?: string) {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!walletAddress) return;
    
    // Return cached data if available (but only if it's recent - within 15 minutes)
    if (responseCache.has(walletAddress)) {
      const cachedData = responseCache.get(walletAddress);
      const cacheTime = cachedData?.cacheTime || 0;
      const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
      
      // Use cache if it's less than 15 minutes old
      if (cacheTime > fifteenMinutesAgo) {
        console.log('Using cached Webacy data');
        setSecurityData(cachedData || null);
        setRiskHistory(cachedData?.riskHistory || []);
        return;
      }
      
      // Otherwise, remove the stale cache
      console.log('Cached Webacy data is stale, refetching');
      responseCache.delete(walletAddress);
    }

    const fetchWebacyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Make API request to Webacy with correct headers
        const response = await fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb'
          },
          cache: 'no-store' // Ensure no browser caching
        });
        
        if (!response.ok) {
          console.error('Webacy API error:', response.status, response.statusText);
          throw new Error(`Failed to fetch security data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Webacy Quick Profile Response:', data);
        
        // Map the response to our expected format
        let threatLevel: ThreatLevel = 'UNKNOWN';
        let riskScore = 0;
        
        // Calculate risk score and threat level based on Webacy response
        if (data.overallRisk !== undefined) {
          riskScore = data.overallRisk;
          if (riskScore < 30) {
            threatLevel = 'LOW';
          } else if (riskScore < 70) {
            threatLevel = 'MEDIUM';
          } else {
            threatLevel = 'HIGH';
          }
        }

        // If high or medium count is present, adjust the threat level
        if (data.high && data.high > 0) {
          threatLevel = 'HIGH';
        } else if (data.medium && data.medium > 0) {
          threatLevel = 'MEDIUM';
        }
        
        const webacyData: WebacyData = {
          riskScore: riskScore,
          threatLevel,
          walletAddress,
          approvals: {
            count: data.count || 0,
            riskyCount: (data.high || 0) + (data.medium || 0)
          },
          quickProfile: {
            transactions: data.count || 0,
            contracts: data.count || 0,
            riskLevel: threatLevel
          },
          riskItems: data.issues || [],
          riskHistory: data.riskHistory || [],
          cacheTime: Date.now() // Add timestamp to track cache freshness
        };

        // Store the result in the cache
        responseCache.set(walletAddress, webacyData);
        
        setSecurityData(webacyData);
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
