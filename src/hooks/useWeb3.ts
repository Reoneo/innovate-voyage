
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import type { ENSRecord, SkillNFT, Web3Credentials } from '@/api/types/web3Types';

export function useEnsByAddress(address: string | undefined) {
  return useQuery({
    queryKey: ['ens', 'address', address],
    queryFn: () => address ? web3Api.getEnsByAddress(address) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddressByEns(ensName: string | undefined) {
  return useQuery({
    queryKey: ['ens', 'name', ensName],
    queryFn: () => ensName ? web3Api.getAddressByEns(ensName) : null,
    enabled: !!ensName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSkillNfts(address: string | undefined) {
  return useQuery({
    queryKey: ['skillNfts', address],
    queryFn: () => address ? web3Api.getSkillNftsByAddress(address) : [],
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWeb3Credentials(address: string | undefined) {
  return useQuery({
    queryKey: ['web3Credentials', address],
    queryFn: () => address ? web3Api.getWeb3CredentialsByAddress(address) : { ensRecord: null, skillNfts: [] },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAllEnsRecords() {
  return useQuery({
    queryKey: ['ensRecords'],
    queryFn: () => web3Api.getAllEnsRecords(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAllSkillNfts() {
  return useQuery({
    queryKey: ['skillNfts'],
    queryFn: () => web3Api.getAllSkillNfts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRealAvatar(ensName: string | undefined) {
  return useQuery({
    queryKey: ['avatar', ensName],
    queryFn: () => ensName ? web3Api.getRealAvatar(ensName) : null,
    enabled: !!ensName,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1, // Reduce retries for avatars since some might not exist
  });
}

export function useWeb3BioProfile(identity: string | undefined) {
  return useQuery({
    queryKey: ['web3bio', identity],
    queryFn: () => identity ? web3Api.fetchWeb3BioProfile(identity) : null,
    enabled: !!identity,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
}
