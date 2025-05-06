
import { useState, useCallback } from 'react';
import { resolveEnsToAddress, resolveAddressToEns, getEnsAvatar, getEnsLinks, getEnsBio } from '@/utils/ensResolution';

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
  const [retryCount, setRetryCount] = useState(0);

  // Maximum number of retry attempts
  const MAX_RETRIES = 2;

  // Function to resolve ENS name to address with retry logic and better error handling
  const resolveEns = useCallback(async (ensName: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Resolving ENS (attempt ${currentTry}): ${ensName}`);
        
        // Use a timeout to prevent hanging forever
        const resolvePromise = resolveEnsToAddress(ensName);
        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error("ENS resolution timeout")), 5000);
        });
        
        const resolvedAddress = await Promise.race([resolvePromise, timeoutPromise]) as string;
        
        if (resolvedAddress) {
          // Fetch links, avatar and bio in parallel with timeouts
          const [links, avatar, bio] = await Promise.all([
            Promise.race([
              getEnsLinks(ensName, 'mainnet'),
              new Promise(r => setTimeout(() => r({ socials: {}, ensLinks: [], keywords: [] }), 3000))
            ]).catch(() => ({ socials: {}, ensLinks: [], keywords: [] })),
            
            Promise.race([
              getEnsAvatar(ensName, 'mainnet'),
              new Promise(r => setTimeout(() => r(null), 3000))
            ]).catch(() => null),
            
            Promise.race([
              getEnsBio(ensName, 'mainnet'),
              new Promise(r => setTimeout(() => r(null), 3000))
            ]).catch(() => null)
          ]);
          
          console.log(`ENS resolution for ${ensName}:`, { 
            address: resolvedAddress,
            links,
            avatar,
            bio
          });
          
          // Fixed type issues by ensuring we're using the correct types
          setState(prev => ({
            ...prev,
            resolvedAddress,
            ensLinks: links || prev.ensLinks,
            avatarUrl: avatar as string | undefined || prev.avatarUrl,
            ensBio: bio as string | undefined || (links && 'description' in links ? links.description : undefined) || prev.ensBio
          }));
          
          setIsLoading(false);
          return;
        }
        
        // If we got null but no error thrown, try again or give up
        if (currentTry > MAX_RETRIES) {
          setError(`Could not resolve ENS name: ${ensName}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      } catch (error) {
        console.error(`Error resolving ${ensName} (attempt ${currentTry}):`, error);
        
        if (currentTry > MAX_RETRIES) {
          setError(`Error resolving ENS: ${(error as Error).message}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    setIsLoading(false);
    setRetryCount(currentTry);
  }, [MAX_RETRIES]);

  // Function to lookup address to ENS with retry logic and better error handling
  const lookupAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Looking up address (attempt ${currentTry}): ${address}`);
        
        // Use a timeout to prevent hanging forever
        const lookupPromise = resolveAddressToEns(address);
        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error("ENS lookup timeout")), 5000);
        });
        
        const result = await Promise.race([lookupPromise, timeoutPromise]);
        
        if (result) {
          // Fetch links, avatar and bio in parallel with timeouts
          const [links, avatar, bio] = await Promise.all([
            Promise.race([
              getEnsLinks(result.ensName, 'mainnet'),
              new Promise(r => setTimeout(() => r({ socials: {}, ensLinks: [], keywords: [] }), 3000))
            ]).catch(() => ({ socials: {}, ensLinks: [], keywords: [] })),
            
            Promise.race([
              getEnsAvatar(result.ensName, 'mainnet'),
              new Promise(r => setTimeout(() => r(null), 3000))
            ]).catch(() => null),
            
            Promise.race([
              getEnsBio(result.ensName, 'mainnet'),
              new Promise(r => setTimeout(() => r(null), 3000))
            ]).catch(() => null)
          ]);
          
          console.log(`Address lookup for ${address}:`, {
            ens: result.ensName,
            links,
            avatar,
            bio
          });
          
          // Fixed type issues by ensuring we're using the correct types
          setState(prev => ({
            ...prev,
            resolvedEns: result.ensName,
            ensLinks: links || prev.ensLinks,
            avatarUrl: avatar as string | undefined || prev.avatarUrl,
            ensBio: bio as string | undefined || (links && 'description' in links ? links.description : undefined) || prev.ensBio
          }));
          
          setIsLoading(false);
          return;
        }
        
        // If we got null but no error thrown, try again or give up
        if (currentTry > MAX_RETRIES) {
          // Don't set error here, just log - many addresses don't have ENS
          console.log(`No ENS found for address: ${address}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      } catch (error) {
        console.error(`Error looking up ENS for address ${address} (attempt ${currentTry}):`, error);
        
        if (currentTry > MAX_RETRIES) {
          setError(`Error looking up address: ${(error as Error).message}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    setIsLoading(false);
    setRetryCount(currentTry);
  }, [MAX_RETRIES]);

  return {
    state,
    setState,
    isLoading,
    setIsLoading,
    error,
    setError,
    retryCount,
    resolveEns,
    lookupAddress
  };
}
