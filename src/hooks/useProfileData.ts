
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
  const { resolvedAddress, resolvedEns, avatarUrl, ensLinks, ensBio } = useEnsResolver(ensName, address);
  
  // Fetch blockchain data
  const blockchainData = useBlockchainData(resolvedAddress, resolvedEns);
  
  // Log the social links from ensLinks
  console.log('useProfileData - Social links from ENS resolver:', ensLinks?.socials);
  
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
  
  // Generate passport
  const { passport, loading } = usePassportGenerator(
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
    }
  );

  console.log('useProfileData - bio sources:', {
    ensBio,
    web3BioDescription: blockchainData.web3BioProfile?.description,
    blockchainProfileDesc: enhancedBlockchainProfile?.description,
    passportBio: passport?.bio
  });
  
  // Log the socials in the passport
  console.log('useProfileData - Social links in passport:', passport?.socials);

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
