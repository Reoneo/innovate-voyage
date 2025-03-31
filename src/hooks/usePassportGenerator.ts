
import { useState, useEffect, useRef } from 'react';
import { BlockchainPassport, calculateHumanScore } from '@/lib/utils';
import { truncateAddress } from '@/lib/utils';

/**
 * Hook to generate a blockchain passport based on user data
 * @param resolvedAddress Ethereum address of the user
 * @param resolvedEns ENS name of the user
 * @param blockchainData Combined blockchain data
 * @returns Object containing the generated passport with score and loading state
 */
export function usePassportGenerator(
  resolvedAddress?: string, 
  resolvedEns?: string, 
  blockchainData?: {
    blockchainProfile: any;
    transactions: any[] | null;
    tokenTransfers: any[] | null;
    web3BioProfile: any;
    blockchainExtendedData: {
      boxDomains: string[];
      snsActive: boolean;
      description?: string;
    };
    avatarUrl?: string;
  }
) {
  const [passport, setPassport] = useState<BlockchainPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    const createPassport = async () => {
      if (!resolvedAddress) return;
      
      setLoading(true);
      
      try {
        const { 
          blockchainProfile, 
          web3BioProfile,
          blockchainExtendedData,
          avatarUrl
        } = blockchainData || {};
        
        const socials = {
          github: web3BioProfile?.github || undefined,
          twitter: web3BioProfile?.twitter || undefined,
          linkedin: web3BioProfile?.linkedin || undefined,
          website: web3BioProfile?.website || undefined,
          email: web3BioProfile?.email || undefined
        };
        
        // Get bio from blockchain data or web3 bio profile
        const bio = blockchainProfile?.description || 
                   blockchainExtendedData?.description || 
                   web3BioProfile?.description || 
                   '';
        
        const newPassport: BlockchainPassport = {
          passport_id: resolvedEns || truncateAddress(resolvedAddress),
          owner_address: resolvedAddress,
          avatar_url: avatarUrl || web3BioProfile?.avatar || '/placeholder.svg',
          name: resolvedEns ? resolvedEns.split('.')[0] : truncateAddress(resolvedAddress),
          issued: new Date().toISOString(),
          skills: [], // Empty array for skills
          socials: socials,
          bio: bio
        };
        
        setPassport(newPassport);
      } catch (error) {
        console.error('Error creating passport:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (resolvedAddress && !initialized.current) {
      initialized.current = true;
      createPassport();
    }
  }, [resolvedAddress, resolvedEns, blockchainData]);

  const passportWithScore = passport ? {
    ...passport,
    ...calculateHumanScore(passport)
  } : null;

  return {
    passport: passportWithScore,
    loading
  };
}
