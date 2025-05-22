
// Forward resolution: ENS name -> address
import { checkCache, updateCache, handleFailedResolution, checkCacheForTextRecords } from './cache';
import { validateEnsName, getEffectiveEnsName, resolveDotBoxDomain, resolveWithDirectResolver, resolveWithResolveName, setupTimeoutController, fetchTextRecords, firstSuccessful } from './utils';
import { ResolvedENS } from './types';
import { STANDARD_TIMEOUT } from './constants';
import { mainnetProvider } from '../../ethereumProviders';
import { ccipReadEnabled } from '../ccipReadHandler';

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
  
  try {
    // Use the comprehensive resolveNameAndMetadata function
    const result = await resolveNameAndMetadata(ensName, timeoutMs);
    
    if (result && result.address) {
      // Update cache with all metadata
      updateCache(ensName, {
        address: result.address,
        avatarUrl: result.avatarUrl,
        textRecords: result.textRecords
      });
      
      return result.address;
    }
    
    // No resolution found
    return handleFailedResolution(ensName);
    
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return handleFailedResolution(ensName);
  }
}

/**
 * Comprehensive resolution function that gets address and metadata
 */
export async function resolveNameAndMetadata(name: string, timeoutMs = STANDARD_TIMEOUT): Promise<ResolvedENS | null> {
  if (!name) return null;
  
  // Get effective ENS name (handles .box domains)
  const effectiveEnsName = getEffectiveEnsName(name);
  console.log(`Resolving domain: ${name} (effective: ${effectiveEnsName}) using provider`);
  
  try {
    // Setup abort controller with timeout
    const { controller, clear } = setupTimeoutController(timeoutMs);
    
    try {
      let address: string | null = null;
      let textRecords: Record<string, string | null> = {};
      
      // For .box domains, try CCIP-Read handler first
      if (name.endsWith('.box')) {
        const boxResult = await ccipReadEnabled.resolveDotBit(name);
        if (boxResult && boxResult.address) {
          address = boxResult.address;
          
          // Get any text records from the .box domain
          if (boxResult.textRecords) {
            textRecords = boxResult.textRecords;
          }
          
          // Add avatar if available from CCIP handler
          if (boxResult.avatar) {
            textRecords['avatar'] = boxResult.avatar;
          }
        }
      }
      
      // If we don't have an address yet, try standard methods
      if (!address) {
        // Try to get resolver
        const resolver = await mainnetProvider.getResolver(effectiveEnsName);
        
        // Try standard resolution methods in parallel
        address = await firstSuccessful([
          async () => resolver ? await resolver.getAddress() : null,
          async () => await mainnetProvider.resolveName(effectiveEnsName),
          async () => await resolveDotBoxDomain(name)
        ]);
        
        // If we have a resolver, fetch text records
        if (resolver) {
          textRecords = await fetchTextRecords(name, resolver);
        }
      }
      
      // If we have an address, return the result
      if (address) {
        // Determine avatar URL - prefer text records over metadata API
        let avatarUrl = textRecords['avatar'] || textRecords['avatar.ens'] || null;
        
        // If we don't have an avatar from text records, try metadata API
        if (!avatarUrl) {
          try {
            const metadataResponse = await fetch(`https://metadata.ens.domains/mainnet/avatar/${name}`, {
              method: 'HEAD',
              signal: controller.signal
            });
            
            if (metadataResponse.ok) {
              avatarUrl = `https://metadata.ens.domains/mainnet/avatar/${name}`;
            }
          } catch (e) {
            console.warn(`Error fetching avatar metadata for ${name}:`, e);
          }
        }
        
        return {
          address,
          name,
          avatarUrl: avatarUrl || undefined,
          textRecords
        };
      }
      
      // No successful resolution
      return null;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`ENS resolution for ${name} aborted after ${timeoutMs}ms`);
      } else {
        console.error(`Error resolving ${name}:`, error);
      }
      
      return null;
    } finally {
      clear();
    }
  } catch (error) {
    console.error(`Error resolving ${name}:`, error);
    return null;
  }
}
