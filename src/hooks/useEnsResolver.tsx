
import { useState, useEffect, useCallback } from 'react';
import { useEnsResolution } from './ens/useEnsResolution';
import { ethers } from 'ethers';
import { getFromEnsCache } from '@/utils/ethereumProviders';

// Debug flags
const DEBUG_ENS = false;

/**
 * A hook for resolving ENS names <-> addresses with additional ENS data
 * Uses improved caching and parallel data fetching
 * @param ensName - The ENS name to resolve
 * @param address - The address to resolve
 */
export function useEnsResolver(ensName?: string, address?: string) {
  const [retryCount, setRetryCount] = useState(0);
  const [lastInputs, setLastInputs] = useState({ ensName, address });
  
  const {
    state,
    setState,
    isLoading,
    error,
    resolveEns,
    lookupAddress
  } = useEnsResolution(ensName, address);
  
  // Check cache first to avoid unnecessary loading state
  useEffect(() => {
    // Only check cache if inputs have changed
    if (ensName !== lastInputs.ensName || address !== lastInputs.address) {
      setLastInputs({ ensName, address });
      
      if (ensName) {
        const cachedData = getFromEnsCache(ensName);
        if (cachedData) {
          if (DEBUG_ENS) console.log(`Using cached data for ${ensName}`);
          setState(prev => ({
            ...prev,
            resolvedAddress: cachedData.address,
            avatarUrl: cachedData.avatar || cachedData.avatarUrl,
            ensBio: cachedData.bio || cachedData.textRecords?.description,
            ensLinks: cachedData.links || { 
              socials: extractSocialsFromTextRecords(cachedData.textRecords), 
              ensLinks: [], 
              keywords: [] 
            },
            textRecords: cachedData.textRecords || {}
          }));
        }
      } else if (address) {
        const cachedData = getFromEnsCache(address.toLowerCase());
        if (cachedData && cachedData.ensName) {
          if (DEBUG_ENS) console.log(`Using cached data for ${address}`);
          setState(prev => ({
            ...prev,
            resolvedEns: cachedData.ensName,
            avatarUrl: cachedData.avatar || cachedData.avatarUrl,
            ensBio: cachedData.bio || cachedData.textRecords?.description,
            ensLinks: cachedData.links || { 
              socials: extractSocialsFromTextRecords(cachedData.textRecords), 
              ensLinks: [], 
              keywords: [] 
            },
            textRecords: cachedData.textRecords || {}
          }));
        }
      }
    }
  }, [ensName, address, setState, lastInputs]);
  
  // Helper function to extract social links from text records
  const extractSocialsFromTextRecords = (textRecords?: Record<string, string | null>) => {
    if (!textRecords) return {};
    
    const socials: Record<string, string> = {};
    
    // Map common ENS text records to social platform keys
    if (textRecords['com.twitter']) socials.twitter = textRecords['com.twitter'];
    if (textRecords['com.github']) socials.github = textRecords['com.github'];
    if (textRecords['com.discord']) socials.discord = textRecords['com.discord'];
    if (textRecords['org.telegram']) socials.telegram = textRecords['org.telegram'];
    if (textRecords['com.reddit']) socials.reddit = textRecords['com.reddit'];
    if (textRecords['email']) socials.email = textRecords['email'];
    if (textRecords['url']) socials.website = textRecords['url'];
    
    return socials;
  };
  
  // Determine if we have an ENS name to resolve
  const isEnsName = !!ensName && 
    (ensName.includes('.eth') || 
     ensName.includes('.box') || 
     ensName.includes('.id'));

  // Check if the input address looks valid
  const isValidAddress = !!address && ethers.isAddress(address);

  // Start resolution process when inputs change and not in cache
  useEffect(() => {
    if (DEBUG_ENS) console.log(`useEnsResolver: Inputs changed: ENS=${ensName}, address=${address}`);
    
    // Reset retry count when inputs change
    setRetryCount(0);
    
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

    // Only start resolution if we're not already loading from cache check
    if ((isEnsName || isValidAddress) && !isLoading) {
      startResolution();
    }
  }, [ensName, address, resolveEns, lookupAddress, isEnsName, isValidAddress, isLoading]);

  // Retry resolution if needed, but with a more aggressive backoff
  useEffect(() => {
    if (error && retryCount < 1) { // Reduced retries from 2 to 1
      const timer = setTimeout(() => {
        if (DEBUG_ENS) console.log(`useEnsResolver: Retrying resolution (${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        
        if (isEnsName) {
          resolveEns(ensName!);
        } else if (isValidAddress) {
          lookupAddress(address!);
        }
      }, 2000); // Slightly longer timeout for retry
      
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
        ensBio: state.ensBio,
        textRecords: state.textRecords,
        error,
        isLoading,
        retryCount
      });
    }
  }, [state, error, isLoading, retryCount]);

  return {
    resolvedAddress: state.resolvedAddress,
    resolvedEns: state.resolvedEns,
    avatarUrl: state.avatarUrl,
    ensLinks: state.ensLinks,
    ensBio: state.ensBio,
    textRecords: state.textRecords,
    isLoading,
    error
  };
}
