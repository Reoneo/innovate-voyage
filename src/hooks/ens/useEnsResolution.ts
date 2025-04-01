
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
        // Fetch links, avatar and bio in parallel
        const [links, avatar, bio] = await Promise.all([
          getEnsLinks(ensName, 'mainnet'),
          getEnsAvatar(ensName, 'mainnet'),
          getEnsBio(ensName, 'mainnet')
        ]);
        
        console.log(`ENS resolution for ${ensName}:`, { 
          address: resolvedAddress,
          links,
          avatar,
          bio
        });
        
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
        // Fetch links, avatar and bio in parallel
        const [links, avatar, bio] = await Promise.all([
          getEnsLinks(result.ensName, 'mainnet'),
          getEnsAvatar(result.ensName, 'mainnet'),
          getEnsBio(result.ensName, 'mainnet')
        ]);
        
        console.log(`Address lookup for ${address}:`, {
          ens: result.ensName,
          links,
          avatar,
          bio
        });
        
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
