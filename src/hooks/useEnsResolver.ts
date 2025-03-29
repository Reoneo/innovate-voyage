
import { useAddressByEns, useEnsByAddress } from '@/hooks/useWeb3';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  // Resolve ENS name to address
  const { data: addressData } = useAddressByEns(
    ensName?.includes('.eth') ? ensName : undefined
  );
  
  // Resolve address to ENS name
  const { data: ensData } = useEnsByAddress(
    !ensName?.includes('.eth') ? address : undefined
  );
  
  const resolvedAddress = addressData?.address || address;
  const resolvedEns = ensName || ensData?.ensName;
  
  return {
    resolvedAddress,
    resolvedEns,
  };
}
