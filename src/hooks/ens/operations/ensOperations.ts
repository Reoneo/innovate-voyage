
import { getDefaultProvider, executeWithTimeout } from '../providers/ensProvider';
import { fetchEnsData } from '../services/ensDataService';
import { ethers } from 'ethers';

/**
 * Process ENS data after successful resolution
 */
export async function processEnsData(
  ensName: string, 
  resolvedAddress: string,
  updateState: (data: any) => void
) {
  try {
    const ensData = await fetchEnsData(ensName);
    
    updateState({
      resolvedAddress,
      resolvedEns: ensName,
      avatarUrl: ensData.avatar,
      ensBio: ensData.bio,
      ensLinks: ensData.ensLinks
    });
    
    return true;
  } catch (err) {
    console.error('Error processing ENS data:', err);
    return false;
  }
}

/**
 * Process address lookup results
 */
export async function processAddressLookup(
  address: string, 
  resolvedEns: string,
  updateState: (data: any) => void
) {
  try {
    const ensData = await fetchEnsData(resolvedEns);
    
    updateState({
      resolvedEns,
      resolvedAddress: address,
      avatarUrl: ensData.avatar,
      ensBio: ensData.bio,
      ensLinks: ensData.ensLinks
    });
    
    return true;
  } catch (err) {
    console.error('Error processing address lookup:', err);
    return false;
  }
}

/**
 * Resolve an ENS name to an Ethereum address
 */
export async function resolveEnsName(
  ensName: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  updateState: (data: any) => void
) {
  if (!ensName) return false;
  
  try {
    setIsLoading(true);
    setError(null);
    
    console.log(`Resolving ENS name to address: ${ensName}`);
    
    // Check for valid ENS name
    if (!ensName.includes('.')) {
      throw new Error('Invalid ENS name format');
    }
    
    // Get provider and resolve name
    const provider = getDefaultProvider();
    const address = await executeWithTimeout(provider.resolveName(ensName));
    
    if (!address) {
      throw new Error(`Could not resolve ENS name: ${ensName}`);
    }
    
    console.log(`Resolved ${ensName} to address: ${address}`);
    
    // Process the results
    await processEnsData(ensName, address, updateState);
    
    setIsLoading(false);
    return true;
  } catch (err) {
    console.error('Error resolving ENS name:', err);
    setError(`Failed to resolve ENS name: ${ensName}`);
    setIsLoading(false);
    
    // Reset state with just the ENS name
    updateState({
      resolvedEns: ensName,
      resolvedAddress: undefined
    });
    
    return false;
  }
}

/**
 * Look up an Ethereum address to find associated ENS name
 */
export async function lookupEthAddress(
  address: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  updateState: (data: any) => void
) {
  if (!address) return false;
  
  try {
    setIsLoading(true);
    setError(null);
    
    console.log(`Looking up address to ENS: ${address}`);
    
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    
    // Get provider and lookup address
    const provider = getDefaultProvider();
    const ensName = await executeWithTimeout(provider.lookupAddress(address));
    
    console.log(`Lookup result for ${address}: ${ensName || 'No ENS found'}`);
    
    if (!ensName) {
      // No ENS found, set state with just the address
      updateState({
        resolvedAddress: address,
        resolvedEns: undefined
      });
      
      setIsLoading(false);
      return true;
    }
    
    // Process the results
    await processAddressLookup(address, ensName, updateState);
    
    setIsLoading(false);
    return true;
  } catch (err) {
    console.error('Error looking up address to ENS:', err);
    setError(`Failed to lookup address: ${address}`);
    setIsLoading(false);
    
    // Reset state with just the address
    updateState({
      resolvedAddress: address,
      resolvedEns: undefined
    });
    
    return false;
  }
}
