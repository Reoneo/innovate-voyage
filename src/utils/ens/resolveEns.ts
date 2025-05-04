
import { mainnetProvider } from '../ethereumProviders';

/**
 * Resolves an ENS name to an address
 * @param ensName ENS name to resolve
 * @returns Resolved address or null if not found
 */
export async function resolveEnsToAddress(ensName: string) {
  // Check if the input is actually an ENS name
  if (!ensName || (!ensName.includes('.eth') && !ensName.includes('.box'))) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  // Treat all domains as mainnet domains
  const provider = mainnetProvider;
  
  console.log(`Resolving domain: ${ensName} using Mainnet provider`);
  
  try {
    // Using resolveName with a timeout
    const resolvePromise = provider.resolveName(ensName);
    
    // Create a timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('ENS resolution timeout')), 5000)
    );
    
    // Race between the resolution and the timeout
    const resolvedAddress = await Promise.race([
      resolvePromise,
      timeoutPromise
    ]) as string | null;
    
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
export async function resolveAddressToEns(address: string) {
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  // Try mainnet first
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    
    // Using lookupAddress with a timeout
    const lookupPromise = mainnetProvider.lookupAddress(address);
    
    // Create a timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('ENS lookup timeout')), 5000)
    );
    
    // Race between the lookup and the timeout
    const ensName = await Promise.race([
      lookupPromise,
      timeoutPromise
    ]) as string | null;
    
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
