
import { mainnetProvider } from '../ethereumProviders';
import { getAddressRecord, getName, normalizeEnsDomain, ensClient } from './ensClient';

/**
 * Validates if the input could be a valid ENS name
 */
export function isValidEnsDomain(domain: string): boolean {
  // Basic validation: must have at least one character before the dot
  // and a valid TLD (currently supporting .eth and .box)
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.(eth|box)$/.test(domain);
}

/**
 * Resolves an ENS name to an address using ENS.js
 */
export async function resolveEnsToAddress(ensName: string) {
  if (!ensName) return null;
  
  const normalizedEns = normalizeEnsDomain(ensName);
  
  // Only proceed if it's a potentially valid ENS name
  if (!normalizedEns.includes('.')) {
    console.warn(`Invalid ENS format: ${ensName}`);
    return null;
  }
  
  console.log(`Resolving domain: ${normalizedEns} using ENS.js client`);
  
  try {
    const result = await getAddressRecord(normalizedEns);
    console.log(`Resolution result for ${normalizedEns}:`, result);
    return result;
  } catch (error) {
    console.error(`Error resolving ${normalizedEns}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names using ENS.js
 */
export async function resolveAddressToEns(address: string) {
  if (!address || !address.startsWith('0x')) {
    console.warn('Invalid Ethereum address format');
    return null;
  }
  
  try {
    console.log(`Looking up ENS for address: ${address} using ENS.js client`);
    // Convert to correct 0x format for viem
    const formattedAddress = address as `0x${string}`;
    const nameResult = await getName(formattedAddress);
    
    if (nameResult && nameResult.name) {
      console.log(`Found ENS name for ${address}: ${nameResult.name}`);
      return { ensName: nameResult.name, network: 'mainnet' as const };
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
