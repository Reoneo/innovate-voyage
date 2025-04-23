
import { useEffect, useState } from "react";

export interface EfpStats {
  following: number;
  followers: number;
  followingList?: Array<{address: string, ensName?: string, avatar?: string}>;
  followersList?: Array<{address: string, ensName?: string, avatar?: string}>;
}

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    
    // This would be replaced with real API call in production
    // For demo, we'll generate mock data
    setTimeout(() => {
      // Mock data for demonstration purposes
      const mockFollowers = [
        { address: "0x123...456", ensName: "alice.eth", avatar: "https://effigy.im/a/0x123456.svg" },
        { address: "0x789...012", ensName: "bob.eth", avatar: "https://effigy.im/a/0x789012.svg" },
        { address: "0x345...678", ensName: "charlie.eth", avatar: "https://effigy.im/a/0x345678.svg" },
      ];
      
      const mockFollowing = [
        { address: "0xabc...def", ensName: "dave.eth", avatar: "https://effigy.im/a/0xabcdef.svg" },
        { address: "0xghi...jkl", ensName: "eve.eth", avatar: "https://effigy.im/a/0xghijkl.svg" },
      ];
      
      setStats({ 
        followers: mockFollowers.length, 
        following: mockFollowing.length,
        followersList: mockFollowers,
        followingList: mockFollowing 
      });
      setLoading(false);
    }, 300);
  }, [walletAddress]);

  return { ...stats, loading };
}
