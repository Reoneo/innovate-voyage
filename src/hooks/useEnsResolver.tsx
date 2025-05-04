
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
export function useEnsResolver(ensName?: string, address?: string) {
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
      lookupAddress(directAddress).catch(err => {
        console.error("Error looking up ENS for address:", err);
        // Don't set error state - continue with the direct address
      });
    }
  }, [directAddress]);

  // Effect to handle ENS resolution
  useEffect(() => {
    if (!normalizedEnsName || directAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    const resolvePromise = async () => {
      try {
        await resolveEns(normalizedEnsName);
      } catch (err) {
        console.error("Error resolving ENS:", err);
        // Use partial data if available
        if (state.resolvedAddress) {
          console.log("Using partial data despite resolution error");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    resolvePromise();
  }, [normalizedEnsName, directAddress]);

  // Effect to handle address resolution
  useEffect(() => {
    if (!adjustedAddress || isEns || directAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    const lookupPromise = async () => {
      try {
        await lookupAddress(adjustedAddress);
      } catch (err) {
        console.error("Error looking up address:", err);
        // Use partial data if available
      } finally {
        setIsLoading(false);
      }
    };
    
    lookupPromise();
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
