
import { getEnsAvatar, getEnsBio, getEnsLinks } from '@/utils/ensResolution';
import { EnsFetchResult } from '../types';

/**
 * Fetch additional ENS data (avatar, bio, links) for an ENS name
 */
export async function fetchEnsData(
  ensName: string
): Promise<Partial<EnsFetchResult>> {
  try {
    // Get ENS avatar
    const avatar = await getEnsAvatar(ensName);
    
    // Get ENS bio
    const bio = await getEnsBio(ensName);
    
    // Get ENS links
    const ensLinks = await getEnsLinks(ensName);
    
    return { 
      avatar: avatar as string, 
      bio: bio as string,
      ensLinks: ensLinks as EnsFetchResult['ensLinks']
    };
  } catch (error) {
    console.error('Error fetching ENS data:', error);
    return {};
  }
}
