
import { mainnetProvider } from '../ethereumProviders';

/**
 * Normalizes an ENS name by adding .eth suffix if missing and not containing another TLD
 */
export function normalizeEnsDomain(ensName: string): string {
  // Already has a TLD
  if (ensName.includes('.')) {
    return ensName;
  }
  
  // Add .eth for names without a TLD
  return `${ensName}.eth`;
}

/**
 * Validates if the input could be a valid ENS name
 */
export function isValidEnsDomain(domain: string): boolean {
  // Basic validation: must have at least one character before the dot
  // and a valid TLD (currently supporting .eth and .box)
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.(eth|box)$/.test(domain);
}

/**
 * Resolves an ENS name to an address with improved error handling
 */
export async function resolveEnsToAddress(ensName: string) {
  if (!ensName) return null;
  
  const normalizedEns = normalizeEnsDomain(ensName);
  
  // Only proceed if it's a potentially valid ENS name
  if (!normalizedEns.includes('.')) {
    console.warn(`Invalid ENS format: ${ensName}`);
    return null;
  }
  
  // Treat all domains as mainnet domains
  const provider = mainnetProvider;
  
  console.log(`Resolving domain: ${normalizedEns} using Mainnet provider`);
  
  try {
    const resolvedAddress = await provider.resolveName(normalizedEns);
    console.log(`Resolution result for ${normalizedEns}:`, resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    console.error(`Error resolving ${normalizedEns}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names with improved handling
 */
export async function resolveAddressToEns(address: string) {
  if (!address || !address.startsWith('0x')) {
    console.warn('Invalid Ethereum address format');
    return null;
  }
  
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
