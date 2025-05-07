
import { useState, useEffect, useCallback } from 'react';
import { useEnsResolution } from './ens/useEnsResolution';
import { useWeb3BioData } from './ens/useWeb3BioData';
import { ethers } from 'ethers';

// Debug flags
const DEBUG_ENS = true;

/**
 * A hook for resolving ENS names <-> addresses with additional ENS data
 * @param ensName - The ENS name to resolve
 * @param address - The address to resolve
 */
export function useEnsResolver(ensName?: string, address?: string) {
  const [retryCount, setRetryCount] = useState(0);
  
  const {
    state,
    setState,
    isLoading,
    error,
    resolveEns,
    lookupAddress
  } = useEnsResolution(ensName, address);
  
  // Determine if we have an ENS name to resolve
  const isEnsName = !!ensName && 
    (ensName.includes('.eth') || 
     ensName.includes('.box') || 
     ensName.includes('.id'));

  // Check if the input address looks valid
  const isValidAddress = !!address && ethers.isAddress(address);

  // Update handler for Web3Bio data
  const updateStateFromWeb3Bio = useCallback((data: any) => {
    if (DEBUG_ENS) console.log('useEnsResolver: Updating state from Web3Bio', data);
    setState(prev => ({
      ...prev,
      ...data
    }));
  }, [setState]);

  // Try Web3Bio as an alternative resolution source
  const { isLoading: isLoadingWeb3Bio } = useWeb3BioData(
    isEnsName ? ensName : undefined,
    isValidAddress ? address : undefined,
    isEnsName,
    updateStateFromWeb3Bio
  );

  // Start resolution process when inputs change
  useEffect(() => {
    if (DEBUG_ENS) console.log(`useEnsResolver: Inputs changed: ENS=${ensName}, address=${address}`);
    
    const startResolution = async () => {
      if (isEnsName) {
        // Resolve ENS name to address
        if (DEBUG_ENS) console.log(`useEnsResolver: Resolving ENS name: ${ensName}`);
        await resolveEns(ensName);
      } else if (isValidAddress) {
        // Resolve address to ENS name
        if (DEBUG_ENS) console.log(`useEnsResolver: Looking up address: ${address}`);
        await lookupAddress(address);
      }
    };

    startResolution();
  }, [ensName, address, resolveEns, lookupAddress, isEnsName, isValidAddress]);

  // Retry resolution if needed
  useEffect(() => {
    if (error && retryCount < 2) {
      const timer = setTimeout(() => {
        if (DEBUG_ENS) console.log(`useEnsResolver: Retrying resolution (${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        
        if (isEnsName) {
          resolveEns(ensName!);
        } else if (isValidAddress) {
          lookupAddress(address!);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, isEnsName, ensName, resolveEns, isValidAddress, address, lookupAddress]);

  // Log the state after all processing
  useEffect(() => {
    if (DEBUG_ENS) {
      console.log('useEnsResolver: Resolution state:', {
        resolvedAddress: state.resolvedAddress,
        resolvedEns: state.resolvedEns,
        avatarUrl: state.avatarUrl,
        ensLinks: state.ensLinks,
        error,
        isLoading: isLoading || isLoadingWeb3Bio,
        retryCount
      });
    }
  }, [state, error, isLoading, isLoadingWeb3Bio, retryCount]);

  return {
    resolvedAddress: state.resolvedAddress,
    resolvedEns: state.resolvedEns,
    avatarUrl: state.avatarUrl,
    ensLinks: state.ensLinks,
    ensBio: state.ensBio,
    isLoading: isLoading || isLoadingWeb3Bio,
    error
  };
}
