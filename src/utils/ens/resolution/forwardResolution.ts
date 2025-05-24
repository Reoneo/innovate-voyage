
// Forward resolution: ENS name -> address
import { checkCache, updateCache, handleFailedResolution, checkCacheForTextRecords } from './cache';
import { validateEnsName, setupTimeoutController, fetchTextRecords, firstSuccessful, getEffectiveEnsName } from './utils';
import { ResolvedENS } from './types';
import { STANDARD_TIMEOUT } from './constants';
import { mainnetProvider, optimismProvider } from '../../ethereumProviders';
import { ccipReadEnabled } from '../ccipReadHandler';
import { resolveBoxDomainOnOptimism } from './optimismResolver';

/**
 * Resolve ENS name to address with improved caching and error handling
 */
export async function resolveEnsToAddress(ensName: string, timeoutMs = STANDARD_TIMEOUT): Promise<string | null> {
  if (!ensName) return null;
  
  // Cache disabled - always resolve fresh
  
  // Validate the input is actually an ENS name
  if (!validateEnsName(ensName)) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  try {
    // Use the comprehensive resolveNameAndMetadata function
    const result = await resolveNameAndMetadata(ensName, timeoutMs);
    
    if (result && result.address) {
      // Cache disabled - just return the address
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
  
  console.log(`Resolving domain: ${name}`);
  
  try {
    // Setup abort controller with timeout
    const { controller, clear } = setupTimeoutController(timeoutMs);
    
    try {
      let address: string | null = null;
      let textRecords: Record<string, string | null> = {};
      
      // For .box domains, prioritize Optimism resolution
      if (name.endsWith('.box')) {
        console.log(`Resolving .box domain on Optimism: ${name}`);
        
        // Try Optimism first for .box domains
        address = await resolveBoxDomainOnOptimism(name);
        
        if (address) {
          console.log(`Optimism resolved ${name} to ${address}`);
          
          // Try to get text records from Optimism
          try {
            const resolver = await optimismProvider.getResolver(name.replace('.box', '.eth'));
            if (resolver) {
              textRecords = await fetchTextRecords(name.replace('.box', '.eth'), resolver);
            }
          } catch (e) {
            console.warn(`Could not get text records from Optimism for ${name}:`, e);
          }
          
          // If no text records from Optimism, try CCIP
          if (Object.keys(textRecords).length === 0) {
            try {
              const boxResult = await ccipReadEnabled.resolveDotBit(name);
              if (boxResult && boxResult.textRecords) {
                textRecords = boxResult.textRecords;
              }
            } catch (e) {
              console.warn(`CCIP error for ${name}:`, e);
            }
          }
        }
      }
      
      // If not resolved yet or not a .box domain, try mainnet resolution
      if (!address) {
        const effectiveEnsName = getEffectiveEnsName(name);
        console.log(`Trying mainnet resolution for: ${effectiveEnsName}`);
        
        const resolver = await mainnetProvider.getResolver(effectiveEnsName);
        
        // Try multiple resolution methods in parallel
        address = await firstSuccessful([
          async () => resolver ? await resolver.getAddress() : null,
          async () => await mainnetProvider.resolveName(effectiveEnsName)
        ]);
        
        // If we have a resolver, fetch text records
        if (resolver) {
          textRecords = await fetchTextRecords(effectiveEnsName, resolver);
        }
      }
      
      // If we have an address, return the result
      if (address) {
        // Determine avatar URL - prefer text records over metadata API
        let avatarUrl = textRecords['avatar'] || textRecords['avatar.ens'] || null;
        
        // If we don't have an avatar from text records, try metadata API
        if (!avatarUrl) {
          try {
            const effectiveEnsName = name.endsWith('.box') ? name.replace('.box', '.eth') : name;
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
