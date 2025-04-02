import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';

// Add a proper type for the ensLinks return value
interface EnsLinksResult {
  socials: Record<string, string>;
  ensLinks: string[];
  description?: string;
}

// Update the function to handle description property safely
export function useEnsResolution(ensName?: string, address?: string) {
  const [resolvedAddress, setResolvedAddress] = useState<string | undefined>(address);
  const [resolvedEns, setResolvedEns] = useState<string | undefined>(ensName);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const { data: addressData } = useQuery({
    queryKey: ['ens', 'name', ensName],
    queryFn: () => ensName ? web3Api.getAddressByEns(ensName) : null,
    enabled: !!ensName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: ensData } = useQuery({
    queryKey: ['ens', 'address', address],
    queryFn: () => address ? web3Api.getEnsByAddress(address) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: avatar } = useQuery({
    queryKey: ['avatar', ensName],
    queryFn: () => ensName ? web3Api.getRealAvatar(ensName) : null,
    enabled: !!ensName,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1, // Reduce retries for avatars since some might not exist
  });

  useEffect(() => {
    if (addressData?.address) {
      setResolvedAddress(addressData.address);
      setResolvedEns(ensName);
    }
  }, [addressData, ensName]);

  useEffect(() => {
    if (ensData?.name) {
      setResolvedEns(ensData.name);
      setResolvedAddress(address);
    }
  }, [ensData, address]);

  useEffect(() => {
    if (avatar) {
      setAvatarUrl(avatar.url);
    }
  }, [avatar]);

  const { data: allEnsRecords } = useQuery({
    queryKey: ['ensRecords', resolvedAddress],
    queryFn: () => resolvedAddress ? web3Api.getAllEnsRecords() : null,
    enabled: !!resolvedAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const processEnsRecords = (records: any): EnsLinksResult => {
    if (!records) {
      return { socials: {}, ensLinks: [] };
    }

    // Extract social links from records
    const socials: Record<string, string> = {};
    const ensLinks: string[] = [];
    let description: string | undefined = undefined;

    for (const record of records) {
      if (record.key.startsWith('social.')) {
        const service = record.key.substring(7);
        socials[service] = record.value;
      } else if (record.key === 'url') {
        ensLinks.push(record.value);
      }
    }

    // Make sure to extract the description
    if (records.description) {
      description = records.description;
    }

    return { socials, ensLinks, description };
  };

  const linkData = allEnsRecords ? processEnsRecords(allEnsRecords) : null;

  return {
    resolvedAddress,
    resolvedEns,
    avatarUrl,
    ensLinks: linkData ? { 
      socials: linkData.socials || {}, 
      ensLinks: linkData.ensLinks || [],
      description: linkData.description
    } : { 
      socials: {}, 
      ensLinks: [] 
    },
  };
}
