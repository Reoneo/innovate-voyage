
import { useState, useEffect } from 'react';
import type { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';
import { validateInput } from '@/utils/secureStorage';
import { toast } from 'sonner';

// Create a cache to store API responses by wallet address
const responseCache = new Map<string, WebacyData>();

export function useWebacyData(walletAddress?: string) {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!walletAddress) return;
    
    // Validate wallet address
    if (!validateInput.ethereumAddress(walletAddress)) {
      setError('Invalid wallet address format');
      return;
    }
    
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
        // Use a proxy endpoint to hide API keys (to be implemented)
        // For now, we'll show a warning about the missing proxy
        console.warn('Webacy API calls should use a secure proxy endpoint');
        
        // Temporary: Mock data for security (remove when proxy is implemented)
        const mockData: WebacyData = {
          riskScore: Math.floor(Math.random() * 100),
          threatLevel: 'LOW' as ThreatLevel,
          walletAddress,
          approvals: {
            count: Math.floor(Math.random() * 10),
            riskyCount: Math.floor(Math.random() * 3)
          },
          quickProfile: {
            transactions: Math.floor(Math.random() * 1000),
            contracts: Math.floor(Math.random() * 50),
            riskLevel: 'LOW' as ThreatLevel
          },
          riskItems: [],
          riskHistory: []
        };

        // Store the result in the cache
        responseCache.set(walletAddress, mockData);
        
        setSecurityData(mockData);
        setRiskHistory([]);
        
        toast.info('Using mock security data - implement secure proxy for production');
        
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
