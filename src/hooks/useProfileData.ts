
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { usePassportGenerator } from '@/hooks/usePassportGenerator';
import { useEffect } from 'react';

/**
 * Hook to fetch and combine all profile data for a blockchain user
 * @param ensName Optional ENS name to fetch data for
 * @param address Optional Ethereum address to fetch data for
 * @returns Object containing profile data including passport, blockchain data, and loading state
 */
export function useProfileData(ensName?: string, address?: string) {
  // Resolve ENS and address - Using eager resolution for faster loading
  const { resolvedAddress, resolvedEns, avatarUrl, ensLinks, ensBio, loading: ensLoading } = useEnsResolver(ensName, address, { eager: true });
  
  // Fetch blockchain data
  const blockchainData = useBlockchainData(resolvedAddress, resolvedEns, { priority: true });
  
  // Enhance blockchain profile with ENS links
  const enhancedBlockchainProfile = blockchainData.blockchainProfile 
    ? {
        ...blockchainData.blockchainProfile,
        socials: ensLinks?.socials || {},
        ensLinks: ensLinks?.ensLinks || [],
        description: blockchainData.blockchainProfile.description || 
                     ensLinks?.description || 
                     ensBio ||
                     blockchainData.blockchainExtendedData?.description
      }
    : null;
  
  // Generate passport with priority flag for faster loading
  const { passport, loading: passportLoading } = usePassportGenerator(
    resolvedAddress, 
    resolvedEns, 
    {
      ...blockchainData,
      blockchainProfile: enhancedBlockchainProfile,
      avatarUrl,
      web3BioProfile: {
        ...blockchainData.web3BioProfile,
        description: blockchainData.web3BioProfile?.description || ensBio
      }
    },
    { priority: true }
  );

  // Preload NFT data
  useEffect(() => {
    if (resolvedAddress) {
      // Preload NFTs by making a request to fetch them in the background
      const preloadNFTs = async () => {
        try {
          const apiEndpoint = `/api/nfts/${resolvedAddress}`;
          // Make a non-blocking request to preload NFT data
          fetch(apiEndpoint).catch(() => {
            // Silently handle errors - this is just preloading
            console.log('NFT data preloading initiated');
          });
        } catch (e) {
          // Ignore errors for preloading
        }
      };
      
      // Delay preloading by a short time to prioritize critical resources first
      setTimeout(preloadNFTs, 1000);
    }
  }, [resolvedAddress]);

  const loading = ensLoading || passportLoading;

  return {
    loading,
    passport,
    blockchainProfile: enhancedBlockchainProfile,
    transactions: blockchainData.transactions,
    resolvedEns,
    blockchainExtendedData: blockchainData.blockchainExtendedData,
    avatarUrl
  };
}
