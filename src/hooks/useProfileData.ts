
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { usePassportGenerator } from '@/hooks/usePassportGenerator';
import { useState, useEffect } from 'react';

/**
 * Hook to fetch and combine all profile data for a blockchain user
 * @param ensName Optional ENS name to fetch data for
 * @param address Optional Ethereum address to fetch data for
 * @returns Object containing profile data including passport, blockchain data, and loading state
 */
export function useProfileData(ensName?: string, address?: string) {
  const [error, setError] = useState<string | null>(null);
  
  // Resolve ENS and address with error handling
  const { 
    resolvedAddress, 
    resolvedEns, 
    avatarUrl, 
    ensLinks, 
    ensBio, 
    error: ensError, 
    isLoading: ensLoading 
  } = useEnsResolver(ensName, address);
  
  useEffect(() => {
    if (ensError) {
      setError(`ENS resolution error: ${ensError}`);
    }
  }, [ensError]);
  
  // Fetch blockchain data
  const { 
    blockchainProfile, 
    transactions, 
    isLoading: blockchainLoading, 
    error: blockchainError 
  } = useBlockchainData(resolvedAddress, resolvedEns);
  
  // Enhance blockchain profile with ENS links
  const enhancedBlockchainProfile = blockchainProfile 
    ? {
        ...blockchainProfile,
        socials: {
          ...ensLinks?.socials,
          ...(blockchainProfile.socials || {})
        },
        ensLinks: ensLinks?.ensLinks || [],
        description: blockchainProfile.description || 
                     ensLinks?.description || 
                     ensBio ||
                     blockchainProfile.blockchainExtendedData?.description
      }
    : null;
  
  // Generate passport with error handling
  const { passport, loading: passportLoading, error: passportError } = usePassportGenerator(
    resolvedAddress, 
    resolvedEns, 
    {
      ...blockchainProfile,
      blockchainProfile: enhancedBlockchainProfile,
      avatarUrl,
      web3BioProfile: {
        ...blockchainProfile.web3BioProfile,
        description: blockchainProfile.web3BioProfile?.description || ensBio,
        github: blockchainProfile.web3BioProfile?.github || ensLinks?.socials?.github,
        linkedin: blockchainProfile.web3BioProfile?.linkedin || ensLinks?.socials?.linkedin
      }
    }
  );
  
  useEffect(() => {
    if (passportError) {
      setError(`Passport generation error: ${passportError}`);
    }
    
    if (blockchainError) {
      setError(`Blockchain data error: ${blockchainError}`);
    }
  }, [passportError, blockchainError]);

  // Determine overall loading state
  const loading = ensLoading || blockchainLoading || passportLoading;

  return {
    loading,
    error,
    passport,
    blockchainProfile: enhancedBlockchainProfile,
    transactions: blockchainProfile?.transactions,
    resolvedEns,
    blockchainExtendedData: blockchainProfile?.blockchainExtendedData,
    avatarUrl
  };
}
