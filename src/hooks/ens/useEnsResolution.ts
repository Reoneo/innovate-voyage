
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

  // Function to resolve ENS name to address with retry logic
  const resolveEns = useCallback(async (ensName: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Resolving ENS (attempt ${currentTry}): ${ensName}`);
        
        const resolvedAddress = await resolveEnsToAddress(ensName);
        
        if (resolvedAddress) {
          // Fetch links, avatar and bio in parallel
          const [links, avatar, bio] = await Promise.all([
            getEnsLinks(ensName, 'mainnet').catch(() => ({ 
              socials: {}, ensLinks: [], keywords: [] 
            })),
            getEnsAvatar(ensName, 'mainnet').catch(() => null),
            getEnsBio(ensName, 'mainnet').catch(() => null)
          ]);
          
          console.log(`ENS resolution for ${ensName}:`, { 
            address: resolvedAddress,
            links,
            avatar,
            bio
          });
          
          setState(prev => ({
            ...prev,
            resolvedAddress,
            ensLinks: links || prev.ensLinks,
            avatarUrl: avatar || prev.avatarUrl,
            ensBio: bio || links?.description || prev.ensBio
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

  // Function to lookup address to ENS with retry logic
  const lookupAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Looking up address (attempt ${currentTry}): ${address}`);
        
        const result = await resolveAddressToEns(address);
        
        if (result) {
          // Fetch links, avatar and bio in parallel
          const [links, avatar, bio] = await Promise.all([
            getEnsLinks(result.ensName, 'mainnet').catch(() => ({ 
              socials: {}, ensLinks: [], keywords: [] 
            })),
            getEnsAvatar(result.ensName, 'mainnet').catch(() => null),
            getEnsBio(result.ensName, 'mainnet').catch(() => null)
          ]);
          
          console.log(`Address lookup for ${address}:`, {
            ens: result.ensName,
            links,
            avatar,
            bio
          });
          
          setState(prev => ({
            ...prev,
            resolvedEns: result.ensName,
            ensLinks: links || prev.ensLinks,
            avatarUrl: avatar || prev.avatarUrl,
            ensBio: bio || (links && 'description' in links ? links.description : null) || prev.ensBio
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
