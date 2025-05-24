
import { avatarCache } from '../../../utils/web3/index';

// ENS API base URL - you can change this to your self-hosted instance
const ENS_API_BASE = 'https://ens-api.vercel.app';

/**
 * Handle ENS domain avatars using ENS API
 * @param identity ENS domain name
 * @returns Avatar URL or null if not found
 */
export async function handleEnsAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching ENS avatar for ${identity} using ENS API`);
    
    // Try the ENS API avatar endpoint first
    const ensApiAvatar = await tryEnsApiAvatar(identity);
    if (ensApiAvatar) return ensApiAvatar;
    
    // Try the ENS metadata service as fallback
    const metadataAvatar = await tryEnsMetadataService(identity);
    if (metadataAvatar) return metadataAvatar;
    
    // Try the gskril/ens-api as additional fallback
    const gskrilApiResult = await tryGskrilEnsApi(identity);
    if (gskrilApiResult) return gskrilApiResult;
    
    return null;
  } catch (error) {
    console.error(`Error handling ENS avatar for ${identity}:`, error);
    return null;
  }
}

/**
 * Try the ENS API avatar endpoint
 */
async function tryEnsApiAvatar(ensName: string): Promise<string | null> {
  try {
    const avatarUrl = `${ENS_API_BASE}/avatar/${ensName}`;
    const response = await fetch(avatarUrl, { method: 'HEAD' });
    
    if (response.ok) {
      console.log(`Found avatar via ENS API for ${ensName}`);
      avatarCache[ensName] = avatarUrl;
      return avatarUrl;
    }
  } catch (error) {
    console.error(`Error fetching from ENS API for ${ensName}:`, error);
  }
  return null;
}

/**
 * Try the gskril/ens-api (very reliable)
 */
async function tryGskrilEnsApi(ensName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://ens-api.vercel.app/api/${ensName}`, {
      cache: 'no-store'
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
 * Try the ENS metadata service - official and most up-to-date
 */
async function tryEnsMetadataService(ensName: string): Promise<string | null> {
  try {
    // This URL returns the avatar directly, not JSON
    const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
    const metadataResponse = await fetch(metadataUrl, { 
      method: 'HEAD',
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
    console.error(`Error fetching ENS avatar from metadata service for ${ensName}:`, ensError);
  }
  return null;
}
