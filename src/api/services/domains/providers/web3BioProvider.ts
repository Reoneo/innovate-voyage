
import { publicClient } from '../../ens/ensApiClient';
import { mainnet } from 'viem/chains';

/**
 * Fetch domains using ENS API instead of web3.bio
 */
export async function fetchDomainsFromWeb3Bio(address: string): Promise<string[]> {
  if (!address) return [];
  
  try {
    console.log(`Fetching domains for address: ${address}`);
    
    // Limit to just one primary ENS name for performance
    const primaryName = await publicClient.getEnsName({
      address: address as `0x${string}`,
    });
    
    if (primaryName) {
      console.log(`Found primary ENS name for ${address}: ${primaryName}`);
      return [primaryName];
    }
    
    console.log(`No primary ENS name found for ${address}`);
    return [];
  } catch (error) {
    console.error("Error fetching ENS domains:", error);
    return [];
  }
}
