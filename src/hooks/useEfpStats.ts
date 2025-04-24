
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

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchEfpData = async () => {
    if (!walletAddress) return;
    setLoading(true);

    try {
      // Get EFP followers/following list from the EFP API
      const efpUrl = (type: "followers" | "following") =>
        `https://api.ethereumfollowprotocol.xyz/v1/wallet/${walletAddress}/${type}`;

      // Fetch both lists
      const [followersRes, followingRes] = await Promise.all([
        fetch(efpUrl("followers")),
        fetch(efpUrl("following")),
      ]);

      const followersJson = followersRes.ok ? await followersRes.json() : [];
      const followingJson = followingRes.ok ? await followingRes.json() : [];

      // Arrays of addresses
      const followersAddresses: string[] = Array.isArray(followersJson) ? followersJson : [];
      const currentFollowingAddresses: string[] = Array.isArray(followingJson) ? followingJson : [];
      
      setFollowingAddresses(currentFollowingAddresses);

      // Fetch ENS data for all accounts in parallel
      const resolveList = async (addrs: string[]) => {
        const results: EfpPerson[] = [];
        
        // Process in chunks to avoid overwhelming the API
        const chunkSize = 5;
        for (let i = 0; i < addrs.length; i += chunkSize) {
          const chunk = addrs.slice(i, i + chunkSize);
          const promises = chunk.map(async (addr) => {
            const { ensName, avatar } = await getEnsData(addr);
            return {
              address: addr,
              ensName,
              avatar,
            };
          });
          
          const resolvedChunk = await Promise.all(promises);
          results.push(...resolvedChunk);
        }
        
        return results;
      };

      const [followersList, followingList] = await Promise.all([
        resolveList(followersAddresses),
        resolveList(currentFollowingAddresses),
      ]);

      setStats({
        followers: followersList.length,
        followersList: followersList.map(p =>
          ({ ...p, ensName: p.ensName, avatar: p.avatar, address: p.address })
        ),
        following: followingList.length,
        followingList: followingList.map(p =>
          ({ ...p, ensName: p.ensName, avatar: p.avatar, address: p.address })
        ),
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

      // For actual implementation we would connect to ethers and execute a transaction
      // This is a placeholder for the actual implementation
      toast({
        title: "Following address",
        description: `Connecting to wallet to follow ${shortenAddress(addressToFollow)}...`
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

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

      // To implement real functionality:
      // 1. Use ethers to connect to wallet
      // 2. Call EFP contract to follow address
      // 3. Update UI based on transaction success

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
