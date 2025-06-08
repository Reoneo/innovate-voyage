
import { useState, useCallback } from 'react';
import { resolveEnsToAddress, resolveAddressToEns } from '@/utils/ensResolution';
import { getCompleteENSData } from '@/services/ens/unifiedTextRecords';

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

  // Function to resolve ENS name to address using unified system
  const resolveEns = useCallback(async (ensName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Resolving ENS via unified system: ${ensName}`);
      
      // Resolve address
      const resolvedAddress = await resolveEnsToAddress(ensName);
      
      if (resolvedAddress) {
        // Fetch all ENS data using unified system
        const ensData = await getCompleteENSData(ensName);
        
        console.log(`Unified ENS resolution for ${ensName}:`, { 
          address: resolvedAddress,
          ensData
        });
        
        setState(prev => ({
          ...prev,
          resolvedAddress,
          avatarUrl: ensData.avatar || prev.avatarUrl,
          ensBio: ensData.description || prev.ensBio,
          ensLinks: {
            socials: ensData.socials,
            ensLinks: Object.values(ensData.socials).filter(Boolean),
            description: ensData.description || undefined,
            keywords: []
          }
        }));
      } else {
        setError(`Could not resolve ENS name: ${ensName}`);
      }
      
    } catch (error) {
      console.error(`Error in unified ENS resolution for ${ensName}:`, error);
      setError(`Error resolving ENS: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to lookup address to ENS using unified system
  const lookupAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Looking up address via unified system: ${address}`);
      
      const result = await resolveAddressToEns(address);
      
      if (result) {
        // Fetch all ENS data using unified system
        const ensData = await getCompleteENSData(result.ensName);
        
        console.log(`Unified address lookup for ${address}:`, {
          ens: result.ensName,
          ensData
        });
        
        setState(prev => ({
          ...prev,
          resolvedEns: result.ensName,
          avatarUrl: ensData.avatar || prev.avatarUrl,
          ensBio: ensData.description || prev.ensBio,
          ensLinks: {
            socials: ensData.socials,
            ensLinks: Object.values(ensData.socials).filter(Boolean),
            description: ensData.description || undefined,
            keywords: []
          }
        }));
      } else {
        console.log(`No ENS found for address: ${address}`);
      }
      
    } catch (error) {
      console.error(`Error in unified address lookup for ${address}:`, error);
      setError(`Error looking up address: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    state,
    setState,
    isLoading,
    setIsLoading,
    error,
    setError,
    retryCount: 0,
    resolveEns,
    lookupAddress
  };
}
