
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
  const [blockchainExtendedData, setBlockchainExtendedData] = useState({
    mirrorPosts: 0,
    lensActivity: 0,
    boxDomains: [] as string[],
    snsActive: false,
    description: undefined as string | undefined
  });
  const [extendedDataError, setExtendedDataError] = useState<Error | null>(null);

  // Fetch blockchain data
  const { 
    data: blockchainProfile, 
    isLoading: loadingBlockchain,
    error: blockchainError 
  } = useBlockchainProfile(resolvedAddress);
  
  const { 
    data: transactions,
    error: transactionsError 
  } = useLatestTransactions(resolvedAddress, 20);
  
  const { 
    data: tokenTransfers,
    error: tokenTransfersError 
  } = useTokenTransfers(resolvedAddress, 10);
  
  const { data: web3BioProfile } = useWeb3BioProfile(resolvedAddress || resolvedEns);
  
  // Aggregate errors
  const error = blockchainError || transactionsError || tokenTransfersError || extendedDataError;
  
  // Fetch additional blockchain data
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (resolvedAddress) {
        try {
          const data = await fetchBlockchainData(resolvedAddress);
          // Make sure we maintain the structure expected by our state
          setBlockchainExtendedData({
            mirrorPosts: data.mirrorPosts,
            lensActivity: data.lensActivity,
            boxDomains: data.boxDomains,
            snsActive: data.snsActive,
            description: data.description
          });
          setExtendedDataError(null);
        } catch (error) {
          console.error('Error fetching blockchain data:', error);
          setExtendedDataError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    };
    
    loadBlockchainData();
  }, [resolvedAddress]);

  // Get description from web3BioProfile if available
  useEffect(() => {
    if (web3BioProfile?.description && !blockchainExtendedData.description) {
      setBlockchainExtendedData(prev => ({
        ...prev,
        description: web3BioProfile.description
      }));
    }
  }, [web3BioProfile]);

  // Merge blockchain profile with extended data, but only if we have actual blockchain data
  // We don't want to show mock data if the real data couldn't be fetched
  const enhancedBlockchainProfile = blockchainProfile ? {
    ...blockchainProfile,
    mirrorPosts: blockchainExtendedData.mirrorPosts,
    lensActivity: blockchainExtendedData.lensActivity,
    boxDomains: blockchainExtendedData.boxDomains,
    snsActive: blockchainExtendedData.snsActive,
    description: blockchainProfile.description || blockchainExtendedData.description || web3BioProfile?.description
  } : null;

  return {
    blockchainProfile: enhancedBlockchainProfile,
    transactions,
    tokenTransfers,
    web3BioProfile,
    loadingBlockchain,
    error,
    blockchainExtendedData: {
      ...blockchainExtendedData,
      description: blockchainExtendedData.description || web3BioProfile?.description
    }
  };
}
