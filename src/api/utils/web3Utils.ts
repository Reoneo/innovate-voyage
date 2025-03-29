
import { Web3BioProfile } from '../types/web3Types';
import { delay } from '../jobsApi';

// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Function to fetch profile from Web3.bio API
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  try {
    // Determine the right endpoint based on the domain type (.eth or .box)
    let endpoint;
    
    if (identity.includes('.box')) {
      // For .box domains, use the ens endpoint but with the .box domain
      // This works because web3.bio API supports .box domains through the ens endpoint
      endpoint = `https://api.web3.bio/profile/ens/${identity}`;
      console.log(`Fetching .box domain profile via ENS endpoint: ${identity}`);
    } else if (identity.includes('.eth')) {
      endpoint = `https://api.web3.bio/profile/ens/${identity}`;
      console.log(`Fetching .eth domain profile: ${identity}`);
    } else if (!identity.includes('.') && identity.startsWith('0x')) {
      endpoint = `https://api.web3.bio/profile/eth/${identity}`;
      console.log(`Fetching address profile: ${identity}`);
    } else {
      // Try with ENS endpoint as a fallback
      endpoint = `https://api.web3.bio/profile/ens/${identity}`;
    }
    
    console.log(`Fetching profile for ${identity} from ${endpoint}`);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${identity}: Status ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Check if we got a valid response
    if (data && data.identity) {
      // Format response to match our internal Web3BioProfile structure
      const profile: Web3BioProfile = {
        address: data.address || '',
        identity: data.identity || identity,
        platform: data.platform || 'ens',
        displayName: data.displayName || identity,
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
      if (profile.avatar && identity) {
        avatarCache[identity] = profile.avatar;
      }
      
      return profile;
    } else if (Array.isArray(data) && data.length > 0) {
      // Handle array response format
      const firstProfile = data[0];
      
      const profile: Web3BioProfile = {
        address: firstProfile.address || '',
        identity: firstProfile.identity || identity,
        platform: firstProfile.platform || 'ens',
        displayName: firstProfile.display_name || firstProfile.displayName || identity,
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
      
      if (profile.avatar && identity) {
        avatarCache[identity] = profile.avatar;
      }
      
      return profile;
    } else if (data.error) {
      console.warn(`Web3.bio error for ${identity}:`, data.error);
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
