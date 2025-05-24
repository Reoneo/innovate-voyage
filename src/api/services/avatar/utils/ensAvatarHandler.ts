
import { avatarCache } from '../../../utils/web3/index';

/**
 * Handle ENS domain avatars through multiple sources
 * @param identity ENS domain name
 * @returns Avatar URL or null if not found
 */
export async function handleEnsAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching ENS avatar for ${identity}`);
    
    // Try the ENS metadata service first (fastest and most reliable)
    const metadataAvatar = await tryEnsMetadataService(identity);
    if (metadataAvatar) return metadataAvatar;
    
    // Try the gskril/ens-api as backup (very reliable)
    const gskrilApiResult = await tryGskrilEnsApi(identity);
    if (gskrilApiResult) return gskrilApiResult;
    
    // Try the official ENS Avatar API
    const ensAvatarApiResult = await tryEnsAvatarApi(identity);
    if (ensAvatarApiResult) return ensAvatarApiResult;
    
    // Try the Ethereum Avatar Service if all else fails
    const ethAvatarServiceResult = await tryEthAvatarService(identity);
    if (ethAvatarServiceResult) return ethAvatarServiceResult;
    
    return null;
  } catch (error) {
    console.error(`Error handling ENS avatar for ${identity}:`, error);
    return null;
  }
}

/**
 * Try the ENS metadata service - official and fastest
 * Uses the URL format: https://metadata.ens.domains/mainnet/avatar/{ensName}
 */
async function tryEnsMetadataService(ensName: string): Promise<string | null> {
  try {
    // Use the fast ENS metadata service URL
    const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
    
    // Use HEAD request to check if avatar exists without downloading
    const metadataResponse = await fetch(metadataUrl, { 
      method: 'HEAD',
      cache: 'force-cache', // Cache for faster subsequent loads
      headers: {
        'Cache-Control': 'max-age=300' // Cache for 5 minutes
      }
    });
    
    if (metadataResponse.ok) {
      console.log(`Found avatar via ENS metadata service for ${ensName}`);
      avatarCache[ensName] = metadataUrl;
      return metadataUrl;
    }
  } catch (ensError) {
    console.error(`Error fetching ENS avatar from metadata service for ${ensName}:`, ensError);
  }
  return null;
}

/**
 * Try the gskril/ens-api (very reliable backup)
 */
async function tryGskrilEnsApi(ensName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://ens-api.vercel.app/api/${ensName}`, {
      cache: 'force-cache',
      headers: {
        'Cache-Control': 'max-age=300'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.avatar) {
        console.log(`Found avatar via gskril/ens-api for ${ensName}: ${data.avatar}`);
        avatarCache[ensName] = data.avatar;
        return data.avatar;
      }
    }
  } catch (error) {
    console.error(`Error fetching from gskril/ens-api for ${ensName}:`, error);
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
      cache: 'force-cache',
      headers: {
        'Cache-Control': 'max-age=300'
      }
    });
    if (ensAvatarResponse.ok) {
      console.log(`Found avatar via ENS Avatar API for ${ensName}`);
      avatarCache[ensName] = ensAvatarUrl;
      return ensAvatarUrl;
    }
  } catch (ensAvatarError) {
    console.error(`Error fetching from ENS Avatar API for ${ensName}:`, ensAvatarError);
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
      cache: 'force-cache',
      headers: {
        'Cache-Control': 'max-age=300'
      }
    });
    if (ethAvatarResponse.ok) {
      console.log(`Found avatar via Ethereum Avatar Service for ${ensName}`);
      avatarCache[ensName] = ethAvatarUrl;
      return ethAvatarUrl;
    }
  } catch (ethAvatarError) {
    console.error(`Error fetching from Ethereum Avatar Service for ${ensName}:`, ethAvatarError);
  }
  return null;
}
