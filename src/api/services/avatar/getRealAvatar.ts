
import { avatarCache, generateFallbackAvatar } from '../../utils/web3/index';
import { getEnsAvatarUrl } from '../ens/ensApiClient';
import { handleEip155Avatar } from './utils/eip155Handler';
import { handleIpfsUri } from './utils/ipfsHandler';
import { handleDirectImageUrl } from './utils/directImageHandler';
import { generateDeterministicAvatar } from './utils/fallbackAvatarHandler';

/**
 * Get real avatar for any domain type using ENS API
 * @param identity The ENS name, address, or other web3 identity
 * @returns A URL to the avatar image or null
 */
export async function getRealAvatar(identity: string): Promise<string | null> {
  if (!identity) return null;
  
  // Check cache first
  if (avatarCache[identity]) {
    return avatarCache[identity];
  }
  
  // If not in cache, fetch from API
  try {
    console.log(`Fetching avatar for ${identity}`);
    
    // Handle EIP155 formatted avatar URIs
    if (identity.startsWith('eip155:1/erc721:')) {
      const eip155Avatar = await handleEip155Avatar(identity);
      if (eip155Avatar) {
        avatarCache[identity] = eip155Avatar;
        return eip155Avatar;
      }
    }
    
    // If it's an ENS name, use ENS API
    if (identity.endsWith('.eth') || identity.endsWith('.box')) {
      const avatar = await getEnsAvatarUrl(identity);
      if (avatar) {
        console.log(`Found avatar via ENS API for ${identity}`);
        avatarCache[identity] = avatar;
        return avatar;
      }
    }
    
    // Try to resolve IPFS URIs
    const ipfsAvatar = await handleIpfsUri(identity);
    if (ipfsAvatar) {
      avatarCache[identity] = ipfsAvatar;
      return ipfsAvatar;
    }
    
    // Check if the identity is a direct URL to an image
    const directImageUrl = handleDirectImageUrl(identity);
    if (directImageUrl) {
      avatarCache[identity] = directImageUrl;
      return directImageUrl;
    }
    
    // Generate a deterministic fallback avatar
    return generateDeterministicAvatar(identity);
  } catch (error) {
    console.error(`Error fetching avatar for ${identity}:`, error);
    return generateFallbackAvatar();
  }
}
