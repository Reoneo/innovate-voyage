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
import { mainnetProvider } from "@/utils/ethereumProviders";

// Using 'export type' syntax instead of just 'export' for types
export type { EfpPerson, EfpStats } from "./efp/types";

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
  const [friends, setFriends] = useState<EfpPerson[]>([]);
  const { toast } = useToast();
  const { followAddress: followAddressAction, isProcessing } = useEfpFollow();

  const fetchEfpData = async () => {
    if (!walletAddress) return;
    setLoading(true);

    try {
      console.log("Fetching EFP data for:", walletAddress);
      // Fetch basic stats first
      const stats = await fetchEfpStats(walletAddress);
      
      // Then fetch followers and following lists
      const [followers, following] = await Promise.all([
        fetchEfpFollowers(walletAddress),
        fetchEfpFollowing(walletAddress)
      ]);

      console.log("Followers data:", followers);
      console.log("Following data:", following);

      // Get following addresses from API
      const apiFollowingAddrs = Array.isArray(following) 
        ? following.map(f => f.data || f.address) 
        : [];
      
      setFollowingAddresses(apiFollowingAddrs);

      // Process followers and following with ENS data
      const [followersList, followingList] = await Promise.all([
        processUsers(followers),
        processUsers(following)
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
        following: stats.following,
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
    // Check if the address is in the following list from the API
    return followingAddresses.includes(address);
  };

  const followAddress = async (addressToFollow: string): Promise<void> => {
    try {
      await followAddressAction(addressToFollow, isFollowing(addressToFollow), () => {
        // Only refresh data after a successful follow
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
    friends,
    isProcessing
  };
}
