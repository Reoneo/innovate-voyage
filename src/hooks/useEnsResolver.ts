
import { useAddressByEns, useEnsByAddress, useRealAvatar } from '@/hooks/useWeb3';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = ensName?.includes('.eth') || ensName?.includes('.box');
  
  // Resolve ENS name to address
  const { data: addressData } = useAddressByEns(
    isEns ? ensName : undefined
  );
  
  // Resolve address to ENS name
  const { data: ensData } = useEnsByAddress(
    !isEns ? address : undefined
  );
  
  // Get avatar for the ENS name
  const { data: avatarData } = useRealAvatar(
    ensName || ensData?.ensName
  );
  
  const resolvedAddress = addressData?.address || address;
  const resolvedEns = ensName || ensData?.ensName;
  const avatarUrl = avatarData || addressData?.avatar || ensData?.avatar;
  
  return {
    resolvedAddress,
    resolvedEns,
    avatarUrl
  };
}
