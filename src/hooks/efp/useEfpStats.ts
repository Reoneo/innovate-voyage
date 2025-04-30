import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { EfpStats, EfpPerson, EfpUserData } from "./efpTypes";
import { fetchEfpStats, fetchEfpFollowers, fetchEfpFollowing, fetchEfpMutualFollows, fetchEnsData } from "./efpApi";
import { processUsers, removeDuplicates } from "./efpUtils";
import { useFollowAction } from "./useFollowAction";

export type { EfpPerson, EfpStats } from "./efpTypes";

/**
 * Hook for fetching and managing EFP stats
 */
export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0, mutualFollows: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
  const [friends, setFriends] = useState<EfpPerson[]>([]);
  const [mutualFollowsList, setMutualFollowsList] = useState<EfpPerson[]>([]);
  const { toast } = useToast();
  const { followAddress, followLoading, setFollowLoadingState } = useFollowAction();

  const fetchEfpData = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);

    try {
      // Fetch basic stats first
      const stats = await fetchEfpStats(walletAddress);
      
      // Then fetch followers and following lists
      const [followers, following] = await Promise.all([
        fetchEfpFollowers(walletAddress),
        fetchEfpFollowing(walletAddress)
      ]);

      const followingAddrs = Array.isArray(following) 
        ? following.map(f => f.data || f.address) 
        : [];
      
      setFollowingAddresses(followingAddrs);

      // Process followers and following with ENS data
      const [followersList, followingList] = await Promise.all([
        processUsers(followers, fetchEnsData),
        processUsers(following, fetchEnsData)
      ]);
      
      // Set friends as a combination of followers and following
      const combinedFriends = [...followersList, ...followingList];
      // Remove duplicates by address
      const uniqueFriends = removeDuplicates(combinedFriends);
      
      setFriends(uniqueFriends);

      // Get mutual follows for connected wallet if available
      const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
      if (connectedWalletAddress && connectedWalletAddress !== walletAddress) {
        const mutuals = await fetchEfpMutualFollows(connectedWalletAddress, walletAddress);
        const processedMutuals = await processUsers(mutuals, fetchEnsData);
        setMutualFollowsList(processedMutuals);
      }
      
      setStats({
        followers: stats.followers,
        following: stats.following,
        mutualFollows: stats.mutualFollows,
        followersList,
        followingList
      });
      
    } catch (e) {
      console.error('Error fetching EFP data:', e);
      setStats({ followers: 0, following: 0, mutualFollows: 0 });
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    let cancelled = false;
    if (!walletAddress) return;
    
    fetchEfpData();
    
    return () => { cancelled = true; };
  }, [walletAddress, fetchEfpData]);

  const isFollowing = useCallback((address: string): boolean => {
    return followingAddresses.includes(address);
  }, [followingAddresses]);

  const handleFollowAddress = async (addressToFollow: string): Promise<void> => {
    // Check if wallet is connected
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      throw new Error("Please connect your wallet first");
    }

    setFollowLoadingState(addressToFollow, true);

    try {
      // If already following, don't do anything
      if (isFollowing(addressToFollow)) {
        return;
      }
      
      await followAddress(addressToFollow);
      
      // Add to local following list for UI updates
      setFollowingAddresses(prev => [...prev, addressToFollow]);
      setStats(prev => ({
        ...prev,
        following: prev.following + 1,
        followingList: [
          ...(prev.followingList || []),
          { address: addressToFollow }
        ]
      }));
    } catch (error: any) {
      throw error;
    } finally {
      setFollowLoadingState(addressToFollow, false);
    }
  };

  return { 
    ...stats, 
    loading, 
    followAddress: handleFollowAddress,
    followLoading,
    isFollowing,
    refreshData: fetchEfpData,
    friends,
    mutualFollowsList,
    followingAddresses
  };
}
