
import { publicClient } from '../client/publicClient';

/**
 * Get ENS avatar using viem directly
 */
export async function getEnsAvatarUrl(ensName: string): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Getting avatar for ENS: ${ensName}`);
    
    // Use viem to get avatar
    const avatar = await publicClient.getEnsAvatar({
      name: ensName,
    });
    
    return avatar || null;
  } catch (error) {
    console.error(`Error getting avatar for ENS ${ensName}:`, error);
    return null;
  }
}

/**
 * Get specific text record from ENS
 */
export async function getEnsTextRecord(ensName: string, key: string): Promise<string | null> {
  try {
    if (!ensName || !key) return null;
    
    console.log(`Getting ${key} text record for ENS: ${ensName}`);
    
    // Use viem to get text record
    const value = await publicClient.getEnsText({
      name: ensName,
      key: key,
    });
    
    return value || null;
  } catch (error) {
    console.error(`Error getting ${key} text record for ENS ${ensName}:`, error);
    return null;
  }
}
