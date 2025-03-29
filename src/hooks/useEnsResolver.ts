
import { useAddressByEns, useEnsByAddress, useRealAvatar } from '@/hooks/useWeb3';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Initialize Ethereum providers with more reliable public endpoints
const mainnetProvider = new ethers.JsonRpcProvider("https://eth.llamarpc.com"); // Public RPC aggregator
const optimismProvider = new ethers.JsonRpcProvider("https://mainnet.optimism.io"); // Public Optimism endpoint

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally with ethers.js support
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  const [resolvedAddressState, setResolvedAddress] = useState<string | undefined>(address);
  const [resolvedEnsState, setResolvedEns] = useState<string | undefined>(ensName);
  const [avatarUrlState, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = ensName?.includes('.eth') || ensName?.includes('.box');
  const isBoxDomain = ensName?.includes('.box');
  
  // Resolve ENS name to address using ethers.js
  useEffect(() => {
    if (!isEns || !ensName) return;
    
    const resolveEns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Choose the provider based on domain type
        const provider = isBoxDomain ? optimismProvider : mainnetProvider;
        
        if (isBoxDomain) {
          console.log(`Resolving .box domain: ${ensName} using Optimism provider`);
        } else {
          console.log(`Resolving .eth domain: ${ensName} using Mainnet provider`);
        }
        
        // Try to resolve the ENS name to an address
        const resolvedAddress = await provider.resolveName(ensName);
        console.log(`Resolution result for ${ensName}:`, resolvedAddress);
        
        if (resolvedAddress) {
          setResolvedAddress(resolvedAddress);
          
          // Try to get avatar
          try {
            const resolver = await provider.getResolver(ensName);
            if (resolver) {
              console.log(`Got resolver for ${ensName}`);
              const avatar = await resolver.getText('avatar');
              if (avatar) {
                console.log(`Got avatar for ${ensName}:`, avatar);
                setAvatarUrl(avatar);
              } else {
                console.log(`No avatar found for ${ensName} in resolver`);
              }
            } else {
              console.log(`No resolver found for ${ensName}`);
            }
          } catch (avatarError) {
            console.error(`Error fetching avatar for ${ensName}:`, avatarError);
          }
        } else {
          console.warn(`No address found for ${ensName}`);
          setError(`Could not resolve ${ensName}`);
        }
      } catch (error) {
        console.error(`Error resolving ${ensName}:`, error);
        // More user-friendly error message
        setError(`Network issue while resolving ${ensName}. Please try again later.`);
      } finally {
        setIsLoading(false);
      }
    };
    
    resolveEns();
  }, [ensName, isEns, isBoxDomain]);
  
  // Resolve address to ENS using ethers.js
  useEffect(() => {
    if (!address || isEns) return;
    
    const lookupAddress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Try mainnet first
        console.log(`Looking up ENS for address: ${address} on Mainnet`);
        const ensName = await mainnetProvider.lookupAddress(address);
        
        if (ensName) {
          console.log(`Found ENS name for ${address}: ${ensName}`);
          setResolvedEns(ensName);
          
          // Try to get avatar
          try {
            const resolver = await mainnetProvider.getResolver(ensName);
            if (resolver) {
              const avatar = await resolver.getText('avatar');
              if (avatar) {
                setAvatarUrl(avatar);
              }
            }
          } catch (avatarError) {
            console.error(`Error fetching avatar for ${address}:`, avatarError);
          }
        } else {
          // Try Optimism network
          console.log(`No ENS found on Mainnet, trying Optimism for address: ${address}`);
          try {
            const optimismEns = await optimismProvider.lookupAddress(address);
            if (optimismEns) {
              console.log(`Found .box name for ${address}: ${optimismEns}`);
              setResolvedEns(optimismEns);
              
              // Try to get avatar from optimism
              try {
                const resolver = await optimismProvider.getResolver(optimismEns);
                if (resolver) {
                  const avatar = await resolver.getText('avatar');
                  if (avatar) {
                    setAvatarUrl(avatar);
                  }
                }
              } catch (avatarError) {
                console.error(`Error fetching avatar for ${optimismEns}:`, avatarError);
              }
            }
          } catch (optimismError) {
            console.error(`Error looking up .box domain for ${address}:`, optimismError);
          }
        }
      } catch (error) {
        console.error(`Error looking up ENS for address ${address}:`, error);
        setError(`Network issue while looking up ENS. Please try again later.`);
      } finally {
        setIsLoading(false);
      }
    };
    
    lookupAddress();
  }, [address, isEns]);
  
  // Fallback to API for handling address resolution and additional data
  const { data: addressData, isLoading: isLoadingAddress } = useAddressByEns(
    isEns ? ensName : undefined
  );
  
  // Resolve address to ENS name
  const { data: ensData, isLoading: isLoadingEns } = useEnsByAddress(
    !isEns ? address : undefined
  );
  
  // Get avatar for the ENS name
  const { data: avatarData, isLoading: isLoadingAvatar } = useRealAvatar(
    ensName || ensData?.ensName
  );
  
  // Update the state based on all data sources
  useEffect(() => {
    // First, prioritize ethers.js resolution for addresses
    if (resolvedAddressState && !address) {
      // We already have an address from ethers.js
    } else if (addressData?.address) {
      setResolvedAddress(addressData.address);
    } else if (address) {
      setResolvedAddress(address);
    }
    
    // For ENS names
    if (ensName) {
      setResolvedEns(ensName);
    } else if (ensData?.ensName) {
      setResolvedEns(ensData.ensName);
    }
    
    // Set avatar with priority: ethers.js avatar > avatarData > addressData.avatar > ensData.avatar
    if (avatarUrlState) {
      // We already have an avatar from ethers.js
    } else if (avatarData) {
      setAvatarUrl(avatarData);
    } else if (addressData?.avatar) {
      setAvatarUrl(addressData.avatar);
    } else if (ensData?.avatar) {
      setAvatarUrl(ensData.avatar);
    }
  }, [addressData, ensData, avatarData, address, ensName, avatarUrlState, resolvedAddressState]);
  
  return {
    resolvedAddress: resolvedAddressState,
    resolvedEns: resolvedEnsState,
    avatarUrl: avatarUrlState,
    isLoading: isLoading || isLoadingAddress || isLoadingEns || isLoadingAvatar,
    error
  };
}
