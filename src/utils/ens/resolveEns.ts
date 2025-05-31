
import { ensClient } from './ensClient';

/**
 * Resolves an ENS name to an address
 * @param ensName ENS name to resolve
 * @returns Resolved address or null if not found
 */
export async function resolveEnsToAddress(ensName: string): Promise<string | null> {
  // Check if the input is actually an ENS name
  if (!ensName || !ensName.includes('.eth')) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  console.log(`Resolving domain: ${ensName} using ENS client`);
  
  try {
    const addressRecord = await ensClient.getAddressRecord({ name: ensName });
    const resolvedAddress = addressRecord?.value || null;
    
    console.log(`Resolution result for ${ensName}:`, resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names
 * @param address Ethereum address to resolve
 * @returns Object containing ENS name and network or null if not found
 */
export async function resolveAddressToEns(address: string): Promise<{ ensName: string; network: 'mainnet' } | null> {
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  try {
    console.log(`Looking up ENS for address: ${address} using ENS client`);
    
    const nameRecord = await ensClient.getName({ address: address as `0x${string}` });
    const ensName = nameRecord?.name || null;
    
    if (ensName) {
      console.log(`Found ENS name for ${address}: ${ensName}`);
      return { ensName, network: 'mainnet' as const };
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
