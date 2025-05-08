
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
  
  console.log('ENS Links in useProfileData:', ensLinks);
  
  // Check if talent protocol data is available
  const hasTalentProtocolData = !!blockchainData.blockchainProfile?.talentProtocolScore;
  
  // Enhance blockchain profile with ENS links
  const enhancedBlockchainProfile = blockchainData.blockchainProfile 
    ? {
        ...blockchainData.blockchainProfile,
        socials: {
          ...ensLinks?.socials,
          ...(blockchainData.blockchainProfile.socials || {})
        },
        ensLinks: ensLinks?.ensLinks || [],
        description: blockchainData.blockchainProfile.description || 
                     ensLinks?.description || 
                     ensBio ||
                     blockchainData.blockchainExtendedData?.description,
        // Make sure to preserve talent protocol data flag
        hasTalentProtocolData: hasTalentProtocolData
      }
    : null;
  
  // Debug GitHub sources
  console.log('GitHub sources:', {
    ensGitHub: ensLinks?.socials?.github,
    blockchainGitHub: blockchainData.blockchainProfile?.socials?.github,
    web3BioGitHub: blockchainData.web3BioProfile?.github,
    hasTalentProtocolData: hasTalentProtocolData
  });
  
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
        description: blockchainData.web3BioProfile?.description || ensBio,
        // Make sure GitHub username is passed through
        github: blockchainData.web3BioProfile?.github || ensLinks?.socials?.github,
        // Make sure LinkedIn handle is passed through
        linkedin: blockchainData.web3BioProfile?.linkedin || ensLinks?.socials?.linkedin
      },
      hasTalentProtocolData: hasTalentProtocolData
    }
  );

  // Add the talent protocol data flag to the passport
  const enhancedPassport = passport ? {
    ...passport,
    hasTalentProtocolData: hasTalentProtocolData
  } : null;

  return {
    loading,
    passport: enhancedPassport,
    blockchainProfile: enhancedBlockchainProfile,
    transactions: blockchainData.transactions,
    resolvedEns,
    blockchainExtendedData: blockchainData.blockchainExtendedData,
    avatarUrl,
    hasTalentProtocolData: hasTalentProtocolData
  };
}
