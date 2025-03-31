
import { useEffect } from 'react';
import { useEnsResolution } from './ens/useEnsResolution';
import { useWeb3BioData } from './ens/useWeb3BioData';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  // Normalize ENS name if provided without extension
  const normalizedEnsName = ensName && !ensName.includes('.') 
    ? `${ensName}.eth` 
    : ensName;
  
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
  } = useEnsResolution(normalizedEnsName, address);

  const { isLoading: isLoadingWeb3Bio } = useWeb3BioData(
    normalizedEnsName,
    address,
    !!isEns,
    (newState) => setState(prev => ({ ...prev, ...newState }))
  );

  // Effect to handle ENS resolution
  useEffect(() => {
    if (!normalizedEnsName) return;
    
    setIsLoading(true);
    setError(null);
    
    resolveEns(normalizedEnsName).finally(() => setIsLoading(false));
  }, [normalizedEnsName]);

  // Effect to handle address resolution
  useEffect(() => {
    if (!address || isEns) return;
    
    setIsLoading(true);
    setError(null);
    
    lookupAddress(address).finally(() => setIsLoading(false));
  }, [address, isEns]);

  return {
    resolvedAddress: state.resolvedAddress,
    resolvedEns: state.resolvedEns,
    avatarUrl: state.avatarUrl,
    ensBio: state.ensBio,
    ensLinks: state.ensLinks,
    isLoading: isLoadingEns || isLoadingWeb3Bio,
    error
  };
}
