
import { fetchAllTextRecords } from './textRecords';
import { getENSNameByAddress } from './reverseLookup';
import type { ENSProfile } from './types';

/**
 * Get complete ENS profile with all available text records
 */
export async function getENSProfile(identity: string): Promise<ENSProfile | null> {
  try {
    let ensName = identity;
    
    // If it's an address, try reverse lookup first
    if (identity.startsWith('0x')) {
      const resolvedName = await getENSNameByAddress(identity);
      if (!resolvedName) {
        return null; // No ENS name found for this address
      }
      ensName = resolvedName;
    }
    
    // Validate ENS name format
    if (!ensName.endsWith('.eth') && !ensName.endsWith('.box')) {
      return null;
    }

    console.log(`Getting full ENS profile for: ${ensName}`);
    const profile = await fetchAllTextRecords(ensName);
    
    // Add the original identity if it was an address
    if (identity.startsWith('0x')) {
      profile.address = identity;
    }
    
    return profile;
    
  } catch (error) {
    console.error(`Error getting ENS profile for ${identity}:`, error);
    return null;
  }
}
