import { useMemo } from 'react';
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
  
  // Add debugging so we know what is resolved and sent to the POAP section
  if (resolvedEns || resolvedAddress) {
    console.log('[ProfileData hook] resolvedEns:', resolvedEns, 'resolvedAddress:', resolvedAddress, 'input ENS:', ensName, 'input address:', address);
  }

  // Fetch blockchain data only when we have a resolved address
  const blockchainData = useBlockchainData(resolvedAddress, resolvedEns);
  
  // Memoize enhanced blockchain profile to prevent unnecessary recalculations
  const enhancedBlockchainProfile = useMemo(() => {
    if (!blockchainData.blockchainProfile) return null;
    
    return {
      ...blockchainData.blockchainProfile,
      socials: {
        ...ensLinks?.socials,
        ...(blockchainData.blockchainProfile.socials || {})
      },
      ensLinks: ensLinks?.ensLinks || [],
      description: blockchainData.blockchainProfile.description || 
                   ensLinks?.description || 
                   ensBio ||
                   blockchainData.blockchainExtendedData?.description
    };
  }, [blockchainData.blockchainProfile, ensLinks, ensBio, blockchainData.blockchainExtendedData?.description]);
  
  // Check if talent protocol data is available - using a more reliable property check
  const hasTalentProtocolData = useMemo(() => {
    return !!(blockchainData.blockchainExtendedData?.snsActive);
  }, [blockchainData.blockchainExtendedData?.snsActive]);
  
  // Memoize web3 bio profile enhancement
  const enhancedWeb3BioProfile = useMemo(() => {
    if (!blockchainData.web3BioProfile) return null;
    
    return {
      ...blockchainData.web3BioProfile,
      description: blockchainData.web3BioProfile.description || ensBio,
      github: blockchainData.web3BioProfile.github || ensLinks?.socials?.github,
      linkedin: blockchainData.web3BioProfile.linkedin || ensLinks?.socials?.linkedin
    };
  }, [blockchainData.web3BioProfile, ensBio, ensLinks?.socials?.github, ensLinks?.socials?.linkedin]);
  
  // Generate passport with optimized data
  const { passport, loading } = usePassportGenerator(
    resolvedAddress, 
    resolvedEns, 
    {
      ...blockchainData,
      blockchainProfile: enhancedBlockchainProfile,
      avatarUrl,
      web3BioProfile: enhancedWeb3BioProfile
    }
  );

  // Memoize enhanced passport to prevent unnecessary re-renders
  const enhancedPassport = useMemo(() => {
    if (!passport) return null;
    
    return {
      ...passport,
      hasTalentProtocolData
    };
  }, [passport, hasTalentProtocolData]);

  return {
    loading,
    passport: enhancedPassport,
    blockchainProfile: enhancedBlockchainProfile,
    transactions: blockchainData.transactions,
    resolvedEns,
    blockchainExtendedData: blockchainData.blockchainExtendedData,
    avatarUrl,
    hasTalentProtocolData
  };
}
