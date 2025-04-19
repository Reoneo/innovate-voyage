
import { useEffect, useState } from 'react';
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
  // Performance optimization - avoid unnecessary rendering cycles
  const [cacheBuster, setCacheBuster] = useState(0);
  
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
    (newState) => {
      setState(prev => {
        // Debug log to check what social links were found
        console.log("Updating state with web3bio data:", newState);
        
        // Only update if there are actually new social links or other data
        const hasSocialLinks = newState.ensLinks?.socials && 
          Object.keys(newState.ensLinks.socials).length > 0;
        
        // Always trigger re-render to ensure social links get updated
        setTimeout(() => setCacheBuster(prev => prev + 1), 10);
        
        return { ...prev, ...newState };
      });
    }
  );

  // Effect to handle direct address input - faster path
  useEffect(() => {
    if (directAddress) {
      console.log(`Direct address detected: ${directAddress}`);
      setState(prev => ({
        ...prev,
        resolvedAddress: directAddress
      }));
      
      // Still lookup possible ENS names for this address
      lookupAddress(directAddress).catch(err => console.error('Error looking up address:', err));
    }
  }, [directAddress]);

  // Effect to handle ENS resolution with higher priority
  useEffect(() => {
    if (!normalizedEnsName || directAddress) return;
    
    console.log(`Starting quick ENS resolution for ${normalizedEnsName}`);
    setIsLoading(true);
    setError(null);
    
    // Fast path for ENS resolution
    resolveEns(normalizedEnsName)
      .then(() => console.log('ENS resolution completed'))
      .catch(err => console.error('ENS resolution error:', err))
      .finally(() => setIsLoading(false));
  }, [normalizedEnsName, directAddress]);

  // Effect to handle address resolution
  useEffect(() => {
    if (!adjustedAddress || isEns || directAddress) return;
    
    console.log(`Starting address lookup for ${adjustedAddress}`);
    setIsLoading(true);
    setError(null);
    
    lookupAddress(adjustedAddress)
      .then(() => console.log('Address lookup completed'))
      .catch(err => console.error('Address lookup error:', err))
      .finally(() => setIsLoading(false));
  }, [adjustedAddress, isEns, directAddress, cacheBuster]);

  // Log the social links in the state for debugging
  useEffect(() => {
    console.log('useEnsResolver - Current state social links:', state.ensLinks?.socials);
  }, [state.ensLinks?.socials]);

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
