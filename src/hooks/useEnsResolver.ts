
import { useAddressByEns, useEnsByAddress, useRealAvatar } from '@/hooks/useWeb3';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Initialize Ethereum providers
const mainnetProvider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"); // Free tier Infura endpoint
const optimismProvider = new ethers.JsonRpcProvider("https://optimism-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"); // Optimism endpoint

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
  
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = ensName?.includes('.eth') || ensName?.includes('.box');
  const isBoxDomain = ensName?.includes('.box');
  
  // Resolve ENS name to address using ethers.js
  useEffect(() => {
    if (!isEns || !ensName) return;
    
    const resolveEns = async () => {
      setIsLoading(true);
      try {
        // Choose the provider based on domain type
        const provider = isBoxDomain ? optimismProvider : mainnetProvider;
        
        if (isBoxDomain) {
          console.log(`Resolving .box domain: ${ensName} using Optimistic Etherscan`);
        }
        
        // Try to resolve the ENS name to an address
        const resolvedAddress = await provider.resolveName(ensName);
        
        if (resolvedAddress) {
          setResolvedAddress(resolvedAddress);
          
          // Try to get avatar
          try {
            const resolver = await provider.getResolver(ensName);
            if (resolver) {
              const avatar = await resolver.getText('avatar');
              if (avatar) {
                setAvatarUrl(avatar);
              }
            }
          } catch (error) {
            console.error(`Error fetching avatar for ${ensName}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error resolving ${ensName}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    resolveEns();
  }, [ensName, isEns, isBoxDomain]);
  
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
    isLoading: isLoading || isLoadingAddress || isLoadingEns || isLoadingAvatar
  };
}
