
import { Web3BioProfile } from '../../types/web3Types';
import { delay } from '../../jobsApi';
import { getWeb3BioEndpoint } from './endpointResolver';
import { enforceRateLimit } from './rateLimiter';
import { processWeb3BioProfileData } from './profileProcessor';
import { REQUEST_DELAY_MS, WEB3_BIO_API_KEY } from './config';
import { avatarCache, generateFallbackAvatar } from './avatarCache';

// In-memory cache for Web3.bio profiles
const profileCache: Record<string, Web3BioProfile> = {};

// Function to fetch profile from Web3.bio API
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  if (!identity) return null;
  
  // Check cache first
  if (profileCache[identity]) {
    console.log(`Using cached profile for ${identity}`);
    return profileCache[identity];
  }
  
  try {
    // Enforce rate limiting to avoid 429 errors
    await enforceRateLimit(REQUEST_DELAY_MS);
    
    // Normalize the identity parameter
    const normalizedIdentity = identity.toLowerCase().trim();
    
    console.log(`Fetching profile for ${normalizedIdentity}`);
    
    // Determine the right endpoint
    const { endpoint, type } = getWeb3BioEndpoint(normalizedIdentity);
    console.log(`Using endpoint: ${endpoint} (${type})`);
    
    // Add a random query parameter to prevent caching issues
    const noCacheEndpoint = `${endpoint}?nocache=${Date.now()}`;
    
    // Special handling for Farcaster names
    let farcasterProfile = null;
    if (type === 'farcaster' || normalizedIdentity.includes('#')) {
      try {
        // Try to fetch additional Farcaster data directly from the Farcaster API
        const farcasterResponse = await fetch(`https://fnames.farcaster.xyz/transfers?name=${normalizedIdentity.replace('@', '').replace('#', '')}`, {
          cache: 'no-store'
        });
        
        if (farcasterResponse.ok) {
          const farcasterData = await farcasterResponse.json();
          if (farcasterData && farcasterData.transfers && farcasterData.transfers.length > 0) {
            console.log(`Found Farcaster data for ${normalizedIdentity}:`, farcasterData);
            
            // Extract useful information from Farcaster API response
            const latestTransfer = farcasterData.transfers[0];
            farcasterProfile = {
              identity: normalizedIdentity,
              platform: 'farcaster',
              displayName: latestTransfer.username,
              address: latestTransfer.owner,
              avatar: `https://farcaster-profile-images.s3.amazonaws.com/${latestTransfer.to}.png`,
              social: {
                farcaster: `https://warpcast.com/${latestTransfer.username}`
              }
            };
          }
        }
      } catch (farcasterError) {
        console.error(`Error fetching Farcaster data for ${normalizedIdentity}:`, farcasterError);
      }
    }
    
    // Proceed with Web3.bio API call
    const response = await fetch(noCacheEndpoint, {
      headers: {
        'Authorization': `Bearer ${WEB3_BIO_API_KEY}`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${normalizedIdentity}: Status ${response.status}`);
      
      // If rate limited, retry after a delay
      if (response.status === 429) {
        console.log('Rate limited, retrying after delay');
        await delay(2000);
        return fetchWeb3BioProfile(identity);
      }
      
      // If we have Farcaster data, return that instead of failing
      if (farcasterProfile) {
        console.log(`Using Farcaster profile data for ${normalizedIdentity}`);
        profileCache[identity] = farcasterProfile;
        return farcasterProfile;
      }
      
      // Special handling for .box domains
      if (type === 'box' || normalizedIdentity.endsWith('.box')) {
        console.log('Trying alternative approach for .box domain');
        // Try a different endpoint format
        const boxEndpoint = `https://api.web3.bio/profile/dotbit/${normalizedIdentity}?nocache=${Date.now()}`;
        try {
          const boxResponse = await fetch(boxEndpoint, {
            headers: {
              'Authorization': `Bearer ${WEB3_BIO_API_KEY}`,
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (boxResponse.ok) {
            const boxData = await boxResponse.json();
            console.log(`Box domain data for ${normalizedIdentity}:`, boxData);
            const profileData = processWeb3BioProfileData(boxData, normalizedIdentity);
            if (profileData) {
              profileCache[identity] = profileData;
              return profileData;
            }
          } else {
            // If still failing, try universal endpoint as last resort
            const universalEndpoint = `https://api.web3.bio/profile/${normalizedIdentity}?nocache=${Date.now()}`;
            const universalResponse = await fetch(universalEndpoint, {
              headers: {
                'Authorization': `Bearer ${WEB3_BIO_API_KEY}`,
                'Accept': 'application/json'
              }
            });
            
            if (universalResponse.ok) {
              const universalData = await universalResponse.json();
              if (Array.isArray(universalData) && universalData.length > 0) {
                const profileData = processWeb3BioProfileData(universalData[0], normalizedIdentity);
                if (profileData) {
                  profileCache[identity] = profileData;
                  return profileData;
                }
              }
            }
          }
        } catch (boxError) {
          console.error(`Error in box domain fallback for ${normalizedIdentity}:`, boxError);
        }
        
        // If all attempts fail, return a basic profile for .box domains
        const fallbackBoxProfile = {
          address: '',
          identity: normalizedIdentity,
          platform: 'box',
          displayName: normalizedIdentity,
          avatar: 'https://pbs.twimg.com/profile_images/1673978200800473088/96dq4nBA_400x400.png',
          description: `Box domain profile for ${normalizedIdentity}`,
          social: {
            website: `https://${normalizedIdentity}`
          }
        };
        
        profileCache[identity] = fallbackBoxProfile;
        return fallbackBoxProfile;
      }
      
      return null;
    }
    
    const data = await response.json();
    console.log(`Web3.bio data for ${normalizedIdentity}:`, data);
    
    // Handle array response (universal endpoint)
    if (Array.isArray(data)) {
      if (data.length === 0) {
        // If no data but we have Farcaster profile, use that
        if (farcasterProfile) {
          profileCache[identity] = farcasterProfile;
          return farcasterProfile;
        }
        return null;
      }
      
      // Use the first profile with a preference for specific types
      const specificProfile = data.find(p => p.platform === type) || data[0];
      const profileData = processWeb3BioProfileData(specificProfile, normalizedIdentity);
      
      // If this is a Farcaster identity, enhance with any additional data we found
      if (type === 'farcaster' && farcasterProfile && profileData) {
        profileData.social = { ...profileData.social, ...farcasterProfile.social };
        if (!profileData.avatar && farcasterProfile.avatar) {
          profileData.avatar = farcasterProfile.avatar;
        }
      }
      
      // Cache the result
      if (profileData) profileCache[identity] = profileData;
      
      return profileData;
    } 
    // Handle single object response (specific platform endpoint)
    else if (data && typeof data === 'object') {
      if (data.error) {
        console.warn(`Web3.bio error for ${normalizedIdentity}:`, data.error);
        
        // If error but we have Farcaster profile, use that
        if (farcasterProfile) {
          profileCache[identity] = farcasterProfile;
          return farcasterProfile;
        }
        
        return {
          address: '',
          identity: normalizedIdentity,
          platform: type,
          displayName: normalizedIdentity,
          avatar: null,
          description: null,
          error: data.error
        };
      }
      
      const profileData = processWeb3BioProfileData(data, normalizedIdentity);
      
      // If this is a Farcaster identity, enhance with any additional data we found
      if (type === 'farcaster' && farcasterProfile && profileData) {
        profileData.social = { ...profileData.social, ...farcasterProfile.social };
        if (!profileData.avatar && farcasterProfile.avatar) {
          profileData.avatar = farcasterProfile.avatar;
        }
      }
      
      // Cache the result
      if (profileData) profileCache[identity] = profileData;
      
      return profileData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Web3.bio profile for ${identity}:`, error);
    return null;
  }
}
