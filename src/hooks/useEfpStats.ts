
import { useEffect, useState } from "react";

export interface EfpStats {
  following: number;
  followers: number;
}

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    // EXAMPLE: Replace with actual fetch, use 0s as placeholder
    // Simulate fetch of EFP followers/following (mock for now)
    setTimeout(() => {
      setStats({ followers: 0, following: 0 });
      setLoading(false);
    }, 300); // Fast mock
  }, [walletAddress]);

  return { ...stats, loading };
}
