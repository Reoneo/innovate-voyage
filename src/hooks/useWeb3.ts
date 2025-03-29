
import { useQuery } from '@tanstack/react-query';
import { web3Api, ENSRecord, SkillNFT, Web3Credentials } from '@/api/web3Api';

export function useEnsByAddress(address: string | undefined) {
  return useQuery({
    queryKey: ['ens', 'address', address],
    queryFn: () => address ? web3Api.getEnsByAddress(address) : null,
    enabled: !!address,
  });
}

export function useAddressByEns(ensName: string | undefined) {
  return useQuery({
    queryKey: ['ens', 'name', ensName],
    queryFn: () => ensName ? web3Api.getAddressByEns(ensName) : null,
    enabled: !!ensName,
  });
}

export function useSkillNfts(address: string | undefined) {
  return useQuery({
    queryKey: ['skillNfts', address],
    queryFn: () => address ? web3Api.getSkillNftsByAddress(address) : [],
    enabled: !!address,
  });
}

export function useWeb3Credentials(address: string | undefined) {
  return useQuery({
    queryKey: ['web3Credentials', address],
    queryFn: () => address ? web3Api.getWeb3CredentialsByAddress(address) : { ensRecord: null, skillNfts: [] },
    enabled: !!address,
  });
}

export function useAllEnsRecords() {
  return useQuery({
    queryKey: ['ensRecords'],
    queryFn: web3Api.getAllEnsRecords,
  });
}

export function useAllSkillNfts() {
  return useQuery({
    queryKey: ['skillNfts'],
    queryFn: web3Api.getAllSkillNfts,
  });
}
