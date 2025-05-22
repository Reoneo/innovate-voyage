
import { mainnetProvider, getFromEnsCache, addToEnsCache, markFailedResolution, DEFAULT_ENS_TTL } from '../ethereumProviders';
import { ccipReadEnabled } from './ccipReadHandler';

// Standard timeout for all ENS operations
const STANDARD_TIMEOUT = 5000;

// Maximum timeout for critical operations
const MAX_TIMEOUT = 8000;

// Improved ENS resolution function with better handling and AbortController
export async function resolveEnsToAddress(ensName: string, timeoutMs = STANDARD_TIMEOUT): Promise<string | null> {
  if (!ensName) return null;
  
  // Check cache first
  const cachedResult = getFromEnsCache(ensName);
  if (cachedResult && cachedResult.address) {
    console.log(`Using cached ENS address for ${ensName}`);
    return cachedResult.address;
  }

  // Handle too many failed attempts
  if (cachedResult && cachedResult.attempts && cachedResult.attempts > 3) {
    console.log(`Skipping resolution for ${ensName} after ${cachedResult.attempts} failed attempts`);
    return null;
  }
  
  // Validate the input is actually an ENS name
  if (!ensName || (!ensName.includes('.eth') && !ensName.includes('.box') && !ensName.includes('.id'))) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  // Handle .box domains as .eth equivalents for increased compatibility
  const effectiveEnsName = ensName.endsWith('.box') 
    ? ensName.replace('.box', '.eth')
    : ensName;
  
  console.log(`Resolving domain: ${ensName} (effective: ${effectiveEnsName}) using provider`);
  
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      console.warn(`Aborting resolution for ${ensName} after ${timeoutMs}ms`);
      controller.abort();
    }, timeoutMs);
    
    try {
      // For .box domains, try CCIP-Read handler first
      if (ensName.endsWith('.box')) {
        console.log(`Trying CCIP-Read for .box domain: ${ensName}`);
        
        try {
          const boxResult = await ccipReadEnabled.resolveDotBit(ensName);
          if (boxResult && boxResult.address) {
            console.log(`CCIP-Read resolved ${ensName} to ${boxResult.address}`);
            addToEnsCache(ensName, { address: boxResult.address });
            
            // Cross-cache with .eth equivalent
            addToEnsCache(effectiveEnsName, { address: boxResult.address });
            
            return boxResult.address;
          }
        } catch (ccipError) {
          console.warn(`CCIP-Read error for ${ensName}:`, ccipError);
          // Continue to standard resolution
        }
      }
      
      // Standard ENS resolution using FallbackProvider - increased timeout
      console.log(`Using standard ENS resolution for ${ensName}`);
      
      // Parallel approach - try both resolver and resolveName at the same time
      const resolverPromise = (async () => {
        try {
          const resolver = await mainnetProvider.getResolver(effectiveEnsName);
          if (resolver) {
            const address = await resolver.getAddress();
            if (address) {
              console.log(`Direct resolver found ${address} for ${ensName}`);
              return address;
            }
          }
          return null;
        } catch (error) {
          console.warn(`Error with direct resolver for ${ensName}:`, error);
          return null;
        }
      })();
      
      const resolveNamePromise = (async () => {
        try {
          const address = await mainnetProvider.resolveName(effectiveEnsName);
          if (address) {
            console.log(`resolveName found ${address} for ${ensName}`);
            return address;
          }
          return null;
        } catch (error) {
          console.warn(`Error with resolveName for ${ensName}:`, error);
          return null;
        }
      })();
      
      // Use Promise.race with a filter for non-null results instead of Promise.any
      const promises = [resolverPromise, resolveNamePromise];
      
      // Custom implementation of first successful result (alternative to Promise.any)
      let resolvedAddress: string | null = null;
      
      // Set up racing promises that resolve when any promise succeeds
      const racePromise = Promise.race(
        promises.map(p => 
          p.then(result => {
            if (result) {
              resolvedAddress = result;
              return true;
            }
            return false;
          }).catch(() => false)
        )
      );
      
      // Wait for the first successful result or all to fail
      await racePromise;
      
      // Cache the result
      if (resolvedAddress) {
        console.log(`Resolution successful for ${ensName}: ${resolvedAddress}`);
        addToEnsCache(ensName, { address: resolvedAddress });
        
        // Cross-cache with .eth equivalent for .box domains
        if (ensName.endsWith('.box')) {
          addToEnsCache(effectiveEnsName, { address: resolvedAddress });
        }
        
        return resolvedAddress;
      }
      
      // Mark as failed attempt if we couldn't resolve
      markFailedResolution(ensName);
      console.warn(`Could not resolve address for ${ensName}`);
      return null;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`ENS resolution for ${ensName} aborted after ${timeoutMs}ms`);
      } else {
        console.error(`Error resolving ${ensName}:`, error);
      }
      
      // Mark as failed attempt
      markFailedResolution(ensName);
      return null;
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    markFailedResolution(ensName);
    return null;
  }
}

// Improved reverse resolution (address to ENS) with AbortController
export async function resolveAddressToEns(address: string, timeoutMs = STANDARD_TIMEOUT) {
  if (!address) return null;
  
  // Check cache first
  const cacheKey = address.toLowerCase();
  const cachedResult = getFromEnsCache(cacheKey);
  if (cachedResult && cachedResult.ensName) {
    console.log(`Using cached ENS name for ${address}`);
    return { ensName: cachedResult.ensName, network: 'mainnet' as const };
  }

  // Handle too many failed attempts
  if (cachedResult && cachedResult.attempts && cachedResult.attempts > 3) {
    console.log(`Skipping reverse resolution for ${address} after ${cachedResult.attempts} failed attempts`);
    return null;
  }
  
  // Validate address format
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  // Try to resolve through multiple methods in parallel
  const results = await Promise.allSettled([
    // Method 1: Standard ENS reverse lookup
    (async () => {
      try {
        console.log(`Looking up ENS for address: ${address} on Mainnet`);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
          // Using lookupAddress
          const ensName = await mainnetProvider.lookupAddress(address);
          
          if (ensName) {
            console.log(`Found ENS name for ${address}: ${ensName}`);
            return { ensName, method: 'standard' };
          }
          return null;
        } finally {
          clearTimeout(timer);
        }
      } catch (error) {
        console.warn(`Error in standard ENS lookup for ${address}:`, error);
        return null;
      }
    })(),
    
    // Method 2: Try using CCIP-Read for .box domains
    (async () => {
      try {
        console.log(`Looking up .box domains for address: ${address}`);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
          const boxDomains = await ccipReadEnabled.getDotBitByAddress(address);
          if (boxDomains && boxDomains.length > 0) {
            console.log(`Found .box domains for ${address}:`, boxDomains);
            return { ensName: boxDomains[0], method: 'ccip' };
          }
          return null;
        } finally {
          clearTimeout(timer);
        }
      } catch (error) {
        console.warn(`Error in CCIP-Read lookup for ${address}:`, error);
        return null;
      }
    })()
  ]);
  
  // Process results - take the first successful one
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const { ensName, method } = result.value;
      
      console.log(`Resolved address ${address} to ${ensName} using ${method} method`);
      
      // Cache the result
      addToEnsCache(cacheKey, { ensName });
      addToEnsCache(ensName.toLowerCase(), { address });
      
      return { ensName, network: 'mainnet' as const };
    }
  }
  
  // Mark as failed attempt
  markFailedResolution(address);
  console.warn(`Could not resolve ENS name for address ${address}`);
  return null;
}
