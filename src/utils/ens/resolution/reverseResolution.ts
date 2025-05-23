
// Reverse resolution: address -> ENS name
import { checkCache, updateCache, handleFailedResolution, checkCacheForTextRecords } from './cache';
import { validateAddress, standardEnsLookup, dotBoxLookup, fetchTextRecords, firstSuccessful } from './utils';
import { EnsResolutionResult, ResolvedENS } from './types';
import { STANDARD_TIMEOUT } from './constants';
import { mainnetProvider } from '../../ethereumProviders';
import { ccipReadEnabled } from '../ccipReadHandler';

/**
 * Get effective ENS name (handle .box domains as .eth)
 */
function getEffectiveEnsName(ensName: string): string {
  // Always treat .box domains as .eth equivalents for resolution
  return ensName.endsWith('.box') 
    ? ensName.replace('.box', '.eth')
    : ensName;
}

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
    const textRecords = checkCacheForTextRecords(cacheKey);
    return { 
      ensName: cachedEnsName, 
      network: 'mainnet',
      textRecords 
    };
  }
  
  // Validate address format
  if (!validateAddress(address)) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  try {
    // Use comprehensive lookup function
    const result = await lookupAddressAndMetadata(address, timeoutMs);
    
    if (result && result.name) {
      // Update cache with all metadata
      updateCache(cacheKey, { 
        ensName: result.name,
        avatarUrl: result.avatarUrl,
        textRecords: result.textRecords
      });
      
      return { 
        ensName: result.name, 
        network: 'mainnet',
        textRecords: result.textRecords
      };
    }
    
    // No resolution found
    return handleFailedResolution(address);
    
  } catch (error) {
    console.error(`Error resolving address ${address}:`, error);
    return handleFailedResolution(address);
  }
}

/**
 * Comprehensive lookup function that gets ENS name and metadata
 */
export async function lookupAddressAndMetadata(address: string, timeoutMs = STANDARD_TIMEOUT): Promise<ResolvedENS | null> {
  if (!address) return null;
  
  try {
    // Try to resolve through multiple methods in parallel
    const name = await firstSuccessful([
      async () => await standardEnsLookup(address, timeoutMs),
      async () => await dotBoxLookup(address, timeoutMs)
    ]);
    
    if (!name) {
      return null;
    }
    
    console.log(`Resolved address ${address} to ${name}`);
    
    // For .box domains, treat as .eth equivalent for text record resolution
    const effectiveEnsName = getEffectiveEnsName(name);
    
    // Now that we have the name, fetch the text records
    let textRecords: Record<string, string | null> = {};
    let avatarUrl: string | undefined = undefined;
    
    // Get resolver for the effective ENS name (.eth equivalent)
    const resolver = await mainnetProvider.getResolver(effectiveEnsName);
    
    if (resolver) {
      // Fetch text records from .eth equivalent
      textRecords = await fetchTextRecords(effectiveEnsName, resolver);
      
      // Get avatar from text records or metadata API
      avatarUrl = textRecords['avatar'] || textRecords['avatar.ens'];
      
      if (!avatarUrl) {
        try {
          const metadataResponse = await fetch(`https://metadata.ens.domains/mainnet/avatar/${effectiveEnsName}`, {
            method: 'HEAD'
          });
          
          if (metadataResponse.ok) {
            avatarUrl = `https://metadata.ens.domains/mainnet/avatar/${effectiveEnsName}`;
          }
        } catch (e) {
          console.warn(`Error fetching avatar metadata for ${effectiveEnsName}:`, e);
        }
      }
    }
    
    // Special handling for .box domains - also try to get additional data
    if (name.endsWith('.box')) {
      try {
        const boxResult = await ccipReadEnabled.resolveDotBit(name);
        if (boxResult) {
          if (boxResult.avatar && !avatarUrl) {
            avatarUrl = boxResult.avatar;
            textRecords['avatar'] = boxResult.avatar;
          }
          
          if (boxResult.textRecords) {
            textRecords = { ...textRecords, ...boxResult.textRecords };
          }
        }
      } catch (e) {
        console.warn(`Error fetching .box data for ${name}:`, e);
      }
    }
    
    return {
      address,
      name,
      avatarUrl,
      textRecords
    };
  } catch (error) {
    console.error(`Error in lookupAddressAndMetadata for ${address}:`, error);
    return null;
  }
}
