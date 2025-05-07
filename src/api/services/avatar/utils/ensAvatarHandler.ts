
import { avatarCache } from '../../../utils/web3/index';

/**
 * Handle ENS domain avatars through multiple sources
 * @param identity ENS domain name
 * @returns Avatar URL or null if not found
 */
export async function handleEnsAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching ENS avatar for ${identity}`);
    
    // Try the ENS metadata service (more reliable for newer ENS domains)
    const metadataAvatar = await tryEnsMetadataService(identity);
    if (metadataAvatar) return metadataAvatar;
    
    // Try the Ethereum Avatar Service
    const ethAvatarServiceResult = await tryEthAvatarService(identity);
    if (ethAvatarServiceResult) return ethAvatarServiceResult;
    
    // Try the official ENS Avatar API
    const ensAvatarApiResult = await tryEnsAvatarApi(identity);
    if (ensAvatarApiResult) return ensAvatarApiResult;
    
    return null;
  } catch (error) {
    console.error(`Error handling ENS avatar for ${identity}:`, error);
    return null;
  }
}

/**
 * Try the ENS metadata service
 */
async function tryEnsMetadataService(ensName: string): Promise<string | null> {
  try {
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

/**
 * Try the Ethereum Avatar Service
 */
async function tryEthAvatarService(ensName: string): Promise<string | null> {
  try {
    const ethAvatarUrl = `https://eth-avatar-api.herokuapp.com/${ensName}`;
    const ethAvatarResponse = await fetch(ethAvatarUrl, { method: 'HEAD' });
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

/**
 * Try the official ENS Avatar API
 */
async function tryEnsAvatarApi(ensName: string): Promise<string | null> {
  try {
    const ensAvatarUrl = `https://avatar.ens.domains/${ensName}`;
    const ensAvatarResponse = await fetch(ensAvatarUrl, { method: 'HEAD' });
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
