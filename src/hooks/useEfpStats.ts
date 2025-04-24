import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

// Fetch user stats from EFP API
async function fetchEfpStats(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/stats?cache=fresh`);
    const data = await response.json();
    return {
      followers: parseInt(data.followers_count || '0'),
      following: parseInt(data.following_count || '0')
    };
  } catch (error) {
    console.error('Error fetching EFP stats:', error);
    return { followers: 0, following: 0 };
  }
}

// Fetch followers from EFP API
async function fetchEfpFollowers(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.followers || [];
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Fetch following from EFP API
async function fetchEfpFollowing(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.following || [];
  } catch (error) {
    console.error('Error fetching EFP following:', error);
    return [];
  }
}

// Fetch ENS data for an address
async function fetchEnsData(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/ens`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching ENS data:', error);
    return null;
  }
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
      const processUsers = async (users: any[]) => {
        return Promise.all(
          users.map(async (user) => {
            const address = user.data || user.address;
            const ensData = await fetchEnsData(address);
            return {
              address,
              ensName: ensData?.ens?.name,
              avatar: ensData?.ens?.avatar
            };
          })
        );
      };

      const [followersList, followingList] = await Promise.all([
        processUsers(followers),
        processUsers(following)
      ]);

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
    return followingAddresses.includes(address);
  };

  const followAddress = async (addressToFollow: string): Promise<void> => {
    // Check if wallet is connected
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      throw new Error("Please connect your wallet first");
    }

    // Implementation of EFP follow functionality
    try {
      // If already following, don't do anything
      if (isFollowing(addressToFollow)) {
        return;
      }

      toast({
        title: "Following address",
        description: `Connecting to wallet to follow ${shortenAddress(addressToFollow)}...`
      });

      // For a real implementation, we would:
      // 1. Prompt the user to sign a message with their wallet
      // 2. Submit that signature to the EFP indexer
      // 3. Wait for confirmation
      
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
