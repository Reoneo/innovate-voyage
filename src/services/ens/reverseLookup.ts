
import { getName } from '@ensdomains/ensjs/public';
import { ensClient } from './client';

/**
 * Reverse lookup: get ENS name for an address
 */
export async function getENSNameByAddress(address: string): Promise<string | null> {
  try {
    if (!address || !address.startsWith('0x')) {
      return null;
    }

    const result = await getName(ensClient, { address: address as `0x${string}` });
    
    return result?.name || null;

  } catch (error) {
    console.error(`Error in reverse ENS lookup for ${address}:`, error);
    return null;
  }
}
