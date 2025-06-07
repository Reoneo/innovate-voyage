
import { useState, useEffect } from 'react';
import { useProfile } from '@farcaster/auth-kit';

interface FarcasterCast {
  hash: string;
  text: string;
  ts: number;
  fid: number;
  embed?: {
    url?: string;
    metadata?: {
      content_type?: string;
      content_length?: number;
    };
  };
  replies?: number;
  recasts?: number;
  reactions?: number;
}

interface FarcasterProfile {
  fid: number;
  username: string;
  displayName: string;
  pfp?: string;
  followerCount?: number;
  followingCount?: number;
  verifications?: string[];
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
            pfp: authProfile.pfpUrl || '',
            followerCount: 0,
            followingCount: 0,
            verifications: []
          });
          
          // Fetch casts for authenticated user
          const castsResponse = await fetch(`https://api.farcaster.xyz/v2/casts?fid=${authProfile.fid}&limit=10`);

          if (castsResponse.ok) {
            const castsData = await castsResponse.json();
            setCasts(castsData.casts || []);
            console.log(`Found ${castsData.casts?.length || 0} Farcaster casts`);
          }
          return;
        }
        
        // Use Farcaster API to fetch data for other users
        const searchParam = ensName || address;
        let username = searchParam;
        
        // Extract username from ENS name
        if (ensName && ensName.includes('.')) {
          username = ensName.replace('.eth', '').replace('.box', '');
        }
        
        console.log('Looking up Farcaster user:', username);
        
        // Get user by username
        const profileResponse = await fetch(`https://api.farcaster.xyz/v2/user/byusername?username=${username}`);

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          
          if (profileData.user) {
            const user = profileData.user;
            setProfile({
              fid: user.fid,
              username: user.username,
              displayName: user.displayName || user.username,
              pfp: user.pfp,
              followerCount: user.followerCount || 0,
              followingCount: user.followingCount || 0,
              verifications: user.verifications || []
            });
            
            // Fetch user's casts
            const castsResponse = await fetch(`https://api.farcaster.xyz/v2/casts?fid=${user.fid}&limit=10`);

            if (castsResponse.ok) {
              const castsData = await castsResponse.json();
              setCasts(castsData.casts || []);
              console.log(`Found ${castsData.casts?.length || 0} Farcaster casts`);
            }
          } else {
            console.log('No Farcaster profile found for:', username);
            setProfile(null);
            setCasts([]);
          }
        } else {
          console.log('Farcaster API error:', profileResponse.status);
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
