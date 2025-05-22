
// Reverse resolution: address -> ENS name
import { checkCache, updateCache, handleFailedResolution } from './cache';
import { validateAddress, standardEnsLookup, dotBoxLookup } from './utils';
import { EnsResolutionResult } from './types';
import { STANDARD_TIMEOUT } from './constants';

/**
 * Resolve address to ENS name with improved caching and error handling
 */
export async function resolveAddressToEns(
  address: string, 
  timeoutMs = STANDARD_TIMEOUT
): Promise<EnsResolutionResult | null> {
  if (!address) return null;
  
  // Check cache first
  const cacheKey = address.toLowerCase();
  const cachedEnsName = checkCache<string | null>(cacheKey, 'ensName');
  if (cachedEnsName !== null) {
    return { ensName: cachedEnsName, network: 'mainnet' };
  }
  
  // Validate address format
  if (!validateAddress(address)) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  // Try to resolve through multiple methods in parallel
  const results = await Promise.allSettled([
    // Method 1: Standard ENS reverse lookup
    standardEnsLookup(address, timeoutMs),
    
    // Method 2: Try using CCIP-Read for .box domains
    dotBoxLookup(address, timeoutMs)
  ]);
  
  // Process results - take the first successful one
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const ensName = result.value;
      const method = result.value.includes('.box') ? 'ccip' : 'standard';
      
      console.log(`Resolved address ${address} to ${ensName} using ${method} method`);
      
      // Cache the result
      updateCache(cacheKey, { ensName });
      updateCache(ensName.toLowerCase(), { address });
      
      return { ensName, network: 'mainnet' };
    }
  }
  
  // No resolution found
  return handleFailedResolution(address);
}
