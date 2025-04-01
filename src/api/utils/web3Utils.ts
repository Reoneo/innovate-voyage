
import { Web3BioProfile } from '../types/web3Types';
import { delay } from '../jobsApi';

// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Store the API key for web3.bio
const WEB3_BIO_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNDkyNzREIiwiZXhwIjoyMjA1OTExMzI0LCJyb2xlIjo2fQ.dGQ7o_ItgDU8X_MxBlja4in7qvGWtmKXjqhCHq2gX20";

/**
 * Function to determine the endpoint to use based on identity type
 */
function getWeb3BioEndpoint(identity: string): { endpoint: string, type: string } {
  // Check if this is an Ethereum address (0x...)
  if (identity.startsWith('0x') && identity.length === 42) {
    return { endpoint: `https://api.web3.bio/profile/${identity}`, type: 'address' };
  }
  
  // ENS domains (.eth)
  if (identity.endsWith('.eth')) {
    return { endpoint: `https://api.web3.bio/profile/ens/${identity}`, type: 'ens' };
  }
  
  // Base domains (.base.eth)
  if (identity.endsWith('.base.eth')) {
    return { endpoint: `https://api.web3.bio/profile/basenames/${identity}`, type: 'basenames' };
  }
  
  // Linea domains (.linea.eth)
  if (identity.endsWith('.linea.eth')) {
    return { endpoint: `https://api.web3.bio/profile/linea/${identity}`, type: 'linea' };
  }
  
  // Box domains (.box)
  if (identity.endsWith('.box')) {
    // For .box domains, use the general profile endpoint
    return { endpoint: `https://api.web3.bio/profile/${identity}`, type: 'box' };
  }
  
  // Farcaster identities
  if (identity.endsWith('.farcaster') || identity.includes('#')) {
    return { endpoint: `https://api.web3.bio/profile/farcaster/${identity}`, type: 'farcaster' };
  }
  
  // Lens handles
  if (identity.endsWith('.lens')) {
    return { endpoint: `https://api.web3.bio/profile/lens/${identity}`, type: 'lens' };
  }
  
  // Unstoppable domains
  if (identity.endsWith('.crypto') || identity.endsWith('.nft') || 
      identity.endsWith('.blockchain') || identity.endsWith('.x') || 
      identity.endsWith('.wallet') || identity.endsWith('.dao')) {
    return { endpoint: `https://api.web3.bio/profile/unstoppabledomains/${identity}`, type: 'unstoppabledomains' };
  }
  
  // Solana domains
  if (identity.endsWith('.sol')) {
    return { endpoint: `https://api.web3.bio/profile/solana/${identity}`, type: 'solana' };
  }
  
  // .bit domains
  if (identity.endsWith('.bit')) {
    return { endpoint: `https://api.web3.bio/profile/dotbit/${identity}`, type: 'dotbit' };
  }
  
  // If no specific extension but looks like a domain name, treat as ENS
  if (!identity.startsWith('0x') && !identity.includes('.') && /^[a-zA-Z0-9]+$/.test(identity)) {
    return { endpoint: `https://api.web3.bio/profile/ens/${identity}.eth`, type: 'ens' };
  }
  
  // Default to universal endpoint
  return { endpoint: `https://api.web3.bio/profile/${identity}`, type: 'universal' };
}

// Function to fetch profile from Web3.bio API
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  if (!identity) return null;
  
  try {
    // Normalize the identity parameter if needed
    let normalizedIdentity = identity;
    
    console.log(`Fetching profile for ${normalizedIdentity}`);
    
    // Determine the right endpoint
    const { endpoint, type } = getWeb3BioEndpoint(normalizedIdentity);
    console.log(`Using endpoint: ${endpoint} (${type})`);
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${WEB3_BIO_API_KEY}`
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${normalizedIdentity}: Status ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Web3.bio data for ${normalizedIdentity}:`, data);
    
    // Handle array response (universal endpoint)
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      
      // Use the first profile with a preference for ENS
      const ensProfile = data.find(profile => profile.platform === 'ens');
      const anyProfile = data[0];
      const profileData = ensProfile || anyProfile;
      
      return processWeb3BioProfileData(profileData, normalizedIdentity);
    } 
    // Handle single object response (specific platform endpoint)
    else if (data && typeof data === 'object') {
      if (data.error) {
        console.warn(`Web3.bio error for ${normalizedIdentity}:`, data.error);
        return null;
      }
      
      return processWeb3BioProfileData(data, normalizedIdentity);
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
  if (!data || !data.identity) return null;
  
  const profile: Web3BioProfile = {
    address: data.address || '',
    identity: data.identity || normalizedIdentity,
    platform: data.platform || 'ens',
    displayName: data.displayName || data.identity || normalizedIdentity,
    avatar: data.avatar || null,
    description: data.description || null,
    status: data.status || null,
    email: data.email || null,
    location: data.location || null,
    header: data.header || null,
    contenthash: data.contenthash || null,
    links: data.links || {}
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
  
  // Extract social stats
  if (data.social) {
    profile.social = {
      uid: data.social.uid,
      follower: data.social.follower,
      following: data.social.following
    };
  }
  
  // Extract other identities/aliases
  if (data.aliases) {
    profile.aliases = data.aliases;
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
