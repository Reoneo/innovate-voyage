
import { getName } from '@ensdomains/ensjs/public';
import { ensClient } from './client';

/**
 * Reverse lookup: get ENS name for an address with fallback support
 */
export async function getENSNameByAddress(address: string): Promise<string | null> {
  try {
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return null;
    }

    console.log(`Reverse lookup for address: ${address}`);
    
    try {
      const result = await Promise.race([
        getName(ensClient, { address: address as `0x${string}` }),
        new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      
      if (result?.name) {
        console.log(`Reverse lookup success: ${address} -> ${result.name}`);
        return result.name;
      }
      
    } catch (error) {
      console.warn(`Reverse lookup failed:`, error);
    }
    
    console.log(`No ENS name found for address: ${address}`);
    return null;

  } catch (error) {
    console.error(`Error in reverse ENS lookup for ${address}:`, error);
    return null;
  }
}
