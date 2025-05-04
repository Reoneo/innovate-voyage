
import { fetchEnsProfile, getEnsAvatarUrl, getEnsTextRecord } from '../../api/services/ens/ensApiClient';
import { generateFallbackAvatar } from '../../api/utils/web3/index';

/**
 * Gets avatar for an ENS name using ENS API
 */
export async function getEnsAvatar(ensName: string): Promise<string | null> {
  try {
    console.log(`Getting avatar for ${ensName}`);
    
    // Use the ENS API to get the avatar
    const avatar = await getEnsAvatarUrl(ensName);
    
    if (avatar) {
      console.log(`Got avatar for ${ensName} -> ${avatar}`);
      return avatar;
    }
    
    // If no avatar found, return null
    return null;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}

/**
 * Gets ENS bio data using ENS API
 */
export async function getEnsBio(ensName: string): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Getting bio for ${ensName}`);
    
    // Try to get the description from the profile
    const profile = await fetchEnsProfile(ensName);
    
    if (profile && profile.description) {
      return profile.description;
    }
    
    // If no description in profile, try specific text records
    const description = await getEnsTextRecord(ensName, 'description');
    if (description) return description;
    
    const com_description = await getEnsTextRecord(ensName, 'com.discord');
    if (com_description) return com_description;
    
    return null;
  } catch (error) {
    console.error(`Error fetching ENS bio: ${error}`);
    return null;
  }
}
