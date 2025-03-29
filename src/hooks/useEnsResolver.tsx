
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
        // For .box domains, we'll rely more on web3.bio API through our services
        if (ensName.includes('.box')) {
          // Get address using our services that use web3.bio API
          // This will be handled by the API hooks below
        } else {
          // Resolve ENS name to address using ethers.js
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
            // Don't set error yet, let the API try
          }
        }
      } catch (error) {
        console.error(`Error resolving ${ensName}:`, error);
        // Don't set error yet, let the API try
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
        // Don't set error yet, let the API try
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
  
  // Update the state based on all data sources - fix infinite loop
  useEffect(() => {
    let shouldUpdate = false;
    let newState = {
      address: resolvedAddressState,
      ens: resolvedEnsState,
      avatar: avatarUrlState,
      socials: ensLinksState.socials
    };

    // First, prioritize ethers.js resolution for addresses
    if (!resolvedAddressState && addressData?.address) {
      newState.address = addressData.address;
      shouldUpdate = true;
    } else if (!resolvedAddressState && address) {
      newState.address = address;
      shouldUpdate = true;
    }
    
    // For ENS names
    if (!resolvedEnsState && ensName) {
      newState.ens = ensName;
      shouldUpdate = true;
    } else if (!resolvedEnsState && ensData?.ensName) {
      newState.ens = ensData.ensName;
      shouldUpdate = true;
    }
    
    // Set avatar with priority: ethers.js avatar > avatarData > addressData.avatar > ensData.avatar
    if (!avatarUrlState) {
      if (avatarData) {
        newState.avatar = avatarData;
        shouldUpdate = true;
      } else if (addressData?.avatar) {
        newState.avatar = addressData.avatar;
        shouldUpdate = true;
      } else if (ensData?.avatar) {
        newState.avatar = ensData.avatar;
        shouldUpdate = true;
      }
    }
    
    // Set social profiles from API data if not already set from ethers.js
    if (!Object.keys(ensLinksState.socials).length) {
      if (addressData?.socialProfiles && Object.keys(addressData.socialProfiles).length) {
        newState.socials = addressData.socialProfiles;
        shouldUpdate = true;
      } else if (ensData?.socialProfiles && Object.keys(ensData.socialProfiles).length) {
        newState.socials = ensData.socialProfiles;
        shouldUpdate = true;
      }
    }
    
    // Only update state if there are changes
    if (shouldUpdate) {
      if (newState.address !== resolvedAddressState) {
        setResolvedAddress(newState.address);
      }
      if (newState.ens !== resolvedEnsState) {
        setResolvedEns(newState.ens);
      }
      if (newState.avatar !== avatarUrlState) {
        setAvatarUrl(newState.avatar);
      }
      if (Object.keys(newState.socials).length && !Object.keys(ensLinksState.socials).length) {
        setEnsLinks(prev => ({
          ...prev,
          socials: newState.socials
        }));
      }
    }
  }, [addressData, ensData, avatarData]);

  return {
    resolvedAddress: resolvedAddressState,
    resolvedEns: resolvedEnsState,
    avatarUrl: avatarUrlState,
    ensLinks: ensLinksState,
    isLoading: isLoading || isLoadingAddress || isLoadingEns || isLoadingAvatar,
    error
  };
}
