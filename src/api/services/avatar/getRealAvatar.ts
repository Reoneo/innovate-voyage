
import { avatarCache, fetchWeb3BioProfile, generateFallbackAvatar } from '../../utils/web3/index';
import { handleEip155Avatar } from './utils/eip155Handler';
import { handleEnsAvatar } from './utils/ensAvatarHandler';
import { handleDotBoxAvatar } from './utils/dotBoxHandler';
import { handleIpfsUri } from './utils/ipfsHandler';
import { handleDirectImageUrl } from './utils/directImageHandler';
import { generateDeterministicAvatar } from './utils/fallbackAvatarHandler';

/**
 * Get real avatar for any domain type using multiple sources
 * @param identity The ENS name, address, or other web3 identity
 * @returns A URL to the avatar image or null
 */
export async function getRealAvatar(identity: string): Promise<string | null> {
  if (!identity) return null;
  
  // Check cache first
  if (avatarCache[identity]) {
    return avatarCache[identity];
  }
  
  // Special case for Avatar.ens - return the specific imgur URL
  if (identity.toLowerCase() === 'avatar.ens') {
    const avatarUrl = 'https://i.imgur.com/peeNEGL.png';
    avatarCache[identity] = avatarUrl;
    return avatarUrl;
  }
  
  // If not in cache, fetch from API
  try {
    console.log(`Fetching avatar for ${identity}`);
    
    // First try the gskril/ens-api (most reliable source)
    try {
      const ensApiResponse = await fetch(`https://ens-api.vercel.app/api/${identity}`);
      if (ensApiResponse.ok) {
        const ensApiData = await ensApiResponse.json();
        if (ensApiData && ensApiData.avatar) {
          console.log(`Found avatar via gskril/ens-api for ${identity}: ${ensApiData.avatar}`);
          avatarCache[identity] = ensApiData.avatar;
          return ensApiData.avatar;
        }
      }
    } catch (ensApiError) {
      console.error(`Error fetching from gskril/ens-api for ${identity}:`, ensApiError);
    }
    
    // Try metadata.ens.domains (official ENS service)
    try {
      const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
      const metadataResponse = await fetch(metadataUrl, { method: 'HEAD' });
      
      if (metadataResponse.ok) {
        console.log(`Found avatar via ENS metadata service for ${identity}`);
        avatarCache[identity] = metadataUrl;
        return metadataUrl;
      }
    } catch (metadataError) {
      console.error(`Error fetching from ENS metadata for ${identity}:`, metadataError);
    }
    
    // Handle EIP155 formatted avatar URIs
    if (identity.startsWith('eip155:1/erc721:')) {
      const eip155Avatar = await handleEip155Avatar(identity);
      if (eip155Avatar) return eip155Avatar;
    }
    
    // If it's an ENS name, try multiple sources
    if (identity.endsWith('.eth')) {
      const ensAvatar = await handleEnsAvatar(identity);
      if (ensAvatar) return ensAvatar;
    }
    
    // For .box domains, try specific approach
    if (identity.endsWith('.box')) {
      const boxAvatar = await handleDotBoxAvatar(identity);
      if (boxAvatar) return boxAvatar;
    }
    
    // Try Web3Bio API as a fallback - works for all domain types
    const profile = await fetchWeb3BioProfile(identity);
    if (profile && profile.avatar) {
      console.log(`Found avatar via Web3.bio for ${identity}`);
      avatarCache[identity] = profile.avatar;
      return profile.avatar;
    }
    
    // Try to resolve IPFS URIs
    const ipfsAvatar = await handleIpfsUri(identity);
    if (ipfsAvatar) return ipfsAvatar;
    
    // Check if the identity is a direct URL to an image
    const directImageUrl = handleDirectImageUrl(identity);
    if (directImageUrl) return directImageUrl;
    
    // Generate a deterministic fallback avatar
    return generateDeterministicAvatar(identity);
  } catch (error) {
    console.error(`Error fetching avatar for ${identity}:`, error);
    return generateFallbackAvatar();
  }
}
