
import { Web3BioProfile } from '../types/web3Types';
import { delay } from '../jobsApi';

// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Function to fetch profile from Web3.bio API
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  try {
    const response = await fetch(`https://api.web3.bio/profile/ens/${identity}`);
    if (!response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${identity}`);
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
