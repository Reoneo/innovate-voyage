
import { useState, useEffect, useCallback, useRef } from "react";
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

// Cache for storing fetched data with expiration
const dataCache: {
  [key: string]: {
    data: any,
    timestamp: number,
    expiresIn: number
  }
} = {};

// Get data from cache if available and not expired
const getFromCache = (cacheKey: string): any | null => {
  const cachedItem = dataCache[cacheKey];
  if (cachedItem) {
    const now = Date.now();
    if (now - cachedItem.timestamp < cachedItem.expiresIn) {
      return cachedItem.data;
    }
  }
  return null;
};

// Set data in cache with expiration
const setInCache = (cacheKey: string, data: any, expiresIn = 60000): void => {
  dataCache[cacheKey] = {
    data,
    timestamp: Date.now(),
    expiresIn
  };
};

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);
  const [friends, setFriends] = useState<EfpPerson[]>([]);
  const { toast } = useToast();
  const { followAddress: followAddressAction, isProcessing } = useEfpFollow();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const fetchEfpData = useCallback(async () => {
    if (!walletAddress) return;
    
    // Cancel any existing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setLoading(true);

    try {
      console.log("Fetching EFP data for:", walletAddress);
      
      // Check cache first
      const cacheKey = `efp_${walletAddress}`;
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        console.log("Using cached EFP data");
        setStats(cachedData.stats);
        setFollowingAddresses(cachedData.followingAddresses);
        setFriends(cachedData.friends);
        setLoading(false);
        return;
      }
      
      // Set a timeout to prevent hanging requests
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          console.log("Aborting EFP fetch due to timeout");
        }
      }, 15000); // 15 second timeout
      
      // Fetch basic stats first with a lower timeout
      const stats = await Promise.race([
        fetchEfpStats(walletAddress),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error("Stats fetch timeout")), 5000)
        )
      ]);
      
      // Then fetch followers and following lists in parallel
      const [followers, following] = await Promise.all([
        fetchEfpFollowers(walletAddress, { signal, limit: 1000 }),
        fetchEfpFollowing(walletAddress, { signal, limit: 1000 })
      ]);

      console.log(`Fetched ${followers?.length || 0} followers and ${following?.length || 0} following`);

      // Clear the timeout since we got the data
      clearTimeout(timeoutId);
      
      // Check if request was aborted
      if (signal.aborted) {
        throw new Error("Request aborted");
      }

      // Get following addresses from API
      const apiFollowingAddrs = Array.isArray(following) 
        ? following.map(f => f.data || f.address) 
        : [];
      
      setFollowingAddresses(apiFollowingAddrs);

      // Process followers and following with ENS data - do this separately to show data faster
      const [followersList, followingList] = await Promise.all([
        processUsers(followers, { signal }),
        processUsers(following, { signal })
      ]);
      
      // Set friends as a combination of followers and following
      const combinedFriends = [...followersList, ...followingList];
      // Remove duplicates by address
      const uniqueFriends = combinedFriends.filter((friend, index, self) =>
        index === self.findIndex((f) => f.address === friend.address)
      );
      
      setFriends(uniqueFriends);
      
      const updatedStats = {
        followers: stats.followers,
        following: stats.following,
        followersList,
        followingList
      };
      
      setStats(updatedStats);
      
      // Cache the results for 5 minutes
      setInCache(cacheKey, {
        stats: updatedStats,
        followingAddresses: apiFollowingAddrs,
        friends: uniqueFriends
      }, 5 * 60 * 1000);
      
    } catch (e) {
      console.error('Error fetching EFP data:', e);
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        setStats({ followers: 0, following: 0 });
      }
    } finally {
      if (abortControllerRef.current?.signal !== signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    
    fetchEfpData();
    
    return () => {
      // Clean up by aborting any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [walletAddress, fetchEfpData]);

  const isFollowing = useCallback((address: string): boolean => {
    // Check if the address is in the following list from the API
    return followingAddresses.includes(address);
  }, [followingAddresses]);

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
