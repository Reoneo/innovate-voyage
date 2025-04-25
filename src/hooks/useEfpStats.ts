
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchEfpStats, 
  fetchEfpFollowers, 
  fetchEfpFollowing 
} from "@/api/services/efpService";
import { resolveUserDetails } from "@/hooks/useEnsResolver";
import { shortenAddress } from "@/utils/ensResolver";

export interface EfpPerson {
  address: string;
  ensName?: string;
  avatar?: string;
}

export interface EfpStats {
  following: number;
  followers: number;
  followingList?: EfpPerson[];
  followersList?: EfpPerson[];
}

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchEfpData = async () => {
    if (!walletAddress) return;
    setLoading(true);

    try {
      // First fetch the user stats to get follower/following counts
      const userStats = await fetchEfpStats(walletAddress);
      
      // Then fetch followers and following lists
      const [followers, following] = await Promise.all([
        fetchEfpFollowers(walletAddress),
        fetchEfpFollowing(walletAddress)
      ]);

      // Extract just the addresses from the following list for quick lookups
      const followingAddrs = Array.isArray(following) 
        ? following.map(f => f.address) 
        : [];
      
      setFollowingAddresses(followingAddrs);
      
      // Get follower/following addresses
      const followerAddrs = Array.isArray(followers) ? followers.map(f => f.address) : [];
      
      // Resolve ENS details for both lists
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

  useEffect(() => {
    let cancelled = false;
    if (!walletAddress) return;
    
    fetchEfpData();
    
    return () => { cancelled = true; };
  }, [walletAddress]);

  const isFollowing = (address: string): boolean => {
    return followingAddresses.includes(address);
  };

  const followAddress = async (addressToFollow: string): Promise<void> => {
    // Check if wallet is connected
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // If already following, don't do anything
      if (isFollowing(addressToFollow)) {
        return;
      }

      toast({
        title: "Following address",
        description: `Connecting to wallet to follow ${shortenAddress(addressToFollow)}...`
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      toast({
        title: "Success",
        description: `You are now following ${shortenAddress(addressToFollow)}`
      });

    } catch (error) {
      console.error('Error following address:', error);
      throw error;
    }
  };

  return { 
    ...stats, 
    loading, 
    followAddress,
    isFollowing,
    refreshData: fetchEfpData
  };
}
