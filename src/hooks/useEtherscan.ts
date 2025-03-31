
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import type { BlockchainProfile } from '@/api/types/etherscanTypes';

export function useBlockchainProfile(address: string | undefined) {
  return useQuery({
    queryKey: ['blockchain', 'profile', address],
    queryFn: async () => {
      if (!address) return null;
      try {
        const profile = await web3Api.getBlockchainProfile(address);
        return profile;
      } catch (error) {
        console.error("Error fetching blockchain profile:", error);
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid rate limiting issues
  });
}

export function useAccountBalance(address: string | undefined) {
  return useQuery({
    queryKey: ['blockchain', 'balance', address],
    queryFn: () => address ? web3Api.getAccountBalance(address) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useTransactionCount(address: string | undefined) {
  return useQuery({
    queryKey: ['blockchain', 'txCount', address],
    queryFn: () => address ? web3Api.getTransactionCount(address) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useLatestTransactions(address: string | undefined, limit: number = 5) {
  return useQuery({
    queryKey: ['blockchain', 'transactions', address, limit],
    queryFn: async () => {
      if (!address) return null;
      try {
        return await web3Api.getLatestTransactions(address, limit);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useTokenTransfers(address: string | undefined, limit: number = 5) {
  return useQuery({
    queryKey: ['blockchain', 'tokens', address, limit],
    queryFn: async () => {
      if (!address) return null;
      try {
        return await web3Api.getTokenTransfers(address, limit);
      } catch (error) {
        console.error("Error fetching token transfers:", error);
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
