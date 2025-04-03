
import { useState, useEffect } from 'react';
import { useEnsResolution } from './ens/useEnsResolution';
import { useWeb3BioData } from './ens/useWeb3BioData';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  // Normalize ENS name if provided without extension
  const normalizedEnsName = ensName && !ensName.includes('.') 
    ? `${ensName}.eth` 
    : ensName;
  
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = normalizedEnsName?.includes('.eth') || normalizedEnsName?.includes('.box');
  
  // Initialize state
  const [resolvedAddress, setResolvedAddress] = useState<string | undefined>(address);
  const [resolvedEns, setResolvedEns] = useState<string | undefined>(normalizedEnsName);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [ensBio, setEnsBio] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeoutError, setTimeoutError] = useState(false);
  const [ensLinks, setEnsLinks] = useState<{
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
  }>({
    socials: {},
    ensLinks: []
  });
  
  // Use our ENS resolution hook with proper type checking
  const ensResolution = useEnsResolution(normalizedEnsName, address);
  
  // Effect to update state from the useEnsResolution hook
  useEffect(() => {
    if (ensResolution) {
      if (ensResolution.resolvedAddress) {
        setResolvedAddress(ensResolution.resolvedAddress);
      }
      if (ensResolution.resolvedEns) {
        setResolvedEns(ensResolution.resolvedEns);
      }
      if (ensResolution.avatarUrl) {
        setAvatarUrl(ensResolution.avatarUrl);
      }
      if (ensResolution.ensLinks) {
        setEnsLinks(ensResolution.ensLinks);
        if (ensResolution.ensLinks.description) {
          setEnsBio(ensResolution.ensLinks.description);
        }
      }
    }
  }, [ensResolution]);

  // Use Web3Bio data - only for ENS names
  const { isLoading: isLoadingWeb3Bio } = useWeb3BioData(
    normalizedEnsName,
    address,
    !!isEns,
    (newState) => {
      if (newState.resolvedAddress) {
        setResolvedAddress(newState.resolvedAddress);
      }
      if (newState.resolvedEns) {
        setResolvedEns(newState.resolvedEns);
      }
      if (newState.avatarUrl) {
        setAvatarUrl(newState.avatarUrl);
      }
      if (newState.ensBio) {
        setEnsBio(newState.ensBio);
      }
      if (newState.ensLinks?.socials) {
        setEnsLinks(prevLinks => ({
          ...prevLinks,
          socials: {
            ...prevLinks.socials,
            ...newState.ensLinks?.socials
          },
          description: newState.ensLinks?.description || prevLinks.description
        }));
      }
    }
  );

  return {
    resolvedAddress,
    resolvedEns,
    avatarUrl,
    ensBio,
    ensLinks,
    isLoading: isLoading || isLoadingWeb3Bio,
    error,
    timeoutError
  };
}
