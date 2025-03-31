import { Web3BioProfile } from '../types/web3Types';
import { delay } from '../jobsApi';

// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Function to fetch profile from Web3.bio API
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  if (!identity) return null;
  
  try {
    // Normalize the identity parameter - add .eth if no extension is present
    let normalizedIdentity = identity;
    if (!identity.includes('.') && !identity.startsWith('0x')) {
      normalizedIdentity = `${identity}.eth`;
    }
    
    // Determine the right endpoint based on the domain type (.eth or .box)
    let endpoint;
    
    if (normalizedIdentity.includes('.box') || normalizedIdentity.includes('.eth')) {
      // For both .box and .eth domains, use the ens endpoint
      endpoint = `https://api.web3.bio/profile/ens/${normalizedIdentity}`;
      console.log(`Fetching domain profile: ${normalizedIdentity}`);
    } else if (!normalizedIdentity.includes('.') && normalizedIdentity.startsWith('0x')) {
      endpoint = `https://api.web3.bio/profile/eth/${normalizedIdentity}`;
      console.log(`Fetching address profile: ${normalizedIdentity}`);
    } else {
      // Try with ENS endpoint as a fallback
      endpoint = `https://api.web3.bio/profile/ens/${normalizedIdentity}`;
    }
    
    console.log(`Fetching profile for ${normalizedIdentity} from ${endpoint}`);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${normalizedIdentity}: Status ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Check if we got a valid response
    if (data && data.identity) {
      // Format response to match our internal Web3BioProfile structure
      const profile: Web3BioProfile = {
        address: data.address || '',
        identity: data.identity || normalizedIdentity,
        platform: data.platform || 'ens',
        displayName: data.displayName || normalizedIdentity,
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
        if (data.links.github) {
          profile.github = data.links.github.link;
        }
        if (data.links.twitter) {
          profile.twitter = data.links.twitter.link;
        }
        if (data.links.linkedin) {
          profile.linkedin = data.links.linkedin.link;
        }
        if (data.links.website) {
          profile.website = data.links.website.link;
        }
        if (data.links.facebook) {
          profile.facebook = data.links.facebook.link;
        }
        if (data.links.whatsapp) {
          profile.whatsapp = data.links.whatsapp.link;
        }
        if (data.links.bluesky) {
          profile.bluesky = data.links.bluesky.link;
        }
        if (data.links.instagram) {
          profile.instagram = data.links.instagram.link;
        }
        if (data.links.youtube) {
          profile.youtube = data.links.youtube.link;
        }
        if (data.links.discord) {
          profile.discord = data.links.discord.link;
        }
        if (data.links.telegram) {
          profile.telegram = data.links.telegram.link;
        }
        if (data.links.reddit) {
          profile.reddit = data.links.reddit.link;
        }
      }
      
      // Cache the avatar if available
      if (profile.avatar && normalizedIdentity) {
        avatarCache[normalizedIdentity] = profile.avatar;
      }
      
      return profile;
    } else if (Array.isArray(data) && data.length > 0) {
      // Handle array response format
      const firstProfile = data[0];
      
      const profile: Web3BioProfile = {
        address: firstProfile.address || '',
        identity: firstProfile.identity || normalizedIdentity,
        platform: firstProfile.platform || 'ens',
        displayName: firstProfile.display_name || firstProfile.displayName || normalizedIdentity,
        avatar: firstProfile.avatar || null,
        description: firstProfile.description || null
      };
      
      // Extract other fields if present
      if (firstProfile.links) {
        if (firstProfile.links.github) {
          profile.github = firstProfile.links.github.link;
        }
        if (firstProfile.links.twitter) {
          profile.twitter = firstProfile.links.twitter.link;
        }
        if (firstProfile.links.linkedin) {
          profile.linkedin = firstProfile.links.linkedin.link;
        }
        if (firstProfile.links.website) {
          profile.website = firstProfile.links.website.link;
        }
        if (firstProfile.links.facebook) {
          profile.facebook = firstProfile.links.facebook.link;
        }
        if (firstProfile.links.whatsapp) {
          profile.whatsapp = firstProfile.links.whatsapp.link;
        }
        if (firstProfile.links.bluesky) {
          profile.bluesky = firstProfile.links.bluesky.link;
        }
        if (firstProfile.links.instagram) {
          profile.instagram = firstProfile.links.instagram.link;
        }
        if (firstProfile.links.youtube) {
          profile.youtube = firstProfile.links.youtube.link;
        }
        if (firstProfile.links.discord) {
          profile.discord = firstProfile.links.discord.link;
        }
        if (firstProfile.links.telegram) {
          profile.telegram = firstProfile.links.telegram.link;
        }
        if (firstProfile.links.reddit) {
          profile.reddit = firstProfile.links.reddit.link;
        }
      }
      
      if (profile.avatar && normalizedIdentity) {
        avatarCache[normalizedIdentity] = profile.avatar;
      }
      
      return profile;
    } else if (data.error) {
      console.warn(`Web3.bio error for ${normalizedIdentity}:`, data.error);
      return null;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Web3.bio profile for ${identity}:`, error);
    return null;
  }
}

// Generate a fallback avatar URL
export function generateFallbackAvatar() {
  const fallbackIdx = Math.floor(Math.random() * 30) + 1;
  return `https://i.pravatar.cc/300?img=${fallbackIdx}`;
}
