
import { getName } from '@ensdomains/ensjs/public';
import { ensClient, fallbackClients } from './client';

/**
 * Reverse lookup: get ENS name for an address with fallback support
 */
export async function getENSNameByAddress(address: string): Promise<string | null> {
  try {
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return null;
    }

    console.log(`Reverse lookup for address: ${address}`);
    
    // Try main client first, then fallbacks
    const clients = [ensClient, ...fallbackClients];
    
    for (const client of clients) {
      try {
        const result = await Promise.race([
          getName(client, { address: address as `0x${string}` }),
          new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          )
        ]);
        
        if (result?.name) {
          console.log(`Reverse lookup success: ${address} -> ${result.name}`);
          return result.name;
        }
        
      } catch (error) {
        console.warn(`Reverse lookup failed with client, trying next...`, error);
        continue;
      }
    }
    
    console.log(`No ENS name found for address: ${address}`);
    return null;

  } catch (error) {
    console.error(`Error in reverse ENS lookup for ${address}:`, error);
    return null;
  }
}
