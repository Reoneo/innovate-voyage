
// Forward resolution: ENS name -> address
import { checkCache, updateCache, handleFailedResolution } from './cache';
import { validateEnsName, getEffectiveEnsName, resolveDotBoxDomain, resolveWithDirectResolver, resolveWithResolveName, setupTimeoutController } from './utils';
import { STANDARD_TIMEOUT } from './constants';

/**
 * Resolve ENS name to address with improved caching and error handling
 */
export async function resolveEnsToAddress(ensName: string, timeoutMs = STANDARD_TIMEOUT): Promise<string | null> {
  if (!ensName) return null;
  
  // Check cache first
  const cachedResult = checkCache<string | null>(ensName, 'address');
  if (cachedResult !== null) {
    return cachedResult;
  }
  
  // Validate the input is actually an ENS name
  if (!validateEnsName(ensName)) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  // Get effective ENS name (handles .box domains)
  const effectiveEnsName = getEffectiveEnsName(ensName);
  console.log(`Resolving domain: ${ensName} (effective: ${effectiveEnsName}) using provider`);
  
  try {
    // Setup abort controller with timeout
    const { controller, clear } = setupTimeoutController(timeoutMs);
    
    try {
      // For .box domains, try CCIP-Read handler first
      if (ensName.endsWith('.box')) {
        const boxResult = await resolveDotBoxDomain(ensName);
        if (boxResult) {
          // Cache the result
          updateCache(ensName, { address: boxResult });
          
          // Cross-cache with .eth equivalent
          updateCache(effectiveEnsName, { address: boxResult });
          
          return boxResult;
        }
      }
      
      // Use a custom implementation to simulate Promise.any for better compatibility
      // Try multiple resolution methods in parallel
      const resolverPromise = resolveWithDirectResolver(effectiveEnsName);
      const resolveNamePromise = resolveWithResolveName(effectiveEnsName);
      
      // Race promises and take first successful result
      let resolvedAddress: string | null = null;
      
      const promises = [resolverPromise, resolveNamePromise];
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
      
      // Cache the result if successful
      if (resolvedAddress) {
        console.log(`Resolution successful for ${ensName}: ${resolvedAddress}`);
        updateCache(ensName, { address: resolvedAddress });
        
        // Cross-cache with .eth equivalent for .box domains
        if (ensName.endsWith('.box')) {
          updateCache(effectiveEnsName, { address: resolvedAddress });
        }
        
        return resolvedAddress;
      }
      
      // No successful resolution
      return handleFailedResolution(ensName);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`ENS resolution for ${ensName} aborted after ${timeoutMs}ms`);
      } else {
        console.error(`Error resolving ${ensName}:`, error);
      }
      
      return handleFailedResolution(ensName);
    } finally {
      clear();
    }
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return handleFailedResolution(ensName);
  }
}
