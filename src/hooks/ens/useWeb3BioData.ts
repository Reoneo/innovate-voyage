
import { useEffect } from 'react';
import { useAddressByEns, useEnsByAddress, useRealAvatar } from '@/hooks/useWeb3';

export function useWeb3BioData(
  ensName: string | undefined,
  address: string | undefined,
  isEns: boolean,
  updateState: (data: any) => void
) {
  const { data: addressData, isLoading: isLoadingAddress } = useAddressByEns(
    isEns ? ensName : undefined
  );
  
  const { data: ensData, isLoading: isLoadingEns } = useEnsByAddress(
    !isEns ? address : undefined
  );
  
  const { data: avatarData, isLoading: isLoadingAvatar } = useRealAvatar(
    ensName || ensData?.ensName
  );

  useEffect(() => {
    let newState = {};

    if (addressData?.address) {
      newState = {
        ...newState,
        resolvedAddress: addressData.address,
        avatarUrl: addressData.avatar || avatarData,
        ensLinks: {
          socials: addressData.socialProfiles || {},
          ensLinks: [],
          description: addressData.description
        },
        ensBio: addressData.description
      };
    }

    if (ensData?.ensName) {
      newState = {
        ...newState,
        resolvedEns: ensData.ensName,
        avatarUrl: ensData.avatar || avatarData,
        ensLinks: {
          socials: ensData.socialProfiles || {},
          ensLinks: [],
          description: ensData.description
        },
        ensBio: ensData.description
      };
    }

    if (Object.keys(newState).length > 0) {
      updateState(newState);
    }
  }, [addressData, ensData, avatarData, updateState]);

  return {
    isLoading: isLoadingAddress || isLoadingEns || isLoadingAvatar
  };
}
