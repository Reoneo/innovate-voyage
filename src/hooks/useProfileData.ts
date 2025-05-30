
import { useState, useEffect } from 'react';
import { web3Api } from '@/api/web3Api';
import { useEnsResolver } from './useEnsResolver';
import { useTalentProtocolSkills } from '@/components/talent/profile/components/skills/useTalentProtocolSkills';

export function useProfileData(ensNameOrAddress?: string) {
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    resolvedAddress,
    resolvedEns,
    avatarUrl,
    ensLinks,
    isLoading: ensLoading,
    error: ensError
  } = useEnsResolver(ensNameOrAddress);

  const { 
    talentSkills, 
    credentialSkills, 
    talentScore, 
    isLoading: talentLoading 
  } = useTalentProtocolSkills(resolvedAddress);

  useEffect(() => {
    const fetchPassportData = async () => {
      if (!resolvedAddress) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Fetching passport data for address:', resolvedAddress);
        
        // Fetch web3 bio profile and blockchain data in parallel
        const [web3BioProfile, blockchainProfile] = await Promise.all([
          web3Api.fetchWeb3BioProfile(resolvedAddress),
          web3Api.getBlockchainProfile(resolvedAddress)
        ]);

        console.log('📊 Web3 bio profile:', web3BioProfile);
        console.log('🔗 Blockchain profile:', blockchainProfile);

        // Extract blockchain data with proper error handling
        const transactions = blockchainProfile.latestTransactions || [];
        const tokenTransfers = blockchainProfile.tokenTransfers || [];

        // Build comprehensive passport object
        const passportData = {
          owner_address: resolvedAddress,
          name: web3BioProfile?.displayName || resolvedEns || ensNameOrAddress || `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`,
          avatar_url: avatarUrl || web3BioProfile?.avatar,
          bio: web3BioProfile?.description || null,
          socials: {
            github: web3BioProfile?.links?.github?.handle || ensLinks?.socials?.github,
            twitter: web3BioProfile?.links?.twitter?.handle || ensLinks?.socials?.twitter,
            linkedin: web3BioProfile?.links?.linkedin?.handle || ensLinks?.socials?.linkedin,
            website: web3BioProfile?.links?.website?.link || ensLinks?.socials?.website,
            facebook: web3BioProfile?.links?.facebook?.handle || ensLinks?.socials?.facebook,
            instagram: web3BioProfile?.links?.instagram?.handle || ensLinks?.socials?.instagram,
            youtube: web3BioProfile?.links?.youtube?.handle || ensLinks?.socials?.youtube,
            bluesky: web3BioProfile?.links?.bluesky?.handle || ensLinks?.socials?.bluesky,
          },
          blockchainProfile: blockchainProfile,
          transactions: transactions,
          tokenTransfers: tokenTransfers,
          web3BioProfile: web3BioProfile,
          blockchainExtendedData: {
            boxDomains: web3BioProfile?.identities?.filter(d => d.endsWith('.box')) || [],
            snsActive: web3BioProfile?.identities?.length > 0,
            description: web3BioProfile?.description
          },
          avatarUrl: avatarUrl,
          additionalEnsDomains: web3BioProfile?.identities?.filter(d => d.endsWith('.eth') && d !== ensNameOrAddress) || [],
          skills: {
            verified: talentSkills || [],
            credentials: credentialSkills || [],
            user_added: []
          },
          talentScore: talentScore
        };

        console.log('✅ Profile data loaded successfully:', {
          hasPassport: !!passportData,
          hasAvatar: !!passportData.avatar_url,
          hasBlockchainData: !!blockchainProfile,
          hasTalentData: !!talentScore
        });

        setPassport(passportData);
      } catch (err) {
        console.error('❌ Error fetching passport data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedAddress && !ensLoading) {
      fetchPassportData();
    }
  }, [resolvedAddress, ensLoading, avatarUrl, ensLinks, resolvedEns, ensNameOrAddress, talentSkills, credentialSkills, talentScore]);

  // Combined loading state
  const isLoading = loading || ensLoading || talentLoading;

  return {
    passport,
    loading: isLoading,
    error: error || ensError,
    resolvedAddress,
    resolvedEns,
    avatarUrl
  };
}
