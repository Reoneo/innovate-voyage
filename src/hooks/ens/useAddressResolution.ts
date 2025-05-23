
import { useCallback } from 'react';
import { lookupAddressAndMetadata } from '@/utils/ens/resolution';
import { checkEnsCache, updateEnsCache } from './ensResolutionUtils';
import { extractSocialsFromTextRecords } from '@/utils/ens/textRecords/textRecordUtils';

/**
 * Hook for resolving Ethereum addresses to ENS names
 */
export function useAddressResolution() {
  const resolveAddress = useCallback(async (
    address: string,
    {
      setState,
      setIsLoading,
      setError,
      abortController,
      setAbortController,
      resetState
    }: any
  ) => {
    // Check cache first
    const cacheKey = address.toLowerCase();
    if (checkEnsCache(cacheKey, setState)) {
      return;
    }
    
    setIsLoading(true);
    resetState();
    
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
          setState((prev: any) => ({
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
  }, []);

  return { resolveAddress };
}
