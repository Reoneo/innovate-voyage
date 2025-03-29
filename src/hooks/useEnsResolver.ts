
import { useAddressByEns, useEnsByAddress } from '@/hooks/useWeb3';
import { useState, useEffect } from 'react';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name or .box domain to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  const [resolvedBoxDomain, setResolvedBoxDomain] = useState<{ address: string; ensName: string } | null>(null);
  
  // Determine if the input is a domain (either .eth or .box)
  const isDomain = ensName && (ensName.includes('.eth') || ensName.includes('.box'));
  const isBoxDomain = ensName && ensName.includes('.box');
  
  // Effect to resolve .box domains via web3.bio API
  useEffect(() => {
    const resolveBoxDomain = async () => {
      if (isBoxDomain) {
        try {
          // Fetch the address for the .box domain
          const response = await fetch(`https://api.web3.bio/profile/${ensName}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
              console.log(`Resolved .box domain ${ensName} to:`, data.address);
              setResolvedBoxDomain({
                address: data.address,
                ensName: ensName
              });
            } else {
              console.error("No address found for .box domain:", ensName);
              setResolvedBoxDomain(null);
            }
          } else {
            console.error("Failed to resolve .box domain");
            setResolvedBoxDomain(null);
          }
        } catch (error) {
          console.error("Error resolving .box domain:", error);
          setResolvedBoxDomain(null);
        }
      }
    };

    if (isBoxDomain) {
      resolveBoxDomain();
    } else {
      setResolvedBoxDomain(null);
    }
  }, [ensName, isBoxDomain]);
  
  // Resolve domain name to address (for .eth domains)
  const { data: addressData } = useAddressByEns(
    isDomain && !isBoxDomain ? ensName : undefined
  );
  
  // Resolve address to domain name
  const { data: ensData } = useEnsByAddress(
    !isDomain ? address : undefined
  );
  
  const resolvedAddress = resolvedBoxDomain?.address || addressData?.address || address;
  const resolvedEns = ensName || ensData?.ensName;
  
  return {
    resolvedAddress,
    resolvedEns,
  };
}
