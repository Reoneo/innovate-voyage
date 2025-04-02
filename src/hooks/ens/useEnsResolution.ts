
import { useState, useEffect } from 'react';
import { resolveEnsToAddress, resolveAddressToEns, getEnsAvatar, getEnsLinks, getEnsBio } from '@/utils/ens';
import { getRealAvatar } from '@/api/services/avatar';

interface EnsResolutionState {
  resolvedAddress: string | undefined;
  resolvedEns: string | undefined;
  avatarUrl: string | undefined;
  ensBio: string | undefined;
  ensLinks: {
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
    additionalEnsDomains?: string[];
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
      ensLinks: [],
      additionalEnsDomains: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutError, setTimeoutError] = useState<boolean>(false);

  const resolveEns = async (ensName: string) => {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: ENS resolution took too long')), 4000);
      });
      
      // Race between actual resolution and timeout
      const resolvedAddress = await Promise.race([
        resolveEnsToAddress(ensName),
        timeoutPromise
      ]);
      
      if (resolvedAddress) {
        // Fetch links, avatar and bio in parallel
        const [links, avatar, bio, realAvatar] = await Promise.all([
          getEnsLinks(ensName, 'mainnet').catch(error => {
            console.error(`Error fetching ENS links: ${error}`);
            return { socials: {}, ensLinks: [ensName] }; 
          }),
          getEnsAvatar(ensName, 'mainnet').catch(() => null),
          getEnsBio(ensName, 'mainnet').catch(() => null),
          getRealAvatar(ensName).catch(() => null) // Use the improved avatar fetching service
        ]);
        
        console.log(`ENS resolution for ${ensName}:`, { 
          address: resolvedAddress,
          links,
          avatar: avatar || realAvatar,
          bio
        });
        
        // Enhanced avatar fetching with multiple fallbacks
        let finalAvatar = realAvatar || avatar;
        
        // If still no avatar, try specific ENS avatar endpoints
        if (!finalAvatar) {
          try {
            if (ensName.endsWith('.eth')) {
              finalAvatar = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
            } else if (ensName.endsWith('.box')) {
              finalAvatar = 'https://pbs.twimg.com/profile_images/1673978200800473088/96dq4nBA_400x400.png';
            } else if (ensName.endsWith('.lens')) {
              finalAvatar = 'https://img.cryptorank.io/coins/lens_protocol1733845125692.png';
            }
          } catch (avatarError) {
            console.warn(`Failed to fetch avatar for ${ensName}:`, avatarError);
          }
        }
        
        setState(prev => ({
          ...prev,
          resolvedAddress,
          ensLinks: links,
          avatarUrl: finalAvatar || prev.avatarUrl,
          ensBio: bio || links.description || prev.ensBio
        }));
      }
    } catch (error) {
      console.error(`Error resolving ${ensName}:`, error);
      if (error instanceof Error && error.message.includes('Timeout')) {
        setTimeoutError(true);
      }
      setError(`Error resolving ${ensName}: ${error}`);
    }
  };

  const lookupAddress = async (address: string) => {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Address lookup took too long')), 4000);
      });
      
      // Race between actual lookup and timeout
      const result = await Promise.race([
        resolveAddressToEns(address),
        timeoutPromise
      ]);
      
      if (result) {
        // Fetch links, avatar and bio in parallel
        const [links, avatar, bio, realAvatar] = await Promise.all([
          getEnsLinks(result.ensName, 'mainnet').catch(error => {
            console.error(`Error fetching ENS links: ${error}`);
            return { socials: {}, ensLinks: [result.ensName] };
          }),
          getEnsAvatar(result.ensName, 'mainnet').catch(() => null),
          getEnsBio(result.ensName, 'mainnet').catch(() => null),
          getRealAvatar(result.ensName).catch(() => null) // Use the improved avatar fetching service
        ]);
        
        console.log(`Address lookup for ${address}:`, {
          ens: result.ensName,
          links,
          avatar: avatar || realAvatar,
          bio
        });
        
        // Enhanced avatar fetching with multiple fallbacks
        let finalAvatar = realAvatar || avatar;
        
        // If still no avatar, try specific ENS avatar endpoints
        if (!finalAvatar) {
          try {
            if (result.ensName.endsWith('.eth')) {
              finalAvatar = `https://metadata.ens.domains/mainnet/avatar/${result.ensName}`;
            } else if (result.ensName.endsWith('.box')) {
              finalAvatar = 'https://pbs.twimg.com/profile_images/1673978200800473088/96dq4nBA_400x400.png';
            } else if (result.ensName.endsWith('.lens')) {
              finalAvatar = 'https://img.cryptorank.io/coins/lens_protocol1733845125692.png';
            }
          } catch (avatarError) {
            console.warn(`Failed to fetch avatar for ${result.ensName}:`, avatarError);
          }
        }
        
        setState(prev => ({
          ...prev,
          resolvedEns: result.ensName,
          ensLinks: links,
          avatarUrl: finalAvatar || prev.avatarUrl,
          ensBio: bio || links.description || prev.ensBio
        }));
      }
    } catch (error) {
      console.error(`Error looking up ENS for address ${address}:`, error);
      if (error instanceof Error && error.message.includes('Timeout')) {
        setTimeoutError(true);
      }
      setError(`Error looking up ENS for address ${address}: ${error}`);
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
    lookupAddress,
    timeoutError
  };
}
