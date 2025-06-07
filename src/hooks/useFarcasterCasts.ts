
import { useState, useEffect } from 'react';

interface FarcasterCast {
  hash: string;
  fid: number;
  ts: number;
  text: string;
  embed?: any;
  replies: number;
  recasts: number;
  reactions: number;
}

interface FarcasterUser {
  fid: number;
  username: string;
  address: string;
  displayName: string;
  pfp: string;
}

export const useFarcasterCasts = (username: string | undefined) => {
  const [casts, setCasts] = useState<FarcasterCast[]>([]);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setCasts([]);
      setUser(null);
      return;
    }

    const fetchFarcasterData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get FID from username
        const userResponse = await fetch(`https://api.farcaster.xyz/v2/user/byusername?username=${username}`);
        if (!userResponse.ok) {
          throw new Error('User not found');
        }
        
        const userData = await userResponse.json();
        const userInfo = userData.user;
        setUser(userInfo);

        // Get casts from FID
        const castsResponse = await fetch(`https://api.farcaster.xyz/v2/casts?fid=${userInfo.fid}&limit=10`);
        if (!castsResponse.ok) {
          throw new Error('Failed to fetch casts');
        }
        
        const castsData = await castsResponse.json();
        setCasts(castsData.casts || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Farcaster data');
        setCasts([]);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFarcasterData();
  }, [username]);

  return { casts, user, loading, error };
};
