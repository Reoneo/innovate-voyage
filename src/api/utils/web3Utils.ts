
import { Web3BioProfile } from '../types/web3Types';
import { delay } from '../jobsApi';

// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Cache for storing resolved address to reduce API calls
export const addressCache: Record<string, string> = {};

// Cache for storing resolved domain to reduce API calls
export const domainCache: Record<string, string> = {};

// TTL for cache in milliseconds (30 minutes)
const CACHE_TTL = 30 * 60 * 1000;

// Cache timestamps for invalidation
const cacheTimestamps: Record<string, number> = {};

/**
 * Normalize ENS input to ensure consistent format
 */
export function normalizeIdentity(identity: string): string {
  if (!identity) return '';
  
  // Ethereum address
  if (identity.startsWith('0x') && identity.length === 42) {
    return identity.toLowerCase();
  }
  
  // If no extension, add .eth
  if (!identity.includes('.')) {
    return `${identity}.eth`;
  }
  
  return identity.toLowerCase();
}

/**
 * Function to fetch profile from Web3.bio API with improved caching
 */
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  if (!identity) return null;
  
  // Normalize the identity parameter
  const normalizedIdentity = normalizeIdentity(identity);
  
  // Check cache with TTL
  const cacheKey = `web3bio:${normalizedIdentity}`;
  const cachedProfile = sessionStorage.getItem(cacheKey);
  const timestamp = cacheTimestamps[cacheKey];
  
  if (cachedProfile && timestamp && Date.now() - timestamp < CACHE_TTL) {
    console.log(`Using cached Web3.bio profile for ${normalizedIdentity}`);
    try {
      return JSON.parse(cachedProfile) as Web3BioProfile;
    } catch (error) {
      // If parse error, continue to fetch fresh data
    }
  }
  
  try {
    // Determine the correct endpoint based on the identity type
    let endpoint;
    
    if (normalizedIdentity.startsWith('0x')) {
      endpoint = `https://api.web3.bio/profile/eth/${normalizedIdentity}`;
      console.log(`Fetching address profile: ${normalizedIdentity}`);
    } else if (normalizedIdentity.endsWith('.eth') || normalizedIdentity.endsWith('.box')) {
      // For both .box and .eth domains, use the ens endpoint
      endpoint = `https://api.web3.bio/profile/ens/${normalizedIdentity}`;
      console.log(`Fetching domain profile: ${normalizedIdentity}`);
    } else {
      // Fallback to ENS endpoint with .eth suffix
      const ensName = `${normalizedIdentity}.eth`;
      endpoint = `https://api.web3.bio/profile/ens/${ensName}`;
      console.log(`Fallback: Fetching profile for ${ensName}`);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to fetch Web3.bio profile for ${normalizedIdentity}: Status ${response.status}`, errorText);
      return null;
    }
    
    const data = await response.json();
    
    // Process the response data
    let profile: Web3BioProfile | null = null;
    
    if (data && data.identity) {
      // Single profile response
      profile = processWeb3BioResponse(data, normalizedIdentity);
    } else if (Array.isArray(data) && data.length > 0) {
      // Array response format
      profile = processWeb3BioResponse(data[0], normalizedIdentity);
    } else if (data.error) {
      console.warn(`Web3.bio error for ${normalizedIdentity}:`, data.error);
      return null;
    }
    
    // Cache successful profile response
    if (profile) {
      sessionStorage.setItem(cacheKey, JSON.stringify(profile));
      cacheTimestamps[cacheKey] = Date.now();
      
      // Cache avatar if available
      if (profile.avatar) {
        avatarCache[normalizedIdentity] = profile.avatar;
      }
      
      // Cache address resolution
      if (profile.address && !normalizedIdentity.startsWith('0x')) {
        addressCache[normalizedIdentity] = profile.address;
        domainCache[profile.address.toLowerCase()] = normalizedIdentity;
      }
    }
    
    return profile;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Timeout fetching Web3.bio profile for ${identity}`);
    } else {
      console.error(`Error fetching Web3.bio profile for ${identity}:`, error);
    }
    return null;
  }
}

/**
 * Helper function to process Web3.bio API response into standardized format
 */
function processWeb3BioResponse(data: any, identity: string): Web3BioProfile {
  const profile: Web3BioProfile = {
    address: data.address || '',
    identity: data.identity || identity,
    platform: data.platform || 'ens',
    displayName: data.displayName || data.display_name || identity,
    avatar: data.avatar || null,
    description: data.description || null,
    status: data.status || null,
    email: data.email || null,
    location: data.location || null,
    header: data.header || null,
    contenthash: data.contenthash || null
  };
  
  // Extract social links from links object if available
  if (data.links) {
    const socialMap: Record<string, string> = {
      'github': 'github',
      'twitter': 'twitter',
      'linkedin': 'linkedin',
      'website': 'website',
      'facebook': 'facebook',
      'whatsapp': 'whatsapp',
      'bluesky': 'bluesky',
      'instagram': 'instagram',
      'youtube': 'youtube',
      'discord': 'discord',
      'telegram': 'telegram',
      'reddit': 'reddit',
    };
    
    Object.entries(data.links).forEach(([platform, linkData]: [string, any]) => {
      if (platform in socialMap && linkData?.link) {
        const key = socialMap[platform];
        profile[key as keyof Web3BioProfile] = linkData.link;
      }
    });
  }
  
  return profile;
}

// Generate a fallback avatar URL
export function generateFallbackAvatar() {
  const fallbackIdx = Math.floor(Math.random() * 30) + 1;
  return `https://i.pravatar.cc/300?img=${fallbackIdx}`;
}

// Clear caches
export function clearWeb3BioCache() {
  Object.keys(avatarCache).forEach(key => delete avatarCache[key]);
  Object.keys(addressCache).forEach(key => delete addressCache[key]);
  Object.keys(domainCache).forEach(key => delete domainCache[key]);
  Object.keys(cacheTimestamps).forEach(key => delete cacheTimestamps[key]);
  
  // Clear session storage cache
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('web3bio:')) {
      sessionStorage.removeItem(key);
    }
  });
}
