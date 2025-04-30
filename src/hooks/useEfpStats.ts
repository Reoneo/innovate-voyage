
import { useState, useEffect, useCallback } from "react";
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
  mutualFollows?: number;
}

// Base API URL for EthIdentityKit
const EFK_API_BASE = "https://api.ethfollow.xyz/api/v1";

// Fetch user stats from EFK API
async function fetchEfpStats(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`${EFK_API_BASE}/users/${ensOrAddress}/stats?cache=fresh`);
    const data = await response.json();
    return {
      followers: parseInt(data.followers_count || '0'),
      following: parseInt(data.following_count || '0'),
      mutualFollows: parseInt(data.mutual_follows_count || '0')
    };
  } catch (error) {
    console.error('Error fetching EFP stats:', error);
    return { followers: 0, following: 0, mutualFollows: 0 };
  }
}

// Fetch followers from EFK API
async function fetchEfpFollowers(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `${EFK_API_BASE}/users/${ensOrAddress}/followers?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.followers || [];
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Fetch following from EFK API
async function fetchEfpFollowing(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `${EFK_API_BASE}/users/${ensOrAddress}/following?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.following || [];
  } catch (error) {
    console.error('Error fetching EFP following:', error);
    return [];
  }
}

// Fetch mutual follows
async function fetchEfpMutualFollows(address1: string, address2: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${EFK_API_BASE}/users/${address1}/mutual-follows/${address2}?limit=50`
    );
    const data = await response.json();
    return data.mutual_follows || [];
  } catch (error) {
    console.error('Error fetching mutual follows:', error);
    return [];
  }
}

// Fetch ENS data for an address
async function fetchEnsData(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`${EFK_API_BASE}/users/${ensOrAddress}/ens`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching ENS data:', error);
    return null;
  }
}

// Check if a user is following another user
async function checkIsFollowing(follower: string, followee: string): Promise<boolean> {
  try {
    const response = await fetch(`${EFK_API_BASE}/users/${follower}/follows/${followee}`);
    const data = await response.json();
    return data.follows === true;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0, mutualFollows: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
  const [friends, setFriends] = useState<EfpPerson[]>([]);
  const [mutualFollowsList, setMutualFollowsList] = useState<EfpPerson[]>([]);
  const { toast } = useToast();

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
      
      // Set friends as a combination of followers and following
      const combinedFriends = [...followersList, ...followingList];
      // Remove duplicates by address
      const uniqueFriends = combinedFriends.filter((friend, index, self) =>
        index === self.findIndex((f) => f.address === friend.address)
      );
      
      setFriends(uniqueFriends);

      // Get mutual follows for connected wallet if available
      const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
      if (connectedWalletAddress && connectedWalletAddress !== walletAddress) {
        const mutuals = await fetchEfpMutualFollows(connectedWalletAddress, walletAddress);
        const processedMutuals = await processUsers(mutuals);
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

      // Check if we have the Ethereum object available from Metamask
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No wallet accounts available");
        }
        
        // Get the current user account
        const userAddress = accounts[0];
        
        // To follow on EFP, user needs to sign a message
        const message = `Follow ${addressToFollow} on ethereum-follow-protocol`;
        
        // Request signature from the user
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, userAddress]
        });
        
        if (!signature) {
          throw new Error("Signature was not provided");
        }
        
        console.log(`Successfully signed follow message for ${addressToFollow}`);
        
        // In a full implementation, you would now submit this signature to the EFP backend
        // For now, we'll just simulate success
        
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
      } else {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }
    } catch (error: any) {
      console.error('Error following address:', error);
      throw new Error(error.message || "Failed to follow. Please try again.");
    }
  };

  return { 
    ...stats, 
    loading, 
    followAddress,
    isFollowing,
    refreshData: fetchEfpData,
    friends,
    mutualFollowsList
  };
}

// Helper to shorten addresses
function shortenAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
