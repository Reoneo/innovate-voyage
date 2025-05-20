
import { useState, useEffect, useCallback } from 'react';
import { useEnsResolution } from './ens/useEnsResolution';
import { useWeb3BioData } from './ens/useWeb3BioData';
import { ethers } from 'ethers';

// Debug flags
const DEBUG_ENS = false; // Reduced debugging to improve performance

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

  // Start resolution process when inputs change - with shorter timeout
  useEffect(() => {
    if (DEBUG_ENS) console.log(`useEnsResolver: Inputs changed: ENS=${ensName}, address=${address}`);
    
    const startResolution = async () => {
      if (isEnsName) {
        // Try to use cached data immediately if available
        const cacheKey = `ens_resolution_${ensName}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            if (parsed && parsed.resolvedAddress) {
              console.log('Using cached ENS resolution data for', ensName);
              setState(prev => ({
                ...prev,
                ...parsed
              }));
              return;
            }
          } catch (e) {
            console.error('Error parsing cached ENS data:', e);
          }
        }
        
        // Resolve ENS name to address
        if (DEBUG_ENS) console.log(`useEnsResolver: Resolving ENS name: ${ensName}`);
        const result = await resolveEns(ensName);
        
        // Cache successful results
        if (result && result.resolvedAddress) {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        }
      } else if (isValidAddress) {
        // Try to use cached data immediately if available
        const cacheKey = `address_resolution_${address}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            if (parsed && parsed.resolvedEns) {
              console.log('Using cached address resolution data for', address);
              setState(prev => ({
                ...prev,
                ...parsed
              }));
              return;
            }
          } catch (e) {
            console.error('Error parsing cached address data:', e);
          }
        }
        
        // Resolve address to ENS name
        if (DEBUG_ENS) console.log(`useEnsResolver: Looking up address: ${address}`);
        const result = await lookupAddress(address);
        
        // Cache successful results
        if (result && result.resolvedEns) {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        }
      }
    };

    startResolution();
  }, [ensName, address, resolveEns, lookupAddress, isEnsName, isValidAddress, setState]);

  // Retry resolution if needed - but with a shorter timeout
  useEffect(() => {
    if (error && retryCount < 1) { // Reduced retry count to 1 instead of 2
      const timer = setTimeout(() => {
        if (DEBUG_ENS) console.log(`useEnsResolver: Retrying resolution (${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        
        if (isEnsName) {
          resolveEns(ensName!);
        } else if (isValidAddress) {
          lookupAddress(address!);
        }
      }, 1000); // Reduced retry timeout from 1500ms to 1000ms
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, isEnsName, ensName, resolveEns, isValidAddress, address, lookupAddress]);

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
