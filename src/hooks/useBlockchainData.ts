
import { useState, useEffect } from 'react';
import { useBlockchainProfile, useLatestTransactions, useTokenTransfers } from '@/hooks/useEtherscan';
import { useWeb3BioProfile } from '@/hooks/useWeb3';
import { fetchBlockchainData } from '@/api/services/blockchainDataService';

interface BlockchainDataResponse {
  mirrorPosts?: number;
  lensActivity?: number;
  boxDomains?: string[];
  snsActive?: boolean;
  description?: string;
}

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

  // Fetch blockchain data with optimized error handling
  const { data: blockchainProfile, isLoading: loadingBlockchain } = useBlockchainProfile(resolvedAddress);
  const { data: transactions } = useLatestTransactions(resolvedAddress, 20);
  const { data: tokenTransfers } = useTokenTransfers(resolvedAddress, 10);
  const { data: web3BioProfile } = useWeb3BioProfile(resolvedAddress || resolvedEns);
  
  // Fetch additional blockchain data with timeout and error handling
  useEffect(() => {
    const controller = new AbortController();
    
    const loadBlockchainData = async () => {
      if (resolvedAddress) {
        try {
          // Add timeout to prevent hanging requests
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 3000)
          );
          
          const dataPromise = fetchBlockchainData(resolvedAddress);
          
          const data = await Promise.race([dataPromise, timeoutPromise]) as BlockchainDataResponse;
          
          // Check if component is still mounted
          if (!controller.signal.aborted) {
            setBlockchainExtendedData({
              mirrorPosts: data.mirrorPosts || 0,
              lensActivity: data.lensActivity || 0,
              boxDomains: data.boxDomains || [],
              snsActive: data.snsActive || false,
              description: data.description
            });
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            console.error('Error fetching blockchain data:', error);
            // Set default values on error instead of failing
            setBlockchainExtendedData({
              mirrorPosts: 0,
              lensActivity: 0,
              boxDomains: [],
              snsActive: false,
              description: undefined
            });
          }
        }
      }
    };
    
    loadBlockchainData();
    
    // Cleanup function to cancel request if component unmounts
    return () => {
      controller.abort();
    };
  }, [resolvedAddress]);

  // Merge blockchain profile with extended data
  const enhancedBlockchainProfile = blockchainProfile ? {
    ...blockchainProfile,
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
    blockchainExtendedData
  };
}
