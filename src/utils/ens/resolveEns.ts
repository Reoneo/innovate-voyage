
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

  // Validate the input is actually an ENS name
  if (!ensName || (!ensName.includes('.eth') && !ensName.includes('.box') && !ensName.includes('.id'))) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  // Handle both .eth and .box domains through standard resolver
  console.log(`Resolving domain: ${ensName} using provider`);
  
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      // For .box domains, try CCIP-Read handler first
      if (ensName.endsWith('.box')) {
        console.log(`Trying CCIP-Read for .box domain: ${ensName}`);
        const boxResult = await ccipReadEnabled.resolveDotBit(ensName);
        if (boxResult && boxResult.address) {
          console.log(`CCIP-Read resolved ${ensName} to ${boxResult.address}`);
          addToEnsCache(ensName, { address: boxResult.address });
          return boxResult.address;
        }
      }
      
      // Standard ENS resolution using FallbackProvider
      console.log(`Using standard ENS resolution for ${ensName}`);
      
      // First try direct resolver (faster)
      try {
        const resolver = await mainnetProvider.getResolver(ensName);
        if (resolver) {
          const address = await resolver.getAddress();
          console.log(`Direct resolver found ${address} for ${ensName}`);
          if (address) {
            addToEnsCache(ensName, { address });
            return address;
          }
        }
      } catch (resolverError) {
        console.warn(`Error with direct resolver for ${ensName}:`, resolverError);
      }
      
      // Fallback to resolveName
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

  // Validate address format
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  // Try using CCIP-Read for reverse resolution of .box domains
  try {
    console.log(`Looking up .box domains for address: ${address}`);
    
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
      console.warn(`CCIP-Read lookup error for ${address}:`, error);
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.warn(`CCIP-Read error for ${address}:`, error);
  }
  
  // Try standard ENS lookup
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      // Using lookupAddress
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
        console.warn(`Error looking up ENS for ${address}:`, error);
      }
      return null;
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.warn(`Error in ENS lookup for ${address}:`, error);
    return null;
  }
}
