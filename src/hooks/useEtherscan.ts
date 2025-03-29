
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import type { BlockchainProfile } from '@/api/types/etherscanTypes';

export function useBlockchainProfile(address: string | undefined) {
  return useQuery({
    queryKey: ['blockchain', 'profile', address],
    queryFn: () => address ? web3Api.getBlockchainProfile(address) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAccountBalance(address: string | undefined) {
  return useQuery({
    queryKey: ['blockchain', 'balance', address],
    queryFn: () => address ? web3Api.getAccountBalance(address) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTransactionCount(address: string | undefined) {
  return useQuery({
    queryKey: ['blockchain', 'txCount', address],
    queryFn: () => address ? web3Api.getTransactionCount(address) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLatestTransactions(address: string | undefined, limit: number = 5) {
  return useQuery({
    queryKey: ['blockchain', 'transactions', address, limit],
    queryFn: () => address ? web3Api.getLatestTransactions(address, limit) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTokenTransfers(address: string | undefined, limit: number = 5) {
  return useQuery({
    queryKey: ['blockchain', 'tokens', address, limit],
    queryFn: () => address ? web3Api.getTokenTransfers(address, limit) : null,
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
