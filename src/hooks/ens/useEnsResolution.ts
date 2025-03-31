
import { useState } from 'react';
import { resolveEnsToAddress, resolveAddressToEns, getEnsAvatar, getEnsLinks, getEnsBio } from '@/utils/ensResolution';

interface EnsResolutionState {
  resolvedAddress: string | undefined;
  resolvedEns: string | undefined;
  avatarUrl: string | undefined;
  ensBio: string | undefined;
  ensLinks: {
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
  };
}

export function useEnsResolution(ensName?: string, address?: string) {
  const [state, setState] = useState<EnsResolutionState>({
    resolvedAddress: address,
    resolvedEns: ensName,
    avatarUrl: undefined,
    ensBio: undefined,
    ensLinks: {
      socials: {},
      ensLinks: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveEns = async (ensName: string) => {
    try {
      const resolvedAddress = await resolveEnsToAddress(ensName);
      if (resolvedAddress) {
        const links = await getEnsLinks(ensName, 'mainnet');
        const avatar = await getEnsAvatar(ensName, 'mainnet');
        const bio = await getEnsBio(ensName, 'mainnet');
        
        setState(prev => ({
          ...prev,
          resolvedAddress,
          ensLinks: links,
          avatarUrl: avatar || prev.avatarUrl,
          ensBio: bio || links.description || prev.ensBio
        }));
      }
    } catch (error) {
      console.error(`Error resolving ${ensName}:`, error);
    }
  };

  const lookupAddress = async (address: string) => {
    try {
      const result = await resolveAddressToEns(address);
      if (result) {
        const links = await getEnsLinks(result.ensName, 'mainnet');
        const avatar = await getEnsAvatar(result.ensName, 'mainnet');
        const bio = await getEnsBio(result.ensName, 'mainnet');
        
        setState(prev => ({
          ...prev,
          resolvedEns: result.ensName,
          ensLinks: links,
          avatarUrl: avatar || prev.avatarUrl,
          ensBio: bio || links.description || prev.ensBio
        }));
      }
    } catch (error) {
      console.error(`Error looking up ENS for address ${address}:`, error);
    }
  };

  return {
    state,
    setState,
    isLoading,
    setIsLoading,
    error,
    setError,
    resolveEns,
    lookupAddress
  };
}
