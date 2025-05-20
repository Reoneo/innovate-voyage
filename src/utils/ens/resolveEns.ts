
import { mainnetProvider } from '../ethereumProviders';
import { ccipReadEnabled, ResolveDotBitResult } from './ccipReadHandler';

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
  
  // Try to get from cache first
  const cacheKey = `resolved_address_${ensName.toLowerCase()}`;
  const cachedAddress = sessionStorage.getItem(cacheKey);
  if (cachedAddress) {
    console.log(`Using cached address for ${ensName}: ${cachedAddress}`);
    return cachedAddress;
  }
  
  // Special handling for .box domains - uses CCIP-Read compatible resolver
  if (ensName.endsWith('.box')) {
    console.log(`Resolving .box domain: ${ensName} using CCIP-Read handler`);
    try {
      const result = await ccipReadEnabled.resolveDotBit(ensName);
      if (result && result.address) {
        console.log(`CCIP-Read resolution result for ${ensName}:`, result);
        // Cache the result
        sessionStorage.setItem(cacheKey, result.address);
        return result.address;
      }
    } catch (error) {
      console.error(`CCIP-Read error resolving ${ensName}:`, error);
    }
  }
  
  // Default flow for .eth domains or as fallback for .box domains
  const provider = mainnetProvider;
  
  console.log(`Resolving domain: ${ensName} using Mainnet provider`);
  
  try {
    // Using resolveName with a SHORTER timeout (3s instead of 5s)
    const resolvePromise = provider.resolveName(ensName);
    
    // Create a timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('ENS resolution timeout')), 3000)
    );
    
    // Race between the resolution and the timeout
    const resolvedAddress = await Promise.race([
      resolvePromise,
      timeoutPromise
    ]) as string | null;
    
    console.log(`Resolution result for ${ensName}:`, resolvedAddress);
    
    // Cache successful results
    if (resolvedAddress) {
      sessionStorage.setItem(cacheKey, resolvedAddress);
    }
    
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
  
  // Try to get from cache first
  const cacheKey = `resolved_ens_${address.toLowerCase()}`;
  const cachedEns = sessionStorage.getItem(cacheKey);
  if (cachedEns) {
    try {
      const parsed = JSON.parse(cachedEns);
      console.log(`Using cached ENS for ${address}: ${parsed.ensName}`);
      return parsed;
    } catch (e) {
      console.error('Error parsing cached ENS:', e);
    }
  }
  
  // Try using CCIP-Read for reverse resolution
  try {
    console.log(`Looking up domains for address: ${address} using CCIP-Read handler`);
    const boxDomains = await ccipReadEnabled.getDotBitByAddress(address);
    if (boxDomains && boxDomains.length > 0) {
      console.log(`Found .box domains for ${address}:`, boxDomains);
      const result = { ensName: boxDomains[0], network: 'mainnet' as const };
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
  } catch (error) {
    console.error(`Error in CCIP-Read lookup for ${address}:`, error);
  }
  
  // Try mainnet lookup as fallback with a SHORTER timeout
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    
    // Using lookupAddress with a shortened timeout (3s instead of 5s)
    const lookupPromise = mainnetProvider.lookupAddress(address);
    
    // Create a timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('ENS lookup timeout')), 3000)
    );
    
    // Race between the lookup and the timeout
    const ensName = await Promise.race([
      lookupPromise,
      timeoutPromise
    ]) as string | null;
    
    if (ensName) {
      console.log(`Found ENS name for ${address}: ${ensName}`);
      const result = { ensName, network: 'mainnet' as const };
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
