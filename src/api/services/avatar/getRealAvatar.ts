
import { avatarCache, generateFallbackAvatar } from '../../utils/web3/index';
import { handleEip155Avatar } from './utils/eip155Handler';
import { handleEnsAvatar } from './utils/ensAvatarHandler';
import { handleDotBoxAvatar } from './utils/dotBoxHandler';
import { handleIpfsUri } from './utils/ipfsHandler';
import { handleDirectImageUrl } from './utils/directImageHandler';
import { generateDeterministicAvatar } from './utils/fallbackAvatarHandler';

// In-memory cache for avatar URLs to avoid repeated lookups
const localAvatarCache: Record<string, string> = {};

/**
 * Get real avatar for any domain type using multiple sources
 * @param identity The ENS name, address, or other web3 identity
 * @returns A URL to the avatar image or null
 */
export async function getRealAvatar(identity: string): Promise<string | null> {
  if (!identity) return null;
  
  // Check local cache first
  if (identity in localAvatarCache) {
    return localAvatarCache[identity];
  }
  
  // Check global cache
  if (avatarCache[identity]) {
    localAvatarCache[identity] = avatarCache[identity];
    return avatarCache[identity];
  }
  
  // If not in cache, fetch using various methods
  try {
    console.log(`Fetching avatar for ${identity}`);
    
    // First try the official ENS metadata service
    try {
      const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
      const metadataResponse = await fetch(metadataUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      });
      
      if (metadataResponse.ok) {
        console.log(`Found avatar via ENS metadata service for ${identity}`);
        localAvatarCache[identity] = metadataUrl;
        avatarCache[identity] = metadataUrl;
        return metadataUrl;
      }
    } catch (metadataError) {
      console.warn(`Error fetching from ENS metadata for ${identity}:`, metadataError);
    }
    
    // Try avatar.ens.domains
    try {
      const ensAvatarUrl = `https://avatar.ens.domains/${identity}`;
      const ensAvatarResponse = await fetch(ensAvatarUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(2000) 
      });
      if (ensAvatarResponse.ok) {
        console.log(`Found avatar via ENS Avatar API for ${identity}`);
        localAvatarCache[identity] = ensAvatarUrl;
        avatarCache[identity] = ensAvatarUrl;
        return ensAvatarUrl;
      }
    } catch (ensAvatarError) {
      console.warn(`Error fetching from ENS Avatar API for ${identity}:`, ensAvatarError);
    }
    
    // Handle EIP155 formatted avatar URIs
    if (identity.startsWith('eip155:1/erc721:')) {
      const eip155Avatar = await handleEip155Avatar(identity);
      if (eip155Avatar) {
        localAvatarCache[identity] = eip155Avatar;
        avatarCache[identity] = eip155Avatar;
        return eip155Avatar;
      }
    }
    
    // If it's an ENS name, try dedicated handler
    if (identity.endsWith('.eth')) {
      const ensAvatar = await handleEnsAvatar(identity);
      if (ensAvatar) {
        localAvatarCache[identity] = ensAvatar;
        avatarCache[identity] = ensAvatar;
        return ensAvatar;
      }
    }
    
    // For .box domains, try specific approach
    if (identity.endsWith('.box')) {
      const boxAvatar = await handleDotBoxAvatar(identity);
      if (boxAvatar) {
        localAvatarCache[identity] = boxAvatar;
        avatarCache[identity] = boxAvatar;
        return boxAvatar;
      }
    }
    
    // Try to resolve IPFS URIs
    const ipfsAvatar = await handleIpfsUri(identity);
    if (ipfsAvatar) {
        localAvatarCache[identity] = ipfsAvatar;
        avatarCache[identity] = ipfsAvatar;
        return ipfsAvatar;
    }
    
    // Check if the identity is a direct URL to an image
    const directImageUrl = handleDirectImageUrl(identity);
    if (directImageUrl) {
        localAvatarCache[identity] = directImageUrl;
        avatarCache[identity] = directImageUrl;
        return directImageUrl;
    }
    
    // Generate a deterministic fallback avatar
    const fallbackAvatar = generateDeterministicAvatar(identity);
    localAvatarCache[identity] = fallbackAvatar;
    avatarCache[identity] = fallbackAvatar;
    return fallbackAvatar;
  } catch (error) {
    console.error(`Error fetching avatar for ${identity}:`, error);
    
    // Return fallback avatar
    const fallback = generateFallbackAvatar();
    localAvatarCache[identity] = fallback;
    return fallback;
  }
}
