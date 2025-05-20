
import { useState, useCallback } from 'react';
import { resolveEnsToAddress, resolveAddressToEns, getEnsAvatar, getEnsLinks, getEnsBio } from '@/utils/ensResolution';

// Cache for ENS resolution results to improve performance
const ensCache: Record<string, any> = {};
const addressCache: Record<string, any> = {};

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

  // Function to resolve ENS name to address with caching
  const resolveEns = useCallback(async (ensName: string) => {
    // Check cache first
    if (ensCache[ensName]) {
      console.log(`Using cached ENS data for ${ensName}`);
      setState(prev => ({...prev, ...ensCache[ensName]}));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Resolving ENS: ${ensName}`);
      
      // Use Promise.race to set a timeout
      const resolvePromise = resolveEnsToAddress(ensName);
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('ENS resolution timeout')), 3000)
      );
      
      const resolvedAddress = await Promise.race([resolvePromise, timeoutPromise]);
      
      if (resolvedAddress) {
        // Fetch links, avatar and bio in parallel with timeout
        try {
          const [links, avatar, bio] = await Promise.all([
            Promise.race([
              getEnsLinks(ensName, 'mainnet'),
              new Promise<any>((_, reject) => setTimeout(() => reject('Timeout'), 2000))
            ]).catch(() => ({ socials: {}, ensLinks: [], keywords: [] })),
            
            Promise.race([
              getEnsAvatar(ensName, 'mainnet'),
              new Promise<any>((_, reject) => setTimeout(() => reject('Timeout'), 2000))
            ]).catch(() => null),
            
            Promise.race([
              getEnsBio(ensName, 'mainnet'),
              new Promise<any>((_, reject) => setTimeout(() => reject('Timeout'), 2000))
            ]).catch(() => null)
          ]);
          
          console.log(`ENS resolution for ${ensName}: success`);
          
          const result = {
            resolvedAddress,
            ensLinks: links || { socials: {}, ensLinks: [], keywords: [] },
            avatarUrl: avatar || undefined,
            ensBio: bio || (links && 'description' in links ? links.description : undefined)
          };
          
          // Cache the result
          ensCache[ensName] = result;
          
          setState(prev => ({...prev, ...result}));
        } catch (error) {
          console.error(`Error fetching ENS data: ${error}`);
          
          // Still update the address even if other data failed
          setState(prev => ({
            ...prev,
            resolvedAddress
          }));
        }
      } else {
        setError(`Could not resolve ENS name: ${ensName}`);
      }
    } catch (error) {
      console.error(`Error resolving ${ensName}:`, error);
      setError(`Error resolving ENS: ${(error as Error).message}`);
    }
    
    setIsLoading(false);
  }, []);

  // Function to lookup address to ENS with caching
  const lookupAddress = useCallback(async (address: string) => {
    // Check cache first
    if (addressCache[address.toLowerCase()]) {
      console.log(`Using cached address data for ${address}`);
      setState(prev => ({...prev, ...addressCache[address.toLowerCase()]}));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Looking up address: ${address}`);
      
      // Use Promise.race to set a timeout
      const lookupPromise = resolveAddressToEns(address);
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('ENS lookup timeout')), 3000)
      );
      
      const result = await Promise.race([lookupPromise, timeoutPromise]);
      
      if (result) {
        // Fetch links, avatar and bio in parallel with timeout
        try {
          const [links, avatar, bio] = await Promise.all([
            Promise.race([
              getEnsLinks(result.ensName, 'mainnet'),
              new Promise<any>((_, reject) => setTimeout(() => reject('Timeout'), 2000))
            ]).catch(() => ({ socials: {}, ensLinks: [], keywords: [] })),
            
            Promise.race([
              getEnsAvatar(result.ensName, 'mainnet'),
              new Promise<any>((_, reject) => setTimeout(() => reject('Timeout'), 2000))
            ]).catch(() => null),
            
            Promise.race([
              getEnsBio(result.ensName, 'mainnet'),
              new Promise<any>((_, reject) => setTimeout(() => reject('Timeout'), 2000))
            ]).catch(() => null)
          ]);
          
          console.log(`Address lookup for ${address}: found ${result.ensName}`);
          
          const cacheResult = {
            resolvedEns: result.ensName,
            ensLinks: links || { socials: {}, ensLinks: [], keywords: [] },
            avatarUrl: avatar || undefined,
            ensBio: bio || (links && 'description' in links ? links.description : undefined)
          };
          
          // Cache the result
          addressCache[address.toLowerCase()] = cacheResult;
          
          setState(prev => ({...prev, ...cacheResult}));
        } catch (error) {
          console.error(`Error fetching ENS data for address: ${error}`);
          
          // Still update the ENS name even if other data failed
          setState(prev => ({
            ...prev,
            resolvedEns: result.ensName
          }));
        }
      } else {
        // Don't set error here, many addresses don't have ENS
        console.log(`No ENS found for address: ${address}`);
      }
    } catch (error) {
      console.error(`Error looking up ENS for address ${address}:`, error);
      // Don't set error, just log it - no ENS is normal
    }
    
    setIsLoading(false);
  }, []);

  return {
    state,
    setState,
    isLoading,
    error,
    resolveEns,
    lookupAddress
  };
}
