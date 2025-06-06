
import { fetchPriorityRecords } from './textRecords';
import type { ENSProfile } from './types';

/**
 * Get priority ENS records (GitHub, Twitter, LinkedIn) for fast loading
 * This function prioritizes speed over completeness
 */
export async function getPriorityENSRecords(ensName: string): Promise<Partial<ENSProfile>> {
  if (!ensName || (!ensName.endsWith('.eth') && !ensName.endsWith('.box'))) {
    return { socials: {}, textRecords: {} };
  }

  try {
    console.log(`Getting priority records for: ${ensName}`);
    const profile = await fetchPriorityRecords(ensName);
    
    // Ensure we always return the expected structure
    return {
      ensName,
      socials: profile.socials || {},
      textRecords: profile.textRecords || {},
      avatar: profile.avatar,
      description: profile.description,
      email: profile.email,
      website: profile.website
    };
    
  } catch (error) {
    console.error(`Error getting priority records for ${ensName}:`, error);
    return { 
      ensName,
      socials: {}, 
      textRecords: {} 
    };
  }
}
