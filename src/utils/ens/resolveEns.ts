
import { mainnetProvider } from '../ethereumProviders';
import { ccipReadEnabled, ResolveDotBitResult } from './ccipReadHandler';

// Use ENS API as a more reliable fallback
const ENS_API_URL = 'https://ens-api.gskril.workers.dev';

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
  
  // Special handling for .box domains - uses CCIP-Read compatible resolver
  if (ensName.endsWith('.box')) {
    console.log(`Resolving .box domain: ${ensName} using CCIP-Read handler`);
    try {
      const result = await ccipReadEnabled.resolveDotBit(ensName);
      if (result && result.address) {
        console.log(`CCIP-Read resolution result for ${ensName}:`, result);
        return result.address;
      }
    } catch (error) {
      console.error(`CCIP-Read error resolving ${ensName}:`, error);
    }
  }
  
  // Try ENS API as our first fallback - works well for both .eth and .box domains
  try {
    console.log(`Trying ENS API for ${ensName}`);
    const response = await fetch(`${ENS_API_URL}/address/${ensName}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        console.log(`ENS API resolution for ${ensName}:`, data.address);
        return data.address;
      }
    }
  } catch (ensApiError) {
    console.error(`Error using ENS API for ${ensName}:`, ensApiError);
  }
  
  // Default flow for .eth domains or as fallback for .box domains
  const provider = mainnetProvider;
  
  console.log(`Resolving domain: ${ensName} using Mainnet provider`);
  
  try {
    // Using resolveName with a timeout
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
  
  // Try ENS API first for reverse resolution
  try {
    console.log(`Trying ENS API for address: ${address}`);
    const response = await fetch(`${ENS_API_URL}/name/${address}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.name) {
        console.log(`Found ENS name via API for ${address}: ${data.name}`);
        return { ensName: data.name, network: 'mainnet' as const };
      }
    }
  } catch (ensApiError) {
    console.error(`Error using ENS API for address lookup ${address}:`, ensApiError);
  }
  
  // Try using CCIP-Read for reverse resolution
  try {
    console.log(`Looking up domains for address: ${address} using CCIP-Read handler`);
    const boxDomains = await ccipReadEnabled.getDotBitByAddress(address);
    if (boxDomains && boxDomains.length > 0) {
      console.log(`Found .box domains for ${address}:`, boxDomains);
      return { ensName: boxDomains[0], network: 'mainnet' as const };
    }
  } catch (error) {
    console.error(`Error in CCIP-Read lookup for ${address}:`, error);
  }
  
  // Try mainnet lookup as final fallback
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    
    // Using lookupAddress with a timeout
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
      return { ensName, network: 'mainnet' as const };
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
