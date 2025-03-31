
import { mainnetProvider } from '../ethereumProviders';

/**
 * Resolves an ENS name to an address
 */
export async function resolveEnsToAddress(ensName: string) {
  // Treat all domains as mainnet domains
  const provider = mainnetProvider;
  
  console.log(`Resolving domain: ${ensName} using Mainnet provider`);
  
  try {
    const resolvedAddress = await provider.resolveName(ensName);
    console.log(`Resolution result for ${ensName}:`, resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names
 */
export async function resolveAddressToEns(address: string) {
  // Try mainnet first
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    const ensName = await mainnetProvider.lookupAddress(address);
    
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
