
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchEfpStats, 
  fetchEfpFollowers, 
  fetchEfpFollowing, 
  processUsers 
} from "./efp/api";
import { EfpPerson, EfpStats } from "./efp/types";
import { shortenAddress } from "./efp/utils";
import { useEfpFollow } from "./efp/useEfpFollow";

// Using 'export type' syntax instead of just 'export' for types
export type { EfpPerson, EfpStats } from "./efp/types";

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
  const [friends, setFriends] = useState<EfpPerson[]>([]);
  const { toast } = useToast();
  const { followAddress: followAddressAction } = useEfpFollow();

  const fetchEfpData = async () => {
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

      // Get following addresses from API
      const apiFollowingAddrs = Array.isArray(following) 
        ? following.map(f => f.data || f.address) 
        : [];
      
      // Get locally stored following addresses
      const localFollowingAddrs = JSON.parse(localStorage.getItem('efp_following_addresses') || '[]');
      
      // Combine API and local following addresses
      const combinedFollowingAddrs = [...new Set([...apiFollowingAddrs, ...localFollowingAddrs])];
      setFollowingAddresses(combinedFollowingAddrs);

      // Process followers and following with ENS data
      const [followersList, followingList] = await Promise.all([
        processUsers(followers),
        processUsers([...following, ...localFollowingAddrs.map(addr => ({ address: addr }))])
      ]);
      
      // Set friends as a combination of followers and following
      const combinedFriends = [...followersList, ...followingList];
      // Remove duplicates by address
      const uniqueFriends = combinedFriends.filter((friend, index, self) =>
        index === self.findIndex((f) => f.address === friend.address)
      );
      
      setFriends(uniqueFriends);
      
      setStats({
        followers: stats.followers,
        following: Math.max(stats.following, combinedFollowingAddrs.length), // Use whichever count is higher
        followersList,
        followingList
      });
      
    } catch (e) {
      console.error('Error fetching EFP data:', e);
      setStats({ followers: 0, following: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    if (!walletAddress) return;
    
    fetchEfpData();
    
    return () => { cancelled = true; };
  }, [walletAddress]);

  const isFollowing = (address: string): boolean => {
    // Check both in-memory state and localStorage to be safe
    if (followingAddresses.includes(address)) {
      return true;
    }
    
    // Double-check localStorage in case state hasn't been updated yet
    const localFollowingAddrs = JSON.parse(localStorage.getItem('efp_following_addresses') || '[]');
    return localFollowingAddrs.includes(address);
  };

  const followAddress = async (addressToFollow: string): Promise<void> => {
    try {
      await followAddressAction(addressToFollow, isFollowing(addressToFollow), () => {
        // Add to local following list for UI updates
        setFollowingAddresses(prev => {
          if (!prev.includes(addressToFollow)) {
            return [...prev, addressToFollow];
          }
          return prev;
        });
        
        // Update stats
        setStats(prev => ({
          ...prev,
          following: prev.following + (isFollowing(addressToFollow) ? 0 : 1),
          followingList: isFollowing(addressToFollow) 
            ? prev.followingList 
            : [...(prev.followingList || []), { address: addressToFollow }]
        }));
        
        // Refresh data after a short delay to reflect changes
        setTimeout(fetchEfpData, 1000);
      });
    } catch (error) {
      throw error;
    }
  };

  return { 
    ...stats, 
    loading, 
    followAddress,
    isFollowing,
    refreshData: fetchEfpData,
    friends
  };
}
