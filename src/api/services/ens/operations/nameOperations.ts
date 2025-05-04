
import { publicClient } from '../client/publicClient';

/**
 * Resolve an ENS name to an Ethereum address
 * @param ensName The ENS name to resolve
 * @returns The resolved address or null if not found
 */
export async function resolveEnsName(ensName: string): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Resolving ENS name: ${ensName}`);
    
    const address = await publicClient.getEnsAddress({
      name: ensName,
    });
    
    return address || null;
  } catch (error) {
    console.error(`Error resolving ENS name ${ensName}:`, error);
    return null;
  }
}

/**
 * Look up an Ethereum address to find its primary ENS name
 * @param address The Ethereum address to look up
 * @returns The ENS name or null if not found
 */
export async function lookupEnsName(address: string): Promise<string | null> {
  try {
    if (!address) return null;
    
    console.log(`Looking up ENS for address: ${address}`);
    
    const ensName = await publicClient.getEnsName({
      address: address as `0x${string}`,
    });
    
    return ensName || null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
