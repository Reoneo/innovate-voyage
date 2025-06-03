
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

  // Reduced maximum retry attempts for faster loading
  const MAX_RETRIES = 1;

  // Helper function to handle timeout for faster failures
  const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 3000): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      )
    ]);
  };

  // Function to resolve ENS name to address with optimized error handling
  const resolveEns = useCallback(async (ensName: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Resolving ENS (attempt ${currentTry}): ${ensName}`);
        
        const resolvedAddress = await withTimeout(resolveEnsToAddress(ensName));
        
        if (resolvedAddress) {
          // Fetch data with shorter timeout and graceful fallbacks
          const [links, avatar, bio] = await Promise.allSettled([
            withTimeout(getEnsLinks(ensName, 'mainnet'), 2000),
            withTimeout(getEnsAvatar(ensName, 'mainnet'), 2000),
            withTimeout(getEnsBio(ensName, 'mainnet'), 2000)
          ]);
          
          const resolvedLinks = links.status === 'fulfilled' ? links.value : { 
            socials: {}, ensLinks: [], keywords: [] 
          };
          const resolvedAvatar = avatar.status === 'fulfilled' ? avatar.value : null;
          const resolvedBio = bio.status === 'fulfilled' ? bio.value : null;
          
          console.log(`ENS resolution for ${ensName}:`, { 
            address: resolvedAddress,
            links: resolvedLinks,
            avatar: resolvedAvatar,
            bio: resolvedBio
          });
          
          setState(prev => ({
            ...prev,
            resolvedAddress,
            ensLinks: resolvedLinks || prev.ensLinks,
            avatarUrl: resolvedAvatar || prev.avatarUrl,
            ensBio: resolvedBio || (resolvedLinks && 'description' in resolvedLinks ? resolvedLinks.description : undefined) || prev.ensBio
          }));
          
          setIsLoading(false);
          return;
        }
        
        // Fast failure instead of retrying
        setError(`Could not resolve ENS name: ${ensName}`);
        break;
      } catch (error) {
        console.error(`Error resolving ${ensName} (attempt ${currentTry}):`, error);
        
        // For rate limiting or timeout errors, fail fast
        if (error instanceof Error && 
            (error.message.includes('timeout') || 
             error.message.includes('too many requests') ||
             error.message.includes('rate limit'))) {
          console.log('Rate limit or timeout detected, failing fast');
          break;
        }
        
        if (currentTry > MAX_RETRIES) {
          setError(`Error resolving ENS: ${error instanceof Error ? error.message : 'Unknown error'}`);
          break;
        }
        
        // Shorter wait for retry
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    setIsLoading(false);
    setRetryCount(currentTry);
  }, [MAX_RETRIES]);

  // Function to lookup address to ENS with optimized error handling
  const lookupAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Looking up address (attempt ${currentTry}): ${address}`);
        
        const result = await withTimeout(resolveAddressToEns(address));
        
        if (result) {
          // Fetch data with shorter timeout and graceful fallbacks
          const [links, avatar, bio] = await Promise.allSettled([
            withTimeout(getEnsLinks(result.ensName, 'mainnet'), 2000),
            withTimeout(getEnsAvatar(result.ensName, 'mainnet'), 2000),
            withTimeout(getEnsBio(result.ensName, 'mainnet'), 2000)
          ]);
          
          const resolvedLinks = links.status === 'fulfilled' ? links.value : { 
            socials: {}, ensLinks: [], keywords: [] 
          };
          const resolvedAvatar = avatar.status === 'fulfilled' ? avatar.value : null;
          const resolvedBio = bio.status === 'fulfilled' ? bio.value : null;
          
          console.log(`Address lookup for ${address}:`, {
            ens: result.ensName,
            links: resolvedLinks,
            avatar: resolvedAvatar,
            bio: resolvedBio
          });
          
          setState(prev => ({
            ...prev,
            resolvedEns: result.ensName,
            ensLinks: resolvedLinks || prev.ensLinks,
            avatarUrl: resolvedAvatar || prev.avatarUrl,
            ensBio: resolvedBio || (resolvedLinks && 'description' in resolvedLinks ? resolvedLinks.description : undefined) || prev.ensBio
          }));
          
          setIsLoading(false);
          return;
        }
        
        // Don't set error for addresses without ENS - this is normal
        console.log(`No ENS found for address: ${address}`);
        break;
      } catch (error) {
        console.error(`Error looking up ENS for address ${address} (attempt ${currentTry}):`, error);
        
        // For rate limiting or timeout errors, fail fast
        if (error instanceof Error && 
            (error.message.includes('timeout') || 
             error.message.includes('too many requests') ||
             error.message.includes('rate limit'))) {
          console.log('Rate limit or timeout detected, failing fast');
          break;
        }
        
        if (currentTry > MAX_RETRIES) {
          setError(`Error looking up address: ${error instanceof Error ? error.message : 'Unknown error'}`);
          break;
        }
        
        // Shorter wait for retry
        await new Promise(r => setTimeout(r, 500));
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
