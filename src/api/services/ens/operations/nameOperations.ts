
import { publicClient } from '../client/publicClient';

/**
 * Resolve ENS name to address using viem directly
 */
export async function resolveEnsName(ensName: string): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Resolving ENS name: ${ensName}`);
    
    // Use viem to resolve the name
    const resolved = await publicClient.getEnsAddress({
      name: ensName,
    });
    
    return resolved || null;
  } catch (error) {
    console.error(`Error resolving ENS name ${ensName}:`, error);
    return null;
  }
}

/**
 * Reverse resolve address to ENS name using viem directly
 */
export async function lookupEnsName(address: string): Promise<string | null> {
  try {
    if (!address) return null;
    
    console.log(`Looking up ENS for address: ${address}`);
    
    // Use viem to lookup the address
    const name = await publicClient.getEnsName({
      address: address as `0x${string}`,
    });
    
    return name || null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
