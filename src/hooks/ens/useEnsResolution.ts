
import { useState } from 'react';
import { resolveEnsToAddress, resolveAddressToEns } from '@/utils/ens/resolveEns';
import { getEnsAvatar, getEnsBio } from '@/utils/ens/ensRecords';
import { getTextRecord } from '@/utils/ens/ensClient';
import { getEnsLinks } from '@/utils/ensResolution';

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
        
        // Get additional social links
        const github = await getTextRecord(ensName, 'com.github');
        const twitter = await getTextRecord(ensName, 'com.twitter');
        const linkedin = await getTextRecord(ensName, 'com.linkedin');
        const website = await getTextRecord(ensName, 'url');
        
        // Initialize socials if needed
        const socials = links.socials || {};
        
        // Combine with existing links
        if (github) socials.github = github;
        if (twitter) socials.twitter = twitter;
        if (linkedin) socials.linkedin = linkedin;
        if (website) socials.website = website;
        
        setState(prev => ({
          ...prev,
          resolvedAddress,
          ensLinks: {
            ...links,
            socials
          },
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
        
        // Get additional social links
        const github = await getTextRecord(result.ensName, 'com.github');
        const twitter = await getTextRecord(result.ensName, 'com.twitter');
        const linkedin = await getTextRecord(result.ensName, 'com.linkedin');
        const website = await getTextRecord(result.ensName, 'url');
        
        // Initialize socials if needed
        const socials = links.socials || {};
        
        // Combine with existing links
        if (github) socials.github = github;
        if (twitter) socials.twitter = twitter;
        if (linkedin) socials.linkedin = linkedin;
        if (website) socials.website = website;
        
        setState(prev => ({
          ...prev,
          resolvedEns: result.ensName,
          ensLinks: {
            ...links,
            socials
          },
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
