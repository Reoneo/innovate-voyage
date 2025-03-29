
import { useAddressByEns, useEnsByAddress, useRealAvatar } from '@/hooks/useWeb3';
import { useState, useEffect } from 'react';

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
  
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = ensName?.includes('.eth') || ensName?.includes('.box');
  
  // Resolve ENS name to address
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
  
  useEffect(() => {
    if (addressData?.address) {
      setResolvedAddress(addressData.address);
    } else if (address) {
      setResolvedAddress(address);
    }
    
    if (ensName) {
      setResolvedEns(ensName);
    } else if (ensData?.ensName) {
      setResolvedEns(ensData.ensName);
    }
    
    // Set avatar with priority: avatarData > addressData.avatar > ensData.avatar
    if (avatarData) {
      setAvatarUrl(avatarData);
    } else if (addressData?.avatar) {
      setAvatarUrl(addressData.avatar);
    } else if (ensData?.avatar) {
      setAvatarUrl(ensData.avatar);
    }
  }, [addressData, ensData, avatarData, address, ensName]);
  
  return {
    resolvedAddress: resolvedAddressState,
    resolvedEns: resolvedEnsState,
    avatarUrl: avatarUrlState,
    isLoading: isLoadingAddress || isLoadingEns || isLoadingAvatar
  };
}
