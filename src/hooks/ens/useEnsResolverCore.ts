
import { useCallback } from 'react';
import { resolveEnsToAddress, resolveAddressToEns, getEnsLinks, getEnsAvatar, getEnsBio } from '@/utils/ensResolution';
import { EnsResolverProps, EnsFetchResult } from './types';

export function useEnsResolver({
  state,
  setState,
  isLoading,
  setIsLoading,
  error,
  setError,
  retryCount,
  setRetryCount,
  maxRetries
}: EnsResolverProps) {
  
  // Function to fetch ENS data (avatar, links, bio) with timeout protection
  const fetchEnsData = useCallback(async (name: string): Promise<EnsFetchResult> => {
    try {
      // Fetch links, avatar and bio in parallel with timeouts
      const [links, avatar, bio] = await Promise.all([
        Promise.race([
          getEnsLinks(name, 'mainnet'),
          new Promise(r => setTimeout(() => r({ socials: {}, ensLinks: [], keywords: [] }), 3000))
        ]).catch(() => ({ socials: {}, ensLinks: [], keywords: [] })),
        
        Promise.race([
          getEnsAvatar(name, 'mainnet'),
          new Promise(r => setTimeout(() => r(null), 3000))
        ]).catch(() => null),
        
        Promise.race([
          getEnsBio(name, 'mainnet'),
          new Promise(r => setTimeout(() => r(null), 3000))
        ]).catch(() => null)
      ]);
      
      return { links, avatar, bio };
    } catch (error) {
      console.error(`Error fetching ENS data for ${name}:`, error);
      return {};
    }
  }, []);

  // Function to update state with properly typed values
  const updateState = useCallback((updates: Partial<EnsFetchResult>, resolvedValue: { address?: string, ensName?: string }) => {
    setState(prev => ({
      ...prev,
      ...(resolvedValue.address && { resolvedAddress: resolvedValue.address }),
      ...(resolvedValue.ensName && { resolvedEns: resolvedValue.ensName }),
      ensLinks: updates.links || prev.ensLinks,
      avatarUrl: (updates.avatar as string | undefined) || prev.avatarUrl,
      ensBio: (updates.bio as string | undefined) || 
              (updates.links && 'description' in updates.links ? updates.links.description : undefined) || 
              prev.ensBio
    }));
  }, [setState]);

  // Function to resolve ENS name to address with retry logic and better error handling
  const resolveEns = useCallback(async (ensName: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= maxRetries) {
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
          // Fetch ENS data
          const ensData = await fetchEnsData(ensName);
          
          console.log(`ENS resolution for ${ensName}:`, { 
            address: resolvedAddress,
            links: ensData.links,
            avatar: ensData.avatar,
            bio: ensData.bio
          });
          
          // Update state with resolved data
          updateState(ensData, { address: resolvedAddress });
          
          setIsLoading(false);
          return;
        }
        
        // If we got null but no error thrown, try again or give up
        if (currentTry > maxRetries) {
          setError(`Could not resolve ENS name: ${ensName}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      } catch (error) {
        console.error(`Error resolving ${ensName} (attempt ${currentTry}):`, error);
        
        if (currentTry > maxRetries) {
          setError(`Error resolving ENS: ${(error as Error).message}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    setIsLoading(false);
    setRetryCount(currentTry);
  }, [maxRetries, fetchEnsData, updateState, setIsLoading, setError, setRetryCount]);

  // Function to lookup address to ENS with retry logic and better error handling
  const lookupAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= maxRetries) {
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
          // Fetch ENS data
          const ensData = await fetchEnsData(result.ensName);
          
          console.log(`Address lookup for ${address}:`, {
            ens: result.ensName,
            links: ensData.links,
            avatar: ensData.avatar,
            bio: ensData.bio
          });
          
          // Update state with resolved data
          updateState(ensData, { ensName: result.ensName });
          
          setIsLoading(false);
          return;
        }
        
        // If we got null but no error thrown, try again or give up
        if (currentTry > maxRetries) {
          // Don't set error here, just log - many addresses don't have ENS
          console.log(`No ENS found for address: ${address}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      } catch (error) {
        console.error(`Error looking up ENS for address ${address} (attempt ${currentTry}):`, error);
        
        if (currentTry > maxRetries) {
          setError(`Error looking up address: ${(error as Error).message}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    setIsLoading(false);
    setRetryCount(currentTry);
  }, [maxRetries, fetchEnsData, updateState, setIsLoading, setError, setRetryCount]);

  return { resolveEns, lookupAddress };
}
