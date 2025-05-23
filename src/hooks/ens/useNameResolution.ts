
import { useCallback } from 'react';
import { resolveNameAndMetadata } from '@/utils/ens/resolution';
import { checkEnsCache, updateEnsCache } from './ensResolutionUtils';
import { extractSocialsFromTextRecords } from '@/utils/ens/textRecords/textRecordUtils';

/**
 * Hook for resolving ENS names to addresses
 */
export function useNameResolution() {
  const resolveName = useCallback(async (
    ensName: string,
    {
      setState,
      setIsLoading,
      setError,
      abortController,
      setAbortController,
      resetState
    }: any
  ) => {
    // Check full cache first
    if (checkEnsCache(ensName, setState)) {
      return;
    }
    
    setIsLoading(true);
    resetState();
    
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
        setState((prev: any) => ({
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
  }, []);

  return { resolveName };
}
