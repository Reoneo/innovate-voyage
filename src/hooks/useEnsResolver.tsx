
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchEnsProfile,
  resolveEnsName,
  lookupEnsName,
} from '@/api/services/ens/ensApiClient';
import { isValidEthereumAddress } from '@/lib/utils';

interface EnsResolutionState {
  resolvedAddress: string | undefined;
  resolvedEns: string | undefined;
  avatarUrl: string | undefined;
  ensBio: string | undefined;
  ensLinks: {
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
    keywords?: string[];
  };
}

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  // Check if we're directly dealing with an Ethereum address
  const directAddress = ensName && isValidEthereumAddress(ensName) ? ensName : undefined;
  
  // If ensName is actually an Ethereum address, reassign variables
  const adjustedAddress = directAddress || address;
  const adjustedEnsName = directAddress ? undefined : ensName;
  
  // Normalize ENS name if provided without extension
  const normalizedEnsName = adjustedEnsName && !adjustedEnsName.includes('.') 
    ? `${adjustedEnsName}.eth` 
    : adjustedEnsName;
  
  // Determine if we're dealing with an ENS name
  const isEns = !!normalizedEnsName;

  // Query for ENS name resolution (ENS → Address)
  const ensNameQuery = useQuery({
    queryKey: ['ens', 'resolve', normalizedEnsName],
    queryFn: () => normalizedEnsName ? resolveEnsName(normalizedEnsName) : null,
    enabled: !!normalizedEnsName && !directAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for address resolution (Address → ENS)
  const addressQuery = useQuery({
    queryKey: ['ens', 'lookup', adjustedAddress],
    queryFn: () => adjustedAddress ? lookupEnsName(adjustedAddress) : null,
    enabled: !!adjustedAddress && !isEns,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for ENS profile data
  const profileQuery = useQuery({
    queryKey: ['ens', 'profile', normalizedEnsName || addressQuery.data],
    queryFn: () => fetchEnsProfile(normalizedEnsName || addressQuery.data || ''),
    enabled: !!normalizedEnsName || !!addressQuery.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Add some console logs for debugging
  useEffect(() => {
    if (normalizedEnsName) {
      console.log(`Resolving ENS name: ${normalizedEnsName}`);
    }
    if (adjustedAddress) {
      console.log(`Looking up address: ${adjustedAddress}`);
    }
    if (profileQuery.data) {
      console.log("ENS profile data:", profileQuery.data);
    }
  }, [normalizedEnsName, adjustedAddress, profileQuery.data]);

  // Determine avatar URL
  const avatarUrl = profileQuery.data?.avatar;

  // Extract bio/description from profile
  const ensBio = profileQuery.data?.description;

  // Extract social links
  const socials = profileQuery.data?.socials || {};

  // Combine into final state
  const state: EnsResolutionState = {
    resolvedAddress: ensNameQuery.data || directAddress || adjustedAddress,
    resolvedEns: normalizedEnsName || addressQuery.data,
    avatarUrl,
    ensBio,
    ensLinks: {
      socials: socials || {},  // Ensure socials is always an object
      ensLinks: [],
      description: ensBio || undefined
    }
  };

  // Determine if still loading
  const isLoading = ensNameQuery.isLoading || addressQuery.isLoading || profileQuery.isLoading;

  // Combine errors
  const error = ensNameQuery.error || addressQuery.error || profileQuery.error;

  return {
    ...state,
    isLoading,
    error: error ? String(error) : null
  };
}
