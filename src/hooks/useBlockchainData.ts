
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

  // Fetch blockchain data
  const { data: blockchainProfile, isLoading: loadingBlockchain } = useBlockchainProfile(resolvedAddress);
  const { data: transactions } = useLatestTransactions(resolvedAddress, 10); // Reduced from 20 to 10 for faster loading
  const { data: tokenTransfers } = useTokenTransfers(resolvedAddress, 5); // Reduced from 10 to 5 for faster loading
  const { data: web3BioProfile } = useWeb3BioProfile(resolvedAddress || resolvedEns);
  
  // Fetch additional blockchain data with caching
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (resolvedAddress) {
        try {
          // Check for cached data first
          const cacheKey = `blockchain_data_${resolvedAddress}`;
          const cachedData = sessionStorage.getItem(cacheKey);
          const cachedTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
          
          // Use cached data if it exists and is less than 1 hour old
          if (cachedData && cachedTimestamp) {
            const timestamp = parseInt(cachedTimestamp);
            if (Date.now() - timestamp < 60 * 60 * 1000) { // 1 hour cache
              setBlockchainExtendedData(JSON.parse(cachedData));
              console.log('Using cached blockchain data for', resolvedAddress);
              return;
            }
          }
          
          // Fetch new data with a timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            const data = await fetchBlockchainData(resolvedAddress);
            clearTimeout(timeoutId);
            
            // Make sure we maintain the structure expected by our state
            const extendedData = {
              mirrorPosts: data.mirrorPosts,
              lensActivity: data.lensActivity,
              boxDomains: data.boxDomains,
              snsActive: data.snsActive,
              description: data.description
            };
            
            setBlockchainExtendedData(extendedData);
            
            // Cache the data for future use
            sessionStorage.setItem(cacheKey, JSON.stringify(extendedData));
            sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
          } catch (fetchError) {
            clearTimeout(timeoutId);
            
            if (fetchError.name === 'AbortError') {
              console.log('Blockchain data fetch timed out');
            } else {
              console.error('Error fetching blockchain data:', fetchError);
            }
          }
        } catch (error) {
          console.error('Error fetching blockchain data:', error);
        }
      }
    };
    
    loadBlockchainData();
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
