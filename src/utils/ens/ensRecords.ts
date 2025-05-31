
import { ensClient } from './ensClient';

/**
 * Gets avatar for an ENS name
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    console.log(`Getting avatar for ${ensName}`);
    
    if (ensName.endsWith('.eth')) {
      const avatarRecord = await ensClient.getTextRecord({ name: ensName, key: 'avatar' });
      const avatar = avatarRecord?.value || null;
      
      if (avatar) {
        console.log(`Got avatar for ${ensName}:`, avatar);
        return avatar;
      }
    }
    
    console.log(`No avatar found for ${ensName}`);
    return null;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}

/**
 * Gets ENS bio data
 */
export async function getEnsBio(ensName: string, network = 'mainnet'): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    if (ensName.endsWith('.eth')) {
      const descriptionRecord = await ensClient.getTextRecord({ name: ensName, key: 'description' });
      const description = descriptionRecord?.value || null;
      
      if (description) {
        console.log(`Got description for ${ensName}:`, description);
        return description;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ENS bio: ${error}`);
    return null;
  }
}
