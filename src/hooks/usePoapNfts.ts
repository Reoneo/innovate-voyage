
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import type { POAP } from '@/api/types/poapTypes';

export function usePoapNfts(address: string | undefined) {
  return useQuery({
    queryKey: ['poaps', address],
    queryFn: () => address ? web3Api.getPoapsByAddress(address) : Promise.resolve([]),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
