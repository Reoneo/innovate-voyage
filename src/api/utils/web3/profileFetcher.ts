
import { Web3BioProfile } from '../../types/web3Types';
import { delay } from '../../jobsApi';
import { getWeb3BioEndpoint } from './endpointResolver';
import { enforceRateLimit } from './rateLimiter';
import { processWeb3BioProfileData } from './profileProcessor';
import { MAX_RETRIES, REQUEST_DELAY_MS, WEB3_BIO_API_KEY } from './config';
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
    
    // Prepare headers with proper authentication
    const headers = {
      'Authorization': `Bearer ${WEB3_BIO_API_KEY}`,
      'X-API-KEY': `Bearer ${WEB3_BIO_API_KEY}`,
      'Accept': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };
    
    // Make the API request with retry logic
    let response = null;
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        response = await fetch(noCacheEndpoint, {
          headers,
          cache: 'no-store'
        });
        
        if (response.ok) break;
        
        console.warn(`Attempt ${retries + 1}/${MAX_RETRIES} failed with status ${response.status}`);
        
        if (response.status === 429) {
          // If rate limited, wait longer before retry
          const waitTime = (retries + 1) * 1000;
          console.log(`Rate limited, waiting ${waitTime}ms before retry`);
          await delay(waitTime);
        } else {
          await delay(REQUEST_DELAY_MS);
        }
        
        retries++;
      } catch (fetchError) {
        console.error(`Fetch error on attempt ${retries + 1}/${MAX_RETRIES}:`, fetchError);
        await delay(REQUEST_DELAY_MS);
        retries++;
      }
    }
    
    // Handle final response
    if (!response || !response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${normalizedIdentity} after ${MAX_RETRIES} attempts`);
      
      // Special handling for .box domains if the dotbit endpoint failed
      if (type === 'dotbit' || normalizedIdentity.endsWith('.box')) {
        console.log('Trying alternate approach for .box domain');
        
        // Try with universal endpoint as fallback
        const universalEndpoint = `https://api.web3.bio/profile/${normalizedIdentity}?nocache=${Date.now()}`;
        try {
          const universalResponse = await fetch(universalEndpoint, { headers });
          
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
        } catch (universalError) {
          console.error(`Error with universal endpoint for ${normalizedIdentity}:`, universalError);
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
        return null;
      }
      
      // Use the first profile with a preference for specific types
      const specificProfile = data.find(p => p.platform === type) || data[0];
      const profileData = processWeb3BioProfileData(specificProfile, normalizedIdentity);
      
      // Cache the result
      if (profileData) profileCache[identity] = profileData;
      
      return profileData;
    } 
    // Handle single object response (specific platform endpoint)
    else if (data && typeof data === 'object') {
      if (data.error) {
        console.warn(`Web3.bio error for ${normalizedIdentity}:`, data.error);
        
        // Special handling for .box domains
        if (normalizedIdentity.endsWith('.box')) {
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
      
      // Cache the result
      if (profileData) profileCache[identity] = profileData;
      
      return profileData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Web3.bio profile for ${identity}:`, error);
    
    // Return a minimal fallback profile for known domain types
    if (identity.endsWith('.box')) {
      const fallbackBoxProfile = {
        address: '',
        identity,
        platform: 'box',
        displayName: identity,
        avatar: 'https://pbs.twimg.com/profile_images/1673978200800473088/96dq4nBA_400x400.png',
        description: `Box domain profile for ${identity}`,
        social: {
          website: `https://${identity}`
        }
      };
      
      profileCache[identity] = fallbackBoxProfile;
      return fallbackBoxProfile;
    }
    
    return null;
  }
}
