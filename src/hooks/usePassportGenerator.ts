
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
        const skills = [];
        const { 
          blockchainProfile, 
          transactions, 
          tokenTransfers, 
          web3BioProfile,
          blockchainExtendedData,
          avatarUrl
        } = blockchainData || {};
        
        if (blockchainProfile) {
          if (parseFloat(blockchainProfile.balance) > 0) skills.push({ name: 'ETH Holder', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 10) skills.push({ name: 'Active Trader', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 50) skills.push({ name: 'Power User', proof: `etherscan://${resolvedAddress}` });
        }
        
        if (resolvedEns?.includes('.eth')) skills.push({ name: 'ENS Owner', proof: `ens://${resolvedEns}` });
        
        if (transactions && transactions.length > 0) {
          const hasContractInteractions = transactions.some(tx => tx.input && tx.input !== '0x');
          if (hasContractInteractions) skills.push({ name: 'Smart Contract User', proof: `etherscan://${resolvedAddress}` });
          
          const recentTx = transactions.some(tx => {
            const txDate = new Date(parseInt(tx.timeStamp) * 1000);
            const now = new Date();
            const daysDiff = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
            return daysDiff < 30;
          });
          
          if (recentTx) skills.push({ name: 'Recently Active', proof: `etherscan://${resolvedAddress}` });
        }
        
        if (tokenTransfers && tokenTransfers.length > 0) {
          const uniqueTokens = new Set(tokenTransfers.map(tx => tx.tokenSymbol));
          if (uniqueTokens.size > 0) skills.push({ name: 'Token Holder', proof: `etherscan://${resolvedAddress}` });
          if (uniqueTokens.size > 5) skills.push({ name: 'Token Collector', proof: `etherscan://${resolvedAddress}` });
          
          if (Array.from(uniqueTokens).some(token => token === 'UNI')) {
            skills.push({ name: 'Uniswap User', proof: `etherscan://${resolvedAddress}` });
          }
        }
        
        if (web3BioProfile) {
          if (web3BioProfile.github) skills.push({ name: 'GitHub User', proof: web3BioProfile.github });
          if (web3BioProfile.twitter) skills.push({ name: 'Twitter User', proof: web3BioProfile.twitter });
          if (web3BioProfile.linkedin) skills.push({ name: 'LinkedIn User', proof: web3BioProfile.linkedin });
        }
        
        skills.push(
          { name: 'Smart Contract Developer', proof: 'talentprotocol.com/skills/dev' },
          { name: 'EVM Expert', proof: 'talentprotocol.com/skills/evm' },
          { name: 'Solidity', proof: 'talentprotocol.com/skills/solidity' }
        );
        
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
          skills: skills,
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
