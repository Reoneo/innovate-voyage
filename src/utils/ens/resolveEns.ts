
import { resolveEnsName, lookupEnsName } from '../../api/services/ens/ensApiClient';

/**
 * Resolves an ENS name to an address using ENS API
 * @param ensName ENS name to resolve
 * @returns Resolved address or null if not found
 */
export async function resolveEnsToAddress(ensName: string) {
  // Check if the input is actually an ENS name
  if (!ensName || (!ensName.includes('.eth') && !ensName.includes('.box'))) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  console.log(`Resolving domain: ${ensName} using ENS API`);
  
  try {
    const resolvedAddress = await resolveEnsName(ensName);
    console.log(`Resolution result for ${ensName}:`, resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names using ENS API
 * @param address Ethereum address to resolve
 * @returns Object containing ENS name and network or null if not found
 */
export async function resolveAddressToEns(address: string) {
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  try {
    console.log(`Looking up ENS for address: ${address} using ENS API`);
    
    const ensName = await lookupEnsName(address);
    
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
