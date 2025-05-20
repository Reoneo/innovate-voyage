
import { avatarCache } from '../../../utils/web3/index';

/**
 * Handle ENS domain avatars through multiple sources
 * @param identity ENS domain name
 * @returns Avatar URL or null if not found
 */
export async function handleEnsAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching ENS avatar for ${identity}`);
    
    // Try the ENS metadata service first (most reliable source)
    const metadataAvatar = await tryEnsMetadataService(identity);
    if (metadataAvatar) return metadataAvatar;
    
    // Try the official ENS Avatar API
    const ensAvatarApiResult = await tryEnsAvatarApi(identity);
    if (ensAvatarApiResult) return ensAvatarApiResult;
    
    // Try the Ethereum Avatar Service if all else fails
    const ethAvatarServiceResult = await tryEthAvatarService(identity);
    if (ethAvatarServiceResult) return ethAvatarServiceResult;
    
    // Try generic robohash as last resort
    const fallbackUrl = `https://robohash.org/${identity}?set=set4`;
    avatarCache[identity] = fallbackUrl;
    return fallbackUrl;
  } catch (error) {
    console.error(`Error handling ENS avatar for ${identity}:`, error);
    return null;
  }
}

/**
 * Try the ENS metadata service - official and most up-to-date
 */
async function tryEnsMetadataService(ensName: string): Promise<string | null> {
  try {
    // This URL returns the avatar directly, not JSON
    const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
    const metadataResponse = await fetch(metadataUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(2000),
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (metadataResponse.ok) {
      console.log(`Found avatar via ENS metadata for ${ensName}`);
      avatarCache[ensName] = metadataUrl;
      return metadataUrl;
    }
  } catch (ensError) {
    console.warn(`Error fetching ENS avatar from metadata service for ${ensName}:`, ensError);
  }
  return null;
}

/**
 * Try the Ethereum Avatar Service
 */
async function tryEthAvatarService(ensName: string): Promise<string | null> {
  try {
    const ethAvatarUrl = `https://eth-avatar-api.herokuapp.com/${ensName}`;
    const ethAvatarResponse = await fetch(ethAvatarUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(2000) 
    });
    if (ethAvatarResponse.ok) {
      console.log(`Found avatar via Ethereum Avatar Service for ${ensName}`);
      avatarCache[ensName] = ethAvatarUrl;
      return ethAvatarUrl;
    }
  } catch (ethAvatarError) {
    console.warn(`Error fetching from Ethereum Avatar Service for ${ensName}:`, ethAvatarError);
  }
  return null;
}

/**
 * Try the official ENS Avatar API
 */
async function tryEnsAvatarApi(ensName: string): Promise<string | null> {
  try {
    const ensAvatarUrl = `https://avatar.ens.domains/${ensName}`;
    const ensAvatarResponse = await fetch(ensAvatarUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(2000) 
    });
    if (ensAvatarResponse.ok) {
      console.log(`Found avatar via ENS Avatar API for ${ensName}`);
      avatarCache[ensName] = ensAvatarUrl;
      return ensAvatarUrl;
    }
  } catch (ensAvatarError) {
    console.warn(`Error fetching from ENS Avatar API for ${ensName}:`, ensAvatarError);
  }
  return null;
}
