
import { useAddressByEns, useEnsByAddress } from '@/hooks/useWeb3';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  // Determine if the input is a domain (either .eth or .box)
  const isDomain = ensName && (ensName.includes('.eth') || ensName.includes('.box'));
  
  // Resolve domain name to address
  const { data: addressData } = useAddressByEns(
    isDomain ? ensName : undefined
  );
  
  // Resolve address to domain name
  const { data: ensData } = useEnsByAddress(
    !isDomain ? address : undefined
  );
  
  const resolvedAddress = addressData?.address || address;
  const resolvedEns = ensName || ensData?.ensName;
  
  return {
    resolvedAddress,
    resolvedEns,
  };
}
