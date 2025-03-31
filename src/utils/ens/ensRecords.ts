
import { getTextRecord, getAvatar } from './ensClient';

/**
 * Gets avatar for an ENS name using ENS.js
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    console.log(`Getting avatar for ${ensName}`);
    const avatarUrl = await getAvatar(ensName);
    
    if (avatarUrl) {
      console.log(`Got avatar for ${ensName}:`, avatarUrl);
      return avatarUrl;
    } else {
      console.log(`No avatar found for ${ensName}`);
    }
    
    return null;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}

/**
 * Gets ENS bio data using ENS.js
 */
export async function getEnsBio(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    console.log(`Getting bio for ${ensName}`);
    const description = await getTextRecord(ensName, 'description');
    
    if (description) {
      console.log(`Got bio for ${ensName}:`, description);
      return description;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching bio for ${ensName}:`, error);
    return null;
  }
}
