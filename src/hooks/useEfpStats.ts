
import { useState, useEffect, useCallback } from "react";
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
  
  // Pagination state
  const [followersList, setFollowersList] = useState<EfpPerson[]>([]);
  const [followingList, setFollowingList] = useState<EfpPerson[]>([]);
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PAGE_SIZE = 20;

  const fetchBasicStats = async () => {
    if (!walletAddress) return;
    setLoading(true);

    try {
      console.log("Fetching EFP data for:", walletAddress);
      // Fetch basic stats
      const stats = await fetchEfpStats(walletAddress);
      setStats(prevStats => ({
        ...prevStats,
        followers: stats.followers,
        following: stats.following
      }));
    } catch (e) {
      console.error('Error fetching EFP stats:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async (page = 1, append = false) => {
    if (!walletAddress) return;
    
    setIsLoadingMore(true);
    
    try {
      // Fetch followers with pagination
      const followers = await fetchEfpFollowers(walletAddress, PAGE_SIZE);
      const startIdx = (page - 1) * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      const pageFollowers = followers.slice(startIdx, endIdx);
      
      // Check if we have more followers to load
      setHasMoreFollowers(endIdx < followers.length);
      
      // Process followers with ENS data
      const processedFollowers = await processUsers(pageFollowers);
      
      if (append) {
        setFollowersList(prev => [...prev, ...processedFollowers]);
      } else {
        setFollowersList(processedFollowers);
      }
    } catch (e) {
      console.error('Error fetching followers:', e);
      setHasMoreFollowers(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const fetchFollowing = async (page = 1, append = false) => {
    if (!walletAddress) return;
    
    setIsLoadingMore(true);
    
    try {
      // Fetch following with pagination
      const following = await fetchEfpFollowing(walletAddress, PAGE_SIZE);
      const startIdx = (page - 1) * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      const pageFollowing = following.slice(startIdx, endIdx);
      
      // Check if we have more following to load
      setHasMoreFollowing(endIdx < following.length);
      
      // Get following addresses from API
      const apiFollowingAddrs = Array.isArray(following) 
        ? following.map(f => f.data || f.address) 
        : [];
      
      setFollowingAddresses(apiFollowingAddrs);
      
      // Process following with ENS data
      const processedFollowing = await processUsers(pageFollowing);
      
      if (append) {
        setFollowingList(prev => [...prev, ...processedFollowing]);
      } else {
        setFollowingList(processedFollowing);
      }
    } catch (e) {
      console.error('Error fetching following:', e);
      setHasMoreFollowing(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreFollowers = useCallback(() => {
    if (isLoadingMore || !hasMoreFollowers) return;
    const nextPage = followersPage + 1;
    setFollowersPage(nextPage);
    fetchFollowers(nextPage, true);
  }, [followersPage, isLoadingMore, hasMoreFollowers]);

  const loadMoreFollowing = useCallback(() => {
    if (isLoadingMore || !hasMoreFollowing) return;
    const nextPage = followingPage + 1;
    setFollowingPage(nextPage);
    fetchFollowing(nextPage, true);
  }, [followingPage, isLoadingMore, hasMoreFollowing]);

  useEffect(() => {
    let cancelled = false;
    if (!walletAddress) return;
    
    // Reset pagination when wallet address changes
    setFollowersPage(1);
    setFollowingPage(1);
    setHasMoreFollowers(true);
    setHasMoreFollowing(true);
    
    // Fetch initial data
    fetchBasicStats();
    fetchFollowers(1);
    fetchFollowing(1);
    
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
        setTimeout(() => {
          fetchBasicStats();
          fetchFollowers(1);
          fetchFollowing(1);
        }, 1000);
      });
    } catch (error) {
      throw error;
    }
  };

  return { 
    ...stats, 
    loading, 
    followersList,
    followingList,
    followAddress,
    isFollowing,
    refreshData: fetchBasicStats,
    friends,
    isProcessing,
    loadMoreFollowers,
    loadMoreFollowing,
    hasMoreFollowers,
    hasMoreFollowing,
    isLoadingMore
  };
}
