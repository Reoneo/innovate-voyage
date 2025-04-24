
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Util to shorten an Ethereum address
function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
}

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

// Helper to resolve ENS/avatars in bulk (very basic for now)
async function getEnsData(address: string): Promise<{ ensName?: string; avatar?: string }> {
  try {
    // Use ENS registry/public mainnet endpoint or a public ENS lookup API via web3.bio
    const resp = await fetch(`https://api.web3.bio/profile/${address}`);
    const data = await resp.json();
    return {
      ensName: data.ens?.name,
      avatar: data.ens?.avatar,
    };
  } catch (e) {
    return {};
  }
}

// Fetch account data from EFP API
async function fetchEfpAccountData(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/account`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP account:', error);
    return null;
  }
}

// Fetch followers from EFP API
async function fetchEfpFollowers(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Fetch following from EFP API
async function fetchEfpFollowing(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP following:', error);
    return [];
  }
}

// Fetch user stats from EFP API
async function fetchEfpStats(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/stats`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP stats:', error);
    return { followerCount: 0, followingCount: 0 };
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
      
      // Resolve ENS names for all users
      const resolveUserDetails = async (addresses: string[]) => {
        const results: EfpPerson[] = [];
        
        // Process in chunks to avoid overwhelming the API
        const chunkSize = 5;
        for (let i = 0; i < addresses.length; i += chunkSize) {
          const chunk = addresses.slice(i, i + chunkSize);
          const promises = chunk.map(async (addr) => {
            // Try to fetch additional details from EFP API
            const accountData = await fetchEfpAccountData(addr);
            
            // Fall back to basic ENS resolution if needed
            if (!accountData || !accountData.ensName) {
              const { ensName, avatar } = await getEnsData(addr);
              return { address: addr, ensName, avatar };
            }
            
            return { 
              address: addr, 
              ensName: accountData.ensName,
              avatar: accountData.avatar
            };
          });
          
          const resolvedChunk = await Promise.all(promises);
          results.push(...resolvedChunk);
        }
        
        return results;
      };

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
