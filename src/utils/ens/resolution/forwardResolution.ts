
// Forward resolution: ENS name -> address
import { checkCache, updateCache, handleFailedResolution, checkCacheForTextRecords } from './cache';
import { validateEnsName, setupTimeoutController, fetchTextRecords, firstSuccessful, getEffectiveEnsName } from './utils';
import { ResolvedENS } from './types';
import { STANDARD_TIMEOUT } from './constants';
import { mainnetProvider } from '../../ethereumProviders';

/**
 * Resolve ENS name to address with improved caching and error handling
 */
export async function resolveEnsToAddress(ensName: string, timeoutMs = STANDARD_TIMEOUT): Promise<string | null> {
  if (!ensName) return null;
  
  console.log(`Resolving ENS name: ${ensName}`);
  
  // Validate the input is actually an ENS name
  if (!validateEnsName(ensName)) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  try {
    // Use the comprehensive resolveNameAndMetadata function
    const result = await resolveNameAndMetadata(ensName, timeoutMs);
    
    if (result && result.address) {
      console.log(`Successfully resolved ${ensName} to ${result.address}`);
      return result.address;
    }
    
    // No resolution found
    console.log(`No resolution found for ${ensName}`);
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
  
  console.log(`Resolving domain: ${name}`);
  
  try {
    // Setup abort controller with timeout
    const { controller, clear } = setupTimeoutController(timeoutMs);
    
    try {
      let address: string | null = null;
      let textRecords: Record<string, string | null> = {};
      
      // For .box domains, treat them EXACTLY like .eth domains for ENS resolution
      let effectiveEnsName = name;
      if (name.endsWith('.box')) {
        effectiveEnsName = name.replace('.box', '.eth');
        console.log(`Converting .box to .eth for ENS resolution: ${name} -> ${effectiveEnsName}`);
      }
      
      console.log(`Using effective ENS name for resolution: ${effectiveEnsName}`);
      
      // Add detailed logging for provider calls
      console.log(`Getting resolver for ${effectiveEnsName}...`);
      const resolver = await mainnetProvider.getResolver(effectiveEnsName);
      console.log(`Resolver obtained:`, !!resolver);
      
      if (resolver) {
        console.log(`Attempting to get address from resolver...`);
        try {
          address = await resolver.getAddress();
          console.log(`Resolver getAddress result:`, address);
        } catch (resolverError) {
          console.warn(`Resolver getAddress failed:`, resolverError);
        }
      }
      
      // If resolver method failed, try direct resolveName
      if (!address) {
        console.log(`Trying direct resolveName for ${effectiveEnsName}...`);
        try {
          address = await mainnetProvider.resolveName(effectiveEnsName);
          console.log(`Direct resolveName result:`, address);
        } catch (resolveError) {
          console.warn(`Direct resolveName failed:`, resolveError);
        }
      }
      
      // If we have a resolver, fetch text records
      if (resolver) {
        try {
          textRecords = await fetchTextRecords(effectiveEnsName, resolver);
          console.log(`Text records fetched:`, Object.keys(textRecords));
        } catch (textRecordsError) {
          console.warn(`Failed to fetch text records:`, textRecordsError);
        }
      }
      
      // If we have an address, return the result
      if (address && address !== '0x0000000000000000000000000000000000000000') {
        // Determine avatar URL - prefer text records over metadata API
        let avatarUrl = textRecords['avatar'] || textRecords['avatar.ens'] || null;
        
        // If we don't have an avatar from text records, try metadata API
        if (!avatarUrl) {
          try {
            const metadataResponse = await fetch(`https://metadata.ens.domains/mainnet/avatar/${effectiveEnsName}`, {
              method: 'HEAD',
              signal: controller.signal
            });
            
            if (metadataResponse.ok) {
              avatarUrl = `https://metadata.ens.domains/mainnet/avatar/${effectiveEnsName}`;
            }
          } catch (e) {
            console.warn(`Error fetching avatar metadata for ${name}:`, e);
          }
        }
        
        console.log(`Successfully resolved ${name} to ${address}`);
        return {
          address,
          name,
          avatarUrl: avatarUrl || undefined,
          textRecords
        };
      }
      
      // No successful resolution
      console.log(`No resolution found for ${name}`);
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
