
import { useState, useCallback, useEffect } from 'react';
import { resolveEnsToAddress, resolveAddressToEns, resolveNameAndMetadata, lookupAddressAndMetadata } from '@/utils/ens/resolution';
import { getEnsAvatar, getEnsBio } from '@/utils/ens/ensRecords';
import { EnsResolutionState, EnsResolutionResult } from './types';
import { fetchEnsData, fetchAdditionalEnsData, checkEnsCache, updateEnsCache } from './ensResolutionUtils';

/**
 * A hook for ENS name <-> address resolution with metadata
 * Provides efficient parallel data fetching and caching
 */
export function useEnsResolution(ensName?: string, address?: string): EnsResolutionResult {
  const [state, setState] = useState<EnsResolutionState>({
    resolvedAddress: address,
    resolvedEns: ensName,
    avatarUrl: undefined,
    ensBio: undefined,
    ensLinks: {
      socials: {},
      ensLinks: [],
      keywords: []
    },
    textRecords: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Cleanup function for any ongoing requests
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  // Function to resolve ENS name to address with improved caching and parallel fetching
  const resolveEns = useCallback(async (ensName: string) => {
    // Check full cache first
    if (checkEnsCache(ensName, setState)) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Cancel any previous request
    if (abortController) {
      abortController.abort();
    }
    
    // Create new abort controller
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      console.log(`Resolving ENS: ${ensName}`);
      
      // Use the new comprehensive resolution function
      const ensData = await resolveNameAndMetadata(ensName);
      
      // Only update if not aborted
      if (!controller.signal.aborted && ensData) {
        console.log(`ENS resolution for ${ensName}: success`);
        
        // Extract social links from text records
        const socials = extractSocialsFromTextRecords(ensData.textRecords);
        
        // Update state with all the resolved data
        setState(prev => ({
          ...prev,
          resolvedAddress: ensData.address,
          avatarUrl: ensData.avatarUrl,
          ensBio: ensData.textRecords?.description || undefined,
          textRecords: ensData.textRecords,
          ensLinks: {
            socials,
            ensLinks: [],
            keywords: ensData.textRecords?.keywords?.split(',').map(k => k.trim()) || []
          }
        }));
        
        // Cache all the data together
        updateEnsCache(ensName, {
          address: ensData.address,
          avatar: ensData.avatarUrl,
          bio: ensData.textRecords?.description,
          textRecords: ensData.textRecords,
          links: {
            socials,
            ensLinks: [],
            keywords: ensData.textRecords?.keywords?.split(',').map(k => k.trim()) || []
          }
        });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error(`Error resolving ${ensName}:`, error);
        setError(`Error resolving ENS: ${(error as Error).message}`);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setAbortController(null);
      }
    }
  }, [abortController]);

  // Function to lookup address to ENS with improved caching and parallel fetching
  const lookupAddress = useCallback(async (address: string) => {
    // Check cache first
    const cacheKey = address.toLowerCase();
    if (checkEnsCache(cacheKey, setState)) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Cancel any previous request
    if (abortController) {
      abortController.abort();
    }
    
    // Create new abort controller
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      console.log(`Looking up address: ${address}`);
      
      // Get ENS name for the address using the comprehensive function
      const result = await lookupAddressAndMetadata(address);
      
      // If we found an ENS name, process the data
      if (result && !controller.signal.aborted) {
        const ensName = result.name;
        console.log(`Found ENS name for ${address}: ${ensName}`);
        
        // Extract social links from text records
        const socials = extractSocialsFromTextRecords(result.textRecords);
        
        // Only update if not aborted
        if (!controller.signal.aborted) {
          console.log(`Address lookup for ${address}: found ${ensName} with data`);
          
          // Update state with all resolved data
          setState(prev => ({
            ...prev,
            resolvedEns: ensName,
            avatarUrl: result.avatarUrl,
            ensBio: result.textRecords?.description || undefined,
            textRecords: result.textRecords,
            ensLinks: {
              socials,
              ensLinks: [],
              keywords: result.textRecords?.keywords?.split(',').map(k => k.trim()) || []
            }
          }));
          
          // Cache the results
          updateEnsCache(cacheKey, {
            ensName,
            avatar: result.avatarUrl,
            bio: result.textRecords?.description,
            textRecords: result.textRecords,
            links: {
              socials,
              ensLinks: [],
              keywords: result.textRecords?.keywords?.split(',').map(k => k.trim()) || []
            }
          });
          
          // Also cache in the opposite direction
          updateEnsCache(ensName!, {
            address,
            avatar: result.avatarUrl,
            bio: result.textRecords?.description,
            textRecords: result.textRecords,
            links: {
              socials,
              ensLinks: [],
              keywords: result.textRecords?.keywords?.split(',').map(k => k.trim()) || []
            }
          });
        }
      } else if (!controller.signal.aborted) {
        // No ENS found but not aborted
        console.log(`No ENS found for address: ${address}`);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error(`Error looking up ENS for address ${address}:`, error);
        // Don't set error, just log it - no ENS is normal
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setAbortController(null);
      }
    }
  }, [abortController]);

  // Helper function to extract social links from text records
  const extractSocialsFromTextRecords = (textRecords?: Record<string, string | null>) => {
    if (!textRecords) return {};
    
    const socials: Record<string, string> = {};
    
    // Map common ENS text records to social platform keys
    if (textRecords['com.twitter']) socials.twitter = textRecords['com.twitter'];
    if (textRecords['com.github']) socials.github = textRecords['com.github'];
    if (textRecords['com.discord']) socials.discord = textRecords['com.discord'];
    if (textRecords['org.telegram']) socials.telegram = textRecords['org.telegram'];
    if (textRecords['com.reddit']) socials.reddit = textRecords['com.reddit'];
    if (textRecords['email']) socials.email = textRecords['email'];
    if (textRecords['url']) socials.website = textRecords['url'];
    
    return socials;
  };

  return {
    state,
    setState,
    isLoading,
    error,
    resolveEns,
    lookupAddress
  };
}
