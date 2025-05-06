
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { getEnsAvatar, getEnsBio, getEnsLinks } from '@/utils/ensResolution';
import { EnsResolverProps, EnsFetchResult } from './types';

export function useEnsResolver(props: EnsResolverProps) {
  const { 
    state, 
    setState, 
    isLoading, 
    setIsLoading, 
    error, 
    setError, 
    retryCount,
    setRetryCount,
    maxRetries
  } = props;

  // Helper function to fetch additional ENS data (avatar, bio, links)
  const fetchEnsData = useCallback(async (
    ensName: string
  ): Promise<Partial<EnsFetchResult>> => {
    try {
      // Get ENS avatar
      const avatar = await getEnsAvatar(ensName);
      
      // Get ENS bio
      const bio = await getEnsBio(ensName);
      
      // Get ENS links
      const ensLinks = await getEnsLinks(ensName);
      
      return { 
        avatar: avatar as string, 
        bio: bio as string,
        ensLinks: ensLinks as EnsFetchResult['ensLinks']
      };
    } catch (error) {
      console.error('Error fetching ENS data:', error);
      return {};
    }
  }, []);

  // Parse and validate results of ENS resolution
  const processEnsData = useCallback(async (
    ensName: string, 
    resolvedAddress: string
  ) => {
    try {
      const ensData = await fetchEnsData(ensName);
      
      setState(prev => ({
        ...prev,
        resolvedAddress,
        resolvedEns: ensName,
        avatarUrl: ensData.avatar || prev.avatarUrl,
        ensBio: ensData.bio || prev.ensBio,
        ensLinks: ensData.ensLinks || prev.ensLinks
      }));
      
      return true;
    } catch (err) {
      console.error('Error processing ENS data:', err);
      return false;
    }
  }, [fetchEnsData, setState]);

  // Parse and validate results of address lookup
  const processAddressLookup = useCallback(async (
    address: string, 
    resolvedEns: string
  ) => {
    try {
      const ensData = await fetchEnsData(resolvedEns);
      
      setState(prev => ({
        ...prev,
        resolvedEns,
        resolvedAddress: address,
        avatarUrl: ensData.avatar || prev.avatarUrl,
        ensBio: ensData.bio || prev.ensBio,
        ensLinks: ensData.ensLinks || prev.ensLinks
      }));
      
      return true;
    } catch (err) {
      console.error('Error processing address lookup:', err);
      return false;
    }
  }, [fetchEnsData, setState]);

  // Resolve ENS name to address
  const resolveEns = useCallback(async (
    ensName: string
  ) => {
    if (!ensName) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Resolving ENS name to address: ${ensName}`);
      
      // Check for valid ENS name
      if (!ensName.includes('.')) {
        throw new Error('Invalid ENS name format');
      }
      
      // Create a provider
      const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
      
      // Resolve ENS name to address
      const address = await provider.resolveName(ensName);
      
      if (!address) {
        throw new Error(`Could not resolve ENS name: ${ensName}`);
      }
      
      console.log(`Resolved ${ensName} to address: ${address}`);
      
      // Process the results
      await processEnsData(ensName, address);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error resolving ENS name:', err);
      setError(`Failed to resolve ENS name: ${ensName}`);
      setIsLoading(false);
      
      // Reset state with just the ENS name
      setState(prev => ({
        ...prev,
        resolvedEns: ensName,
        resolvedAddress: undefined
      }));
      
      return false;
    }
  }, [processEnsData, setError, setIsLoading, setState]);

  // Lookup address to ENS name
  const lookupAddress = useCallback(async (
    address: string
  ) => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Looking up address to ENS: ${address}`);
      
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }
      
      // Create a provider
      const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
      
      // Lookup address to ENS name
      const ensName = await provider.lookupAddress(address);
      
      console.log(`Lookup result for ${address}: ${ensName || 'No ENS found'}`);
      
      if (!ensName) {
        // No ENS found, set state with just the address
        setState(prev => ({
          ...prev,
          resolvedAddress: address,
          resolvedEns: undefined
        }));
        
        setIsLoading(false);
        return true;
      }
      
      // Process the results
      await processAddressLookup(address, ensName);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error looking up address to ENS:', err);
      setError(`Failed to lookup address: ${address}`);
      setIsLoading(false);
      
      // Reset state with just the address
      setState(prev => ({
        ...prev,
        resolvedAddress: address,
        resolvedEns: undefined
      }));
      
      return false;
    }
  }, [processAddressLookup, setError, setIsLoading, setState]);

  return {
    resolveEns,
    lookupAddress
  };
}
