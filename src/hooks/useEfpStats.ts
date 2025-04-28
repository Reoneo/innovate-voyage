
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
    // First try with ethfollow API
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/ens`);
    const data = await response.json();
    
    // If we got a result, return it
    if (data?.ens?.name) {
      return data;
    }
    
    // For .box domains, try the GraphQL API
    if (ensOrAddress.toLowerCase().endsWith('.box')) {
      const boxName = ensOrAddress.toLowerCase();
      const query = `
        {
          domains(where:{name:"${boxName}"}) {
            name
            textRecords(where:{key:"avatar"}) {
              value
            }
            contentHash
          }
        }
      `;
      
      const graphResponse = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const graphData = await graphResponse.json();
      const domain = graphData.data?.domains?.[0];
      
      if (domain) {
        const avatar = domain.textRecords.length
          ? domain.textRecords[0].value
          : domain.contentHash
            ? `ipfs://${domain.contentHash}`
            : null;
            
        return {
          ens: {
            name: boxName,
            avatar
          }
        };
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching ENS data:', error);
    return null;
  }
}

// Function to sign and submit follow request using Ethereum Identity Kit
async function submitFollowRequest(targetAddress: string, userAddress: string) {
  if (!userAddress || !targetAddress) return false;
  
  try {
    // Check if we have the Ethereum object available from Metamask
    if (typeof window.ethereum !== 'undefined') {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No wallet accounts available");
      }
      
      // Prepare the message to sign
      const message = `Follow ${targetAddress} on ethereum-follow-protocol`;
      
      // Request signature from the user
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, userAddress]
      });
      
      if (!signature) {
        throw new Error("Signature was not provided");
      }
      
      // Submit the follow request to EFP API
      const response = await fetch('https://api.ethfollow.xyz/api/v1/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          follower: userAddress,
          following: targetAddress,
          signature,
          message
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to follow");
      }
      
      return true;
    } else {
      throw new Error("Ethereum provider not found. Please install MetaMask.");
    }
  } catch (error) {
    console.error("Error following address:", error);
    throw error;
  }
}

// Function to unfollow a user
async function submitUnfollowRequest(targetAddress: string, userAddress: string) {
  if (!userAddress || !targetAddress) return false;
  
  try {
    // Check if we have the Ethereum object available
    if (typeof window.ethereum !== 'undefined') {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No wallet accounts available");
      }
      
      // Prepare the message to sign
      const message = `Unfollow ${targetAddress} on ethereum-follow-protocol`;
      
      // Request signature from the user
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, userAddress]
      });
      
      if (!signature) {
        throw new Error("Signature was not provided");
      }
      
      // Submit the unfollow request to EFP API
      const response = await fetch('https://api.ethfollow.xyz/api/v1/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          follower: userAddress,
          following: targetAddress,
          signature,
          message
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to unfollow");
      }
      
      return true;
    } else {
      throw new Error("Ethereum provider not found. Please install MetaMask.");
    }
  } catch (error) {
    console.error("Error unfollowing address:", error);
    throw error;
  }
}

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
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
  }, [walletAddress]);

  useEffect(() => {
    let cancelled = false;
    if (!walletAddress) return;
    
    fetchEfpData();
    
    return () => { cancelled = true; };
  }, [walletAddress, fetchEfpData]);

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
      
      // Use the new submitFollowRequest function
      const success = await submitFollowRequest(addressToFollow, connectedWalletAddress);
      
      if (success) {
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
      }
    } catch (error: any) {
      console.error('Error following address:', error);
      toast({
        title: "Error following address",
        description: error.message || "Failed to follow. Please try again.",
        variant: "destructive"
      });
      throw new Error(error.message || "Failed to follow. Please try again.");
    }
  };
  
  const unfollowAddress = async (addressToUnfollow: string): Promise<void> => {
    // Check if wallet is connected
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // If not following, don't do anything
      if (!isFollowing(addressToUnfollow)) {
        return;
      }

      toast({
        title: "Unfollowing address",
        description: `Connecting to wallet to unfollow ${shortenAddress(addressToUnfollow)}...`
      });
      
      // Use the new submitUnfollowRequest function
      const success = await submitUnfollowRequest(addressToUnfollow, connectedWalletAddress);
      
      if (success) {
        // Remove from local following list for UI updates
        setFollowingAddresses(prev => prev.filter(addr => addr !== addressToUnfollow));
        setStats(prev => ({
          ...prev,
          following: Math.max(0, prev.following - 1),
          followingList: prev.followingList?.filter(f => f.address !== addressToUnfollow) || []
        }));

        toast({
          title: "Success",
          description: `You are no longer following ${shortenAddress(addressToUnfollow)}`
        });
      }
    } catch (error: any) {
      console.error('Error unfollowing address:', error);
      toast({
        title: "Error unfollowing address",
        description: error.message || "Failed to unfollow. Please try again.",
        variant: "destructive"
      });
      throw new Error(error.message || "Failed to unfollow. Please try again.");
    }
  };

  // Create friends property by combining follower and following lists
  const friends = () => {
    const friendList: EfpPerson[] = [];
    const addresses = new Set<string>();
    
    // Add followers to friends list
    if (stats.followersList) {
      stats.followersList.forEach(follower => {
        if (!addresses.has(follower.address)) {
          addresses.add(follower.address);
          friendList.push(follower);
        }
      });
    }
    
    // Add following to friends list
    if (stats.followingList) {
      stats.followingList.forEach(following => {
        if (!addresses.has(following.address)) {
          addresses.add(following.address);
          friendList.push(following);
        }
      });
    }
    
    return friendList;
  };

  return { 
    ...stats, 
    loading, 
    followAddress,
    unfollowAddress,
    isFollowing,
    refreshData: fetchEfpData,
    friends: friends()
  };
}

// Helper to shorten addresses
function shortenAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
