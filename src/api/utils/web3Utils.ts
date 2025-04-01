
import { Web3BioProfile } from '../types/web3Types';
import { delay } from '../jobsApi';

// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Store the API key for web3.bio
const WEB3_BIO_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNDkyNzREIiwiZXhwIjoyMjA1OTExMzI0LCJyb2xlIjo2fQ.dGQ7o_ItgDU8X_MxBlja4in7qvGWtmKXjqhCHq2gX20";

// In-memory cache for Web3.bio profiles
const profileCache: Record<string, Web3BioProfile> = {};

// Rate limiting variables
let lastRequestTime = 0;
const REQUEST_DELAY_MS = 300; // Minimum time between requests

/**
 * Function to determine the endpoint to use based on identity type
 */
function getWeb3BioEndpoint(identity: string): { endpoint: string, type: string } {
  // Normalize the identity
  const normalizedId = identity.toLowerCase().trim();
  
  // Check if this is an Ethereum address (0x...)
  if (normalizedId.startsWith('0x') && normalizedId.length === 42) {
    return { endpoint: `https://api.web3.bio/profile/${normalizedId}`, type: 'address' };
  }
  
  // ENS domains (.eth)
  if (normalizedId.endsWith('.eth')) {
    return { endpoint: `https://api.web3.bio/profile/ens/${normalizedId}`, type: 'ens' };
  }
  
  // Box domains (.box)
  if (normalizedId.endsWith('.box')) {
    return { endpoint: `https://api.web3.bio/profile/dotbit/${normalizedId}`, type: 'box' };
  }
  
  // Base domains (.base.eth)
  if (normalizedId.endsWith('.base.eth')) {
    return { endpoint: `https://api.web3.bio/profile/basenames/${normalizedId}`, type: 'basenames' };
  }
  
  // Linea domains (.linea.eth)
  if (normalizedId.endsWith('.linea.eth')) {
    return { endpoint: `https://api.web3.bio/profile/linea/${normalizedId}`, type: 'linea' };
  }
  
  // Farcaster identities
  if (normalizedId.endsWith('.farcaster') || normalizedId.includes('#')) {
    return { endpoint: `https://api.web3.bio/profile/farcaster/${normalizedId}`, type: 'farcaster' };
  }
  
  // Lens handles
  if (normalizedId.endsWith('.lens')) {
    return { endpoint: `https://api.web3.bio/profile/lens/${normalizedId}`, type: 'lens' };
  }
  
  // Unstoppable domains
  if (normalizedId.endsWith('.crypto') || normalizedId.endsWith('.nft') || 
      normalizedId.endsWith('.blockchain') || normalizedId.endsWith('.x') || 
      normalizedId.endsWith('.wallet') || normalizedId.endsWith('.dao')) {
    return { endpoint: `https://api.web3.bio/profile/unstoppabledomains/${normalizedId}`, type: 'unstoppabledomains' };
  }
  
  // Solana domains
  if (normalizedId.endsWith('.sol')) {
    return { endpoint: `https://api.web3.bio/profile/solana/${normalizedId}`, type: 'solana' };
  }
  
  // .bit domains
  if (normalizedId.endsWith('.bit')) {
    return { endpoint: `https://api.web3.bio/profile/dotbit/${normalizedId}`, type: 'dotbit' };
  }
  
  // If no specific extension but looks like a domain name, treat as ENS
  if (!normalizedId.startsWith('0x') && !normalizedId.includes('.') && /^[a-zA-Z0-9]+$/.test(normalizedId)) {
    return { endpoint: `https://api.web3.bio/profile/ens/${normalizedId}.eth`, type: 'ens' };
  }
  
  // Default to universal endpoint
  return { endpoint: `https://api.web3.bio/profile/${normalizedId}`, type: 'universal' };
}

/**
 * Helper function to enforce rate limiting
 */
async function enforceRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY_MS) {
    const waitTime = REQUEST_DELAY_MS - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

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
    await enforceRateLimit();
    
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

/**
 * Process the web3.bio profile data into our internal format
 */
function processWeb3BioProfileData(data: any, normalizedIdentity: string): Web3BioProfile | null {
  if (!data) return null;
  
  const profile: Web3BioProfile = {
    address: data.address || '',
    identity: data.identity || normalizedIdentity,
    platform: data.platform || 'ens',
    displayName: data.displayName || data.identity || normalizedIdentity,
    avatar: data.avatar || null,
    description: data.description || null,
    status: data.status || null,
    location: data.location || null,
    telephone: data.telephone || null,
    header: data.header || null,
    contenthash: data.contenthash || null,
    github: data.github || null,
    twitter: data.twitter || null,
    linkedin: data.linkedin || null,
    website: data.website || null,
    email: data.email || null,
    facebook: data.facebook || null,
    whatsapp: data.whatsapp || null,
    bluesky: data.bluesky || null,
    discord: data.discord || null,
    links: data.links || {},
    social: data.social || {},
    aliases: data.aliases || []
  };
  
  // Extract social links
  if (data.links) {
    // Process known social platforms
    if (data.links.github?.link) profile.github = data.links.github.link;
    if (data.links.twitter?.link) profile.twitter = data.links.twitter.link;
    if (data.links.linkedin?.link) profile.linkedin = data.links.linkedin.link;
    if (data.links.website?.link) profile.website = data.links.website.link;
    if (data.links.facebook?.link) profile.facebook = data.links.facebook.link;
    if (data.links.whatsapp?.link) profile.whatsapp = data.links.whatsapp.link;
    if (data.links.bluesky?.link) profile.bluesky = data.links.bluesky.link;
    if (data.links.instagram?.link) profile.instagram = data.links.instagram.link;
    if (data.links.youtube?.link) profile.youtube = data.links.youtube.link;
    if (data.links.discord?.link) profile.discord = data.links.discord.link;
    if (data.links.telegram?.link) profile.telegram = data.links.telegram.link;
    if (data.links.reddit?.link) profile.reddit = data.links.reddit.link;
    if (data.links.farcaster?.link) profile.farcaster = data.links.farcaster.link;
    if (data.links.lens?.link) profile.lens = data.links.lens.link;
  }
  
  // Cache the avatar if available
  if (profile.avatar && normalizedIdentity) {
    avatarCache[normalizedIdentity] = profile.avatar;
  }
  
  return profile;
}

// Generate a fallback avatar URL
export function generateFallbackAvatar() {
  const fallbackIdx = Math.floor(Math.random() * 30) + 1;
  return `https://i.pravatar.cc/300?img=${fallbackIdx}`;
}
