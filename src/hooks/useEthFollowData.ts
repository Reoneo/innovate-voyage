
import { useState, useEffect } from 'react';
import { fetchFollowerStats } from '@/api/utils/ethFollowUtils';

export function useEthFollowData(addressOrEns: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!addressOrEns) return;
      
      // Reset data when address changes
      if (isMounted) {
        setLoading(true);
        setError(null);
        setFollowersCount(0);
        setFollowingCount(0);
      }
      
      try {
        console.log(`Fetching EthFollow data for ${addressOrEns}`);
        const data = await fetchFollowerStats(addressOrEns);
        
        if (isMounted && data) {
          setFollowersCount(parseInt(data.followers_count || '0', 10));
          setFollowingCount(parseInt(data.following_count || '0', 10));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error in useEthFollowData:', err);
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
  }, [addressOrEns]);

  return {
    loading,
    error,
    followersCount,
    followingCount
  };
}
