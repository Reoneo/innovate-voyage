import { useState, useEffect } from 'react';
import type { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';
import { supabase } from '@/integrations/supabase/client';

// Create a cache to store API responses by wallet address
const responseCache = new Map<string, WebacyData>();

export function useWebacyData(walletAddress?: string) {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!walletAddress) return;
    
    // Return cached data if available
    if (responseCache.has(walletAddress)) {
      const cachedData = responseCache.get(walletAddress);
      setSecurityData(cachedData || null);
      setRiskHistory(cachedData?.riskHistory || []);
      return;
    }

    const fetchWebacyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('proxy-webacy', {
          body: { path: `/quick-profile/${walletAddress}` }
        });

        if (invokeError) {
          console.error('Webacy proxy error:', invokeError.message);
          throw new Error('Failed to fetch security data');
        }
        
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
        
        const webacyData = {
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
          riskHistory: data.riskHistory || []
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
