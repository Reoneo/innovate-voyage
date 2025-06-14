
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
          authProfile.username === ensName?.replace('.eth', '').replace('.box', '') ||
          ensName === `${authProfile.username}.eth` ||
          ensName === `${authProfile.username}.box`
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
        
        // Try multiple search strategies for better user discovery
        const searchQueries = [];
        
        // Add ENS name variations
        if (ensName) {
          searchQueries.push(ensName);
          searchQueries.push(ensName.replace('.eth', '').replace('.box', ''));
          
          // If it's a .box domain, also try without the extension
          if (ensName.endsWith('.box')) {
            searchQueries.push(ensName.replace('.box', ''));
          }
        }
        
        // Add address
        if (address) {
          searchQueries.push(address);
        }
        
        let foundProfile = null;
        
        // Try each search query until we find a profile
        for (const query of searchQueries) {
          try {
            console.log(`Searching Farcaster for: ${query}`);
            
            // Try username search first
            const usernameUrl = `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(query)}&limit=5`;
            
            const usernameResponse = await fetch(usernameUrl, {
              headers: {
                'Accept': 'application/json',
              }
            });

            if (usernameResponse.ok) {
              const usernameData = await usernameResponse.json();
              
              if (usernameData.result?.users?.length > 0) {
                // Look for exact match first
                const exactMatch = usernameData.result.users.find((user: any) => 
                  user.username === query || 
                  user.username === query.replace('.eth', '').replace('.box', '') ||
                  user.verifications?.includes(address)
                );
                
                if (exactMatch) {
                  foundProfile = exactMatch;
                  console.log(`Found exact Farcaster match for ${query}:`, foundProfile);
                  break;
                }
                
                // If no exact match, try first result that has verified addresses
                const verifiedUser = usernameData.result.users.find((user: any) => 
                  user.verifications?.length > 0
                );
                
                if (verifiedUser && !foundProfile) {
                  foundProfile = verifiedUser;
                  console.log(`Found verified Farcaster user for ${query}:`, foundProfile);
                }
              }
            }
            
            // If still no profile found, try bulk user lookup by verification
            if (!foundProfile && address) {
              try {
                const bulkUrl = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`;
                
                const bulkResponse = await fetch(bulkUrl, {
                  headers: {
                    'Accept': 'application/json',
                  }
                });

                if (bulkResponse.ok) {
                  const bulkData = await bulkResponse.json();
                  
                  if (bulkData.result && Object.keys(bulkData.result).length > 0) {
                    const usersByAddress = bulkData.result[address.toLowerCase()];
                    if (usersByAddress && usersByAddress.length > 0) {
                      foundProfile = usersByAddress[0];
                      console.log(`Found Farcaster profile by address verification:`, foundProfile);
                      break;
                    }
                  }
                }
              } catch (bulkError) {
                console.log('Bulk address lookup failed:', bulkError);
              }
            }
            
          } catch (queryError) {
            console.log(`Search failed for ${query}:`, queryError);
            continue;
          }
        }
        
        if (foundProfile) {
          setProfile(foundProfile);
          
          // Fetch user's casts
          const castsUrl = `https://api.neynar.com/v2/farcaster/casts?fid=${foundProfile.fid}&limit=15`;
          
          const castsResponse = await fetch(castsUrl, {
            headers: {
              'Accept': 'application/json',
            }
          });

          if (castsResponse.ok) {
            const castsData = await castsResponse.json();
            setCasts(castsData.result?.casts || []);
            console.log(`Found ${castsData.result?.casts?.length || 0} Farcaster casts for ${foundProfile.username}`);
          }
        } else {
          console.log('No Farcaster profile found for:', ensName || address);
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
      authProfile.username === ensName?.replace('.eth', '').replace('.box', '') ||
      ensName === `${authProfile.username}.eth` ||
      ensName === `${authProfile.username}.box`
    )
  };
}
