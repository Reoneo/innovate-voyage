
import { useState, useEffect } from 'react';
import { useProfile } from '@farcaster/auth-kit';
import { toast } from 'sonner';

interface FarcasterCast {
  hash: string;
  text: string;
  timestamp: string;
  author: {
    username: string;
    displayName: string;
    pfp: {
      url: string;
    };
    fid: number;
  };
  replies: {
    count: number;
  };
  reactions: {
    likes: {
      count: number;
    };
    recasts: {
      count: number;
    };
  };
  embeds?: Array<{
    url?: string;
    metadata?: {
      content_type?: string;
      content_length?: number;
    };
  }>;
}

interface FarcasterProfile {
  fid: number;
  username: string;
  displayName: string;
  pfp: {
    url: string;
  };
  followerCount: number;
  followingCount: number;
  verifications: string[];
}

export function useFarcasterCasts(ensName?: string, address?: string) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<FarcasterProfile | null>(null);
  const [casts, setCasts] = useState<FarcasterCast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, profile: authProfile } = useProfile();

  useEffect(() => {
    if (!ensName && !address) {
      console.log('No ENS name or address provided to useFarcasterCasts');
      return;
    }

    const fetchFarcasterData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching Farcaster data for:', ensName || address);
        
        // If user is authenticated with Farcaster and this is their profile, use auth data
        if (isAuthenticated && authProfile && (
          authProfile.username === ensName?.replace('.eth', '') ||
          ensName === `${authProfile.username}.eth`
        )) {
          console.log('Using authenticated Farcaster profile data');
          setProfile({
            fid: authProfile.fid,
            username: authProfile.username,
            displayName: authProfile.displayName || authProfile.username,
            pfp: { url: authProfile.pfpUrl || '' },
            followerCount: 0,
            followingCount: 0,
            verifications: []
          });
          
          // Fetch casts for authenticated user
          const castsUrl = `https://api.neynar.com/v2/farcaster/casts?fid=${authProfile.fid}&limit=10`;
          
          const castsResponse = await fetch(castsUrl, {
            headers: {
              'Accept': 'application/json',
            }
          });

          if (castsResponse.ok) {
            const castsData = await castsResponse.json();
            setCasts(castsData.result?.casts || []);
            console.log(`Found ${castsData.result?.casts?.length || 0} Farcaster casts`);
          }
          return;
        }
        
        // Use Neynar API (free tier) to fetch Farcaster data for other users
        const searchParam = ensName || address;
        const profileUrl = `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(searchParam)}&limit=1`;
        
        const profileResponse = await fetch(profileUrl, {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch Farcaster profile: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        
        if (profileData.result?.users?.length > 0) {
          const user = profileData.result.users[0];
          setProfile(user);
          
          // Fetch user's casts
          const castsUrl = `https://api.neynar.com/v2/farcaster/casts?fid=${user.fid}&limit=10`;
          
          const castsResponse = await fetch(castsUrl, {
            headers: {
              'Accept': 'application/json',
            }
          });

          if (castsResponse.ok) {
            const castsData = await castsResponse.json();
            setCasts(castsData.result?.casts || []);
            console.log(`Found ${castsData.result?.casts?.length || 0} Farcaster casts`);
          }
        } else {
          console.log('No Farcaster profile found for:', searchParam);
          setProfile(null);
          setCasts([]);
        }
      } catch (err) {
        console.error('Error fetching Farcaster data:', err);
        setError('Failed to fetch Farcaster data');
        setProfile(null);
        setCasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFarcasterData();
  }, [ensName, address, isAuthenticated, authProfile]);

  return {
    loading,
    profile,
    casts,
    error,
    hasFarcasterData: !!profile,
    isAuthenticatedUser: isAuthenticated && authProfile && (
      authProfile.username === ensName?.replace('.eth', '') ||
      ensName === `${authProfile.username}.eth`
    )
  };
}
