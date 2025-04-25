
import { useEffect } from 'react';
import { useEfpData } from './efp/useEfpData';
import { useFollowAddress } from './efp/useFollowAddress';
import { EfpStats } from './types/efp';

export type { EfpPerson } from './types/efp';

export function useEfpStats(walletAddress?: string) {
  const { stats, loading, fetchEfpData } = useEfpData(walletAddress);
  const { followingAddresses, setFollowingAddresses, isFollowing, followAddress } = useFollowAddress();

  useEffect(() => {
    if (!walletAddress) return;
    
    const loadData = async () => {
      await fetchEfpData();
    };
    
    loadData();
  }, [walletAddress]);

  useEffect(() => {
    if (stats.followingList) {
      setFollowingAddresses(stats.followingList.map(f => f.address));
    }
  }, [stats.followingList]);

  return {
    ...stats,
    loading,
    followAddress,
    isFollowing,
    refreshData: fetchEfpData
  };
}
