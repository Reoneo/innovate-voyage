
import { useState, useEffect } from 'react';
import { fetchWalletSecurityProfile, calculateSecurityScore } from '@/api/utils/webacyUtils';

export function useWebacyData(walletAddress: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [securityData, setSecurityData] = useState<any>(null);
  const [securityScore, setSecurityScore] = useState({
    score: 0,
    level: 'UNKNOWN',
    description: 'Unable to determine the security level of this wallet.'
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!walletAddress) return;
      
      // Reset data when wallet address changes
      if (isMounted) {
        setLoading(true);
        setError(null);
        setSecurityData(null);
        setSecurityScore({
          score: 0,
          level: 'UNKNOWN',
          description: 'Unable to determine the security level of this wallet.'
        });
      }
      
      try {
        console.log(`Fetching Webacy security data for ${walletAddress}`);
        const data = await fetchWalletSecurityProfile(walletAddress);
        
        if (isMounted && data) {
          setSecurityData(data);
          
          // Calculate security score from the data
          const score = calculateSecurityScore(data);
          setSecurityScore(score);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error in useWebacyData:', err);
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [walletAddress]);

  return {
    loading,
    error,
    securityData,
    securityScore
  };
}
