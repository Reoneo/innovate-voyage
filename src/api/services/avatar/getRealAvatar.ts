
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
  
  // Check cache first for instant loading
  if (avatarCache[identity]) {
    console.log(`Avatar cache hit for ${identity}`);
    return avatarCache[identity];
  }
  
  try {
    console.log(`Fetching avatar for ${identity}`);
    
    // For ENS names (.eth), prioritize the fast ENS metadata service
    if (identity.endsWith('.eth')) {
      const ensAvatar = await handleEnsAvatar(identity);
      if (ensAvatar) return ensAvatar;
    }
    
    // For .box domains, use specific approach
    if (identity.endsWith('.box')) {
      const boxAvatar = await handleDotBoxAvatar(identity);
      if (boxAvatar) return boxAvatar;
    }
    
    // Handle EIP155 formatted avatar URIs
    if (identity.startsWith('eip155:1/erc721:')) {
      const eip155Avatar = await handleEip155Avatar(identity);
      if (eip155Avatar) return eip155Avatar;
    }
    
    // Try the fast ENS metadata service for any identity that might be an ENS name
    if (identity.includes('.')) {
      try {
        const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
        const metadataResponse = await fetch(metadataUrl, { 
          method: 'HEAD',
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'max-age=300'
          }
        });
        
        if (metadataResponse.ok) {
          console.log(`Found avatar via ENS metadata service for ${identity}`);
          avatarCache[identity] = metadataUrl;
          return metadataUrl;
        }
      } catch (metadataError) {
        console.error(`Error fetching from ENS metadata for ${identity}:`, metadataError);
      }
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
