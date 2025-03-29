
import { useState, useEffect } from 'react';
import { resolveEnsToAddress, resolveAddressToEns, getEnsAvatar, getEnsLinks } from '@/utils/ensResolution';
import { useAddressByEns, useEnsByAddress, useRealAvatar } from '@/hooks/useWeb3';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  const [resolvedAddressState, setResolvedAddress] = useState<string | undefined>(address);
  const [resolvedEnsState, setResolvedEns] = useState<string | undefined>(ensName);
  const [avatarUrlState, setAvatarUrl] = useState<string | undefined>(undefined);
  const [ensLinksState, setEnsLinks] = useState<{ socials: Record<string, string>, ensLinks: string[] }>({
    socials: {},
    ensLinks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = ensName?.includes('.eth') || ensName?.includes('.box');
  
  // Resolve ENS name to address
  useEffect(() => {
    if (!isEns || !ensName) return;
    
    const resolveEns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Resolve ENS name to address
        const resolvedAddress = await resolveEnsToAddress(ensName);
        
        if (resolvedAddress) {
          setResolvedAddress(resolvedAddress);
          
          // Get ENS links and socials
          const links = await getEnsLinks(ensName, 'mainnet');
          setEnsLinks(links);
          
          // Try to get avatar
          const avatar = await getEnsAvatar(ensName, 'mainnet');
          if (avatar) {
            setAvatarUrl(avatar);
          }
        } else {
          console.warn(`No address found for ${ensName}`);
          setError(`Could not resolve ${ensName}`);
        }
      } catch (error) {
        console.error(`Error resolving ${ensName}:`, error);
        setError(`Error resolving ${ensName}: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    resolveEns();
  }, [ensName, isEns]);
  
  // Resolve address to ENS
  useEffect(() => {
    if (!address || isEns) return;
    
    const lookupAddress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await resolveAddressToEns(address);
        
        if (result) {
          setResolvedEns(result.ensName);
          
          // Get ENS links and socials
          const links = await getEnsLinks(result.ensName, 'mainnet');
          setEnsLinks(links);
          
          // Try to get avatar
          const avatar = await getEnsAvatar(result.ensName, 'mainnet');
          if (avatar) {
            setAvatarUrl(avatar);
          }
        }
      } catch (error) {
        console.error(`Error looking up ENS for address ${address}:`, error);
        setError(`Error looking up ENS: ${(error as Error).message}`);
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
    
    // Set social profiles from API data if not already set from ethers.js
    if (!Object.keys(ensLinksState.socials).length && addressData?.socialProfiles) {
      setEnsLinks(prev => ({
        ...prev,
        socials: {
          ...addressData.socialProfiles
        }
      }));
    } else if (!Object.keys(ensLinksState.socials).length && ensData?.socialProfiles) {
      setEnsLinks(prev => ({
        ...prev,
        socials: {
          ...ensData.socialProfiles
        }
      }));
    }
    
  }, [addressData, ensData, avatarData, address, ensName, avatarUrlState, resolvedAddressState, ensLinksState]);

  return {
    resolvedAddress: resolvedAddressState,
    resolvedEns: resolvedEnsState,
    avatarUrl: avatarUrlState,
    ensLinks: ensLinksState,
    isLoading: isLoading || isLoadingAddress || isLoadingEns || isLoadingAvatar,
    error
  };
}
