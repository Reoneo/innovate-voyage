
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
      
      // Try a fallback approach for .box domains
      if (type === 'box' || normalizedIdentity.endsWith('.box')) {
        console.log('Trying alternative approach for .box domain');
        const fallbackEndpoint = `https://api.web3.bio/profile/${normalizedIdentity}?nocache=${Date.now()}`;
        const fallbackResponse = await fetch(fallbackEndpoint, {
          headers: {
            'Authorization': `Bearer ${WEB3_BIO_API_KEY}`,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          if (Array.isArray(data) && data.length > 0) {
            const profileData = processWeb3BioProfileData(data[0], normalizedIdentity);
            if (profileData) profileCache[identity] = profileData;
            return profileData;
          }
        }
      }
      
      return null;
    }
    
    const data = await response.json();
    console.log(`Web3.bio data for ${normalizedIdentity}:`, data);
    
    // Handle array response (universal endpoint)
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      
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
    return null;
  }
}
