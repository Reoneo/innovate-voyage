
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import type { POAP } from '@/api/types/poapTypes';

export function usePoapNfts(address: string | undefined) {
  return useQuery({
    queryKey: ['poaps', address],
    queryFn: async () => {
      if (!address) return [];
      try {
        return await web3Api.getPoapsByAddress(address);
      } catch (error) {
        console.error('Error fetching POAPs:', error);
        return [];
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid excessive requests if the API is down
  });
}
