
import { useState } from 'react';
import { fetchEfpStats, fetchEfpFollowers, fetchEfpFollowing } from '@/api/services/efpService';
import { resolveUserDetails } from '@/hooks/useEnsResolver';
import { EfpPerson, EfpStats } from '../types/efp';

export function useEfpData(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);

  const fetchEfpData = async () => {
    if (!walletAddress) return;
    setLoading(true);

    try {
      const userStats = await fetchEfpStats(walletAddress);
      const [followers, following] = await Promise.all([
        fetchEfpFollowers(walletAddress),
        fetchEfpFollowing(walletAddress)
      ]);
      
      const followerAddrs = Array.isArray(followers) ? followers.map(f => f.address) : [];
      const followingAddrs = Array.isArray(following) ? following.map(f => f.address) : [];
      
      const [followersList, followingList] = await Promise.all([
        resolveUserDetails(followerAddrs),
        resolveUserDetails(followingAddrs)
      ]);

      setStats({
        followers: userStats.followerCount || followersList.length,
        followersList,
        following: userStats.followingCount || followingList.length,
        followingList
      });
    } catch (e) {
      console.error('Error fetching EFP data:', e);
      setStats({ followers: 0, following: 0, followersList: [], followingList: [] });
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    fetchEfpData
  };
}
