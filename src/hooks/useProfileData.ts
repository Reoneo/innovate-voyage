
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { usePassportGenerator } from '@/hooks/usePassportGenerator';

/**
 * Hook to fetch and combine all profile data for a blockchain user
 * @param ensName Optional ENS name to fetch data for
 * @param address Optional Ethereum address to fetch data for
 * @returns Object containing profile data including passport, blockchain data, and loading state
 */
export function useProfileData(ensName?: string, address?: string) {
  // Resolve ENS and address
  const { resolvedAddress, resolvedEns } = useEnsResolver(ensName, address);
  
  // Fetch blockchain data
  const blockchainData = useBlockchainData(resolvedAddress, resolvedEns);
  
  // Generate passport
  const { passport, loading } = usePassportGenerator(
    resolvedAddress, 
    resolvedEns, 
    blockchainData
  );

  return {
    loading,
    passport,
    blockchainProfile: blockchainData.blockchainProfile,
    transactions: blockchainData.transactions,
    resolvedEns,
  };
}
