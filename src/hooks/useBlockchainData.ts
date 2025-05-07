
import { useState, useEffect } from 'react';
import { useBlockchainProfile, useLatestTransactions, useTokenTransfers } from '@/hooks/useEtherscan';
import { useWeb3BioProfile } from '@/hooks/useWeb3';
import { fetchBlockchainData } from '@/api/services/blockchainDataService';

/**
 * Hook to fetch and combine blockchain-related data for a user profile
 * @param resolvedAddress Ethereum address to fetch data for
 * @param resolvedEns ENS name to fetch data for
 * @returns Object containing blockchain profile, transactions, token transfers, web3 bio and additional blockchain data
 */
export function useBlockchainData(resolvedAddress?: string, resolvedEns?: string) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blockchainExtendedData, setBlockchainExtendedData] = useState({
    mirrorPosts: 0,
    lensActivity: 0,
    boxDomains: [] as string[],
    snsActive: false,
    description: undefined as string | undefined
  });

  // Fetch blockchain data
  const { data: blockchainProfile, isLoading: loadingBlockchain } = useBlockchainProfile(resolvedAddress);
  const { data: transactions } = useLatestTransactions(resolvedAddress, 20);
  const { data: tokenTransfers } = useTokenTransfers(resolvedAddress, 10);
  const { data: web3BioProfile } = useWeb3BioProfile(resolvedAddress || resolvedEns);
  
  // Update the loading state when blockchain data loading changes
  useEffect(() => {
    setIsLoading(loadingBlockchain);
  }, [loadingBlockchain]);
  
  // Fetch additional blockchain data
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (resolvedAddress) {
        try {
          setIsLoading(true);
          const data = await fetchBlockchainData(resolvedAddress);
          // Make sure we maintain the structure expected by our state
          setBlockchainExtendedData({
            mirrorPosts: data.mirrorPosts,
            lensActivity: data.lensActivity,
            boxDomains: data.boxDomains,
            snsActive: data.snsActive,
            description: data.description
          });
        } catch (error) {
          console.error('Error fetching blockchain data:', error);
          setError('Failed to fetch additional blockchain data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadBlockchainData();
  }, [resolvedAddress]);

  // Merge blockchain profile with extended data
  const enhancedBlockchainProfile = blockchainProfile ? {
    ...blockchainProfile,
    blockchainExtendedData,
    web3BioProfile,
    transactions,
    tokenTransfers,
    mirrorPosts: blockchainExtendedData.mirrorPosts,
    lensActivity: blockchainExtendedData.lensActivity,
    boxDomains: blockchainExtendedData.boxDomains,
    snsActive: blockchainExtendedData.snsActive
  } : null;

  return {
    blockchainProfile: enhancedBlockchainProfile,
    transactions,
    tokenTransfers,
    web3BioProfile,
    loadingBlockchain,
    blockchainExtendedData,
    isLoading,
    error
  };
}
