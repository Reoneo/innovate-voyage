
import { useState, useCallback, useEffect } from 'react';
import { resolveEnsToAddress, resolveAddressToEns } from '@/utils/ens/resolveEns';
import { getEnsAvatar, getEnsBio, getAllEnsData } from '@/utils/ens/ensRecords';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import { getFromEnsCache, addToEnsCache } from '@/utils/ethereumProviders';

interface EnsResolutionState {
  resolvedAddress: string | undefined;
  resolvedEns: string | undefined;
  avatarUrl: string | undefined;
  ensBio: string | undefined;
  ensLinks: {
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
    keywords?: string[];
  };
}

export function useEnsResolution(ensName?: string, address?: string) {
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
    const cachedResult = getFromEnsCache(ensName);
    if (cachedResult) {
      console.log(`Using cached ENS resolution data for ${ensName}`);
      setState(prev => ({
        ...prev, 
        resolvedAddress: cachedResult.address,
        avatarUrl: cachedResult.avatar,
        ensBio: cachedResult.bio,
        ensLinks: cachedResult.links || { socials: {}, ensLinks: [], keywords: [] }
      }));
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
      
      // Fetch all data in parallel for better performance
      const [ensData, links] = await Promise.all([
        // Primary data - address, avatar, bio
        getAllEnsData(ensName, 5000),
        
        // Links (can be fetched in parallel)
        getEnsLinks(ensName, 'mainnet').catch(() => ({ socials: {}, ensLinks: [], keywords: [] }))
      ]);
      
      // Only update if not aborted
      if (!controller.signal.aborted) {
        console.log(`ENS resolution for ${ensName}: success`);
        
        // Update state with all the resolved data
        setState(prev => ({
          ...prev,
          resolvedAddress: ensData.address || undefined,
          avatarUrl: ensData.avatar || undefined,
          ensBio: ensData.bio || undefined,
          ensLinks: links || { socials: {}, ensLinks: [], keywords: [] }
        }));
        
        // Cache all the data together
        addToEnsCache(ensName, {
          address: ensData.address || undefined,
          avatar: ensData.avatar || undefined,
          bio: ensData.bio || undefined,
          links
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
    const cachedResult = getFromEnsCache(cacheKey);
    if (cachedResult && cachedResult.ensName) {
      console.log(`Using cached address lookup data for ${address}`);
      setState(prev => ({
        ...prev,
        resolvedEns: cachedResult.ensName,
        avatarUrl: cachedResult.avatar,
        ensBio: cachedResult.bio,
        ensLinks: cachedResult.links || { socials: {}, ensLinks: [], keywords: [] }
      }));
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
        
        // Fetch all additional data in parallel
        const [avatar, bio, links] = await Promise.all([
          getEnsAvatar(ensName, 'mainnet', 5000).catch(() => null),
          getEnsBio(ensName, 'mainnet', 5000).catch(() => null),
          getEnsLinks(ensName, 'mainnet').catch(() => ({ socials: {}, ensLinks: [], keywords: [] }))
        ]);
        
        // Only update if not aborted
        if (!controller.signal.aborted) {
          console.log(`Address lookup for ${address}: found ${ensName} with additional data`);
          
          // Update state with all resolved data
          setState(prev => ({
            ...prev,
            resolvedEns: ensName,
            avatarUrl: avatar || undefined,
            ensBio: bio || undefined,
            ensLinks: links || { socials: {}, ensLinks: [], keywords: [] }
          }));
          
          // Cache the results
          addToEnsCache(cacheKey, {
            ensName,
            avatar: avatar || undefined,
            bio: bio || undefined,
            links
          });
          
          // Also cache in the opposite direction
          addToEnsCache(ensName, {
            address,
            avatar: avatar || undefined,
            bio: bio || undefined,
            links
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
