import { getEnsData } from '@/utils/ensResolver';
import { EfpPerson } from '@/hooks/useEfpStats';

export async function resolveUserDetails(addresses: string[]): Promise<EfpPerson[]> {
  const results: EfpPerson[] = [];
  
  // Process in chunks to avoid overwhelming the API
  const chunkSize = 5;
  for (let i = 0; i < addresses.length; i += chunkSize) {
    const chunk = addresses.slice(i, i + chunkSize);
    const promises = chunk.map(async (addr) => {
      const { ensName, avatar } = await getEnsData(addr);
      return { address: addr, ensName, avatar };
    });
    
    const resolvedChunk = await Promise.all(promises);
    results.push(...resolvedChunk);
  }
  
  return results;
}

export interface EnsResolverResult {
  resolvedAddress?: string;
  resolvedEns?: string;
  avatarUrl?: string;
  ensBio?: string;
  ensLinks?: {
    socials?: Record<string, string>;
    ensLinks?: string[];
    description?: string;
  };
  isLoading: boolean;
  error?: Error | null;
}

import { useEffect } from 'react';
import { useEnsResolution } from './ens/useEnsResolution';
import { useWeb3BioData } from './ens/useWeb3BioData';
import { isValidEthereumAddress } from '@/lib/utils';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string): EnsResolverResult {
  // Check if we're directly dealing with an Ethereum address
  const directAddress = ensName && isValidEthereumAddress(ensName) ? ensName : undefined;
  
  // If ensName is actually an Ethereum address, reassign variables
  const adjustedAddress = directAddress || address;
  const adjustedEnsName = directAddress ? undefined : ensName;
  
  // Normalize ENS name if provided without extension
  const normalizedEnsName = adjustedEnsName && !adjustedEnsName.includes('.') 
    ? `${adjustedEnsName}.eth` 
    : adjustedEnsName;
  
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = normalizedEnsName?.includes('.eth') || normalizedEnsName?.includes('.box');
  
  const {
    state,
    setState,
    isLoading: isLoadingEns,
    setIsLoading,
    error,
    setError,
    resolveEns,
    lookupAddress
  } = useEnsResolution(normalizedEnsName, adjustedAddress);

  const { isLoading: isLoadingWeb3Bio } = useWeb3BioData(
    normalizedEnsName,
    adjustedAddress,
    !!isEns,
    (newState) => setState(prev => ({ ...prev, ...newState }))
  );

  // Effect to handle direct address input
  useEffect(() => {
    if (directAddress) {
      console.log(`Direct address detected: ${directAddress}`);
      setState(prev => ({
        ...prev,
        resolvedAddress: directAddress
      }));
      
      // Still lookup possible ENS names for this address
      lookupAddress(directAddress);
    }
  }, [directAddress]);

  // Effect to handle ENS resolution
  useEffect(() => {
    if (!normalizedEnsName || directAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    resolveEns(normalizedEnsName).finally(() => setIsLoading(false));
  }, [normalizedEnsName, directAddress]);

  // Effect to handle address resolution
  useEffect(() => {
    if (!adjustedAddress || isEns || directAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    lookupAddress(adjustedAddress).finally(() => setIsLoading(false));
  }, [adjustedAddress, isEns, directAddress]);

  return {
    resolvedAddress: state.resolvedAddress || directAddress,
    resolvedEns: state.resolvedEns,
    avatarUrl: state.avatarUrl,
    ensBio: state.ensBio,
    ensLinks: state.ensLinks,
    isLoading: isLoadingEns || isLoadingWeb3Bio,
    error
  };
}
