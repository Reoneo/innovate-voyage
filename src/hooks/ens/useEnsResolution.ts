
import { useState, useCallback, useEffect } from 'react';
import { resolveEnsToAddress, resolveAddressToEns } from '@/utils/ens/resolveEns';
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
    }
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
      
      const ensData = await fetchEnsData(ensName, controller);
      
      // Only update if not aborted
      if (!controller.signal.aborted) {
        console.log(`ENS resolution for ${ensName}: success`);
        
        // Update state with all the resolved data
        setState(prev => ({
          ...prev,
          resolvedAddress: ensData.address,
          avatarUrl: ensData.avatar,
          ensBio: ensData.bio,
          ensLinks: ensData.links
        }));
        
        // Cache all the data together
        updateEnsCache(ensName, ensData);
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
      
      // Get ENS name for the address
      const result = await resolveAddressToEns(address, 5000);
      
      // If we found an ENS name, fetch additional data
      if (result && !controller.signal.aborted) {
        const ensName = result.ensName;
        console.log(`Found ENS name for ${address}: ${ensName}`);
        
        // Fetch additional data
        const additionalData = await fetchAdditionalEnsData(ensName, controller);
        
        // Only update if not aborted
        if (!controller.signal.aborted) {
          console.log(`Address lookup for ${address}: found ${ensName} with additional data`);
          
          // Update state with all resolved data
          setState(prev => ({
            ...prev,
            resolvedEns: ensName,
            avatarUrl: additionalData.avatar,
            ensBio: additionalData.bio,
            ensLinks: additionalData.links
          }));
          
          // Cache the results
          updateEnsCache(cacheKey, {
            ensName,
            ...additionalData
          });
          
          // Also cache in the opposite direction
          updateEnsCache(ensName, {
            address,
            ...additionalData
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

  return {
    state,
    setState,
    isLoading,
    error,
    resolveEns,
    lookupAddress
  };
}
