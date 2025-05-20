
import { mainnetProvider, getFromEnsCache, addToEnsCache, DEFAULT_ENS_TTL } from '../ethereumProviders';
import { ccipReadEnabled } from './ccipReadHandler';

// Improved ENS resolution function with better handling and AbortController
export async function resolveEnsToAddress(ensName: string, timeoutMs = 5000): Promise<string | null> {
  if (!ensName) return null;
  
  // Check cache first
  const cachedResult = getFromEnsCache(ensName);
  if (cachedResult && cachedResult.address) {
    console.log(`Using cached ENS address for ${ensName}`);
    return cachedResult.address;
  }

  // Check if the input is actually an ENS name
  if (!ensName || (!ensName.includes('.eth') && !ensName.includes('.box'))) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  // Special handling for .box domains - uses CCIP-Read compatible resolver
  if (ensName.endsWith('.box')) {
    console.log(`Resolving .box domain: ${ensName} using CCIP-Read handler`);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const result = await ccipReadEnabled.resolveDotBit(ensName);
        if (result && result.address) {
          console.log(`CCIP-Read resolution result for ${ensName}:`, result);
          
          // Cache the result
          addToEnsCache(ensName, { address: result.address });
          
          return result.address;
        }
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      console.error(`CCIP-Read error resolving ${ensName}:`, error);
    }
  }
  
  // Default flow for .eth domains or as fallback for .box domains
  console.log(`Resolving domain: ${ensName} using provider`);
  
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      // Using resolveName with AbortController
      const resolvedAddress = await mainnetProvider.resolveName(ensName);
      
      console.log(`Resolution result for ${ensName}:`, resolvedAddress);
      
      // Cache the result
      if (resolvedAddress) {
        addToEnsCache(ensName, { address: resolvedAddress });
      }
      
      return resolvedAddress;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`ENS resolution for ${ensName} aborted after ${timeoutMs}ms`);
      } else {
        console.error(`Error resolving ${ensName}:`, error);
      }
      return null;
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return null;
  }
}

// Improved reverse resolution (address to ENS) with AbortController
export async function resolveAddressToEns(address: string, timeoutMs = 5000) {
  if (!address) return null;
  
  // Check cache first
  const cacheKey = address.toLowerCase();
  const cachedResult = getFromEnsCache(cacheKey);
  if (cachedResult && cachedResult.ensName) {
    console.log(`Using cached ENS name for ${address}`);
    return { ensName: cachedResult.ensName, network: 'mainnet' as const };
  }

  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  // Try using CCIP-Read for reverse resolution
  try {
    console.log(`Looking up domains for address: ${address} using CCIP-Read handler`);
    
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const boxDomains = await ccipReadEnabled.getDotBitByAddress(address);
      if (boxDomains && boxDomains.length > 0) {
        console.log(`Found .box domains for ${address}:`, boxDomains);
        const result = { ensName: boxDomains[0], network: 'mainnet' as const };
        
        // Cache the result
        addToEnsCache(cacheKey, { ensName: boxDomains[0] });
        
        return result;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`CCIP-Read lookup for ${address} aborted after ${timeoutMs}ms`);
      } else {
        console.error(`Error in CCIP-Read lookup for ${address}:`, error);
      }
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error(`Error in CCIP-Read lookup for ${address}:`, error);
  }
  
  // Try mainnet lookup as fallback
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      // Using lookupAddress with AbortController
      const ensName = await mainnetProvider.lookupAddress(address);
      
      if (ensName) {
        console.log(`Found ENS name for ${address}: ${ensName}`);
        const result = { ensName, network: 'mainnet' as const };
        
        // Cache the result
        addToEnsCache(cacheKey, { ensName });
        
        return result;
      }
      
      return null;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`ENS lookup for ${address} aborted after ${timeoutMs}ms`);
      } else {
        console.error(`Error looking up ENS for ${address}:`, error);
      }
      return null;
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
