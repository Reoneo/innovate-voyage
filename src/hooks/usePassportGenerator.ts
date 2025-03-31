
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
        const skills = [];
        const { 
          blockchainProfile, 
          transactions, 
          tokenTransfers,
          blockchainExtendedData,
          avatarUrl
        } = blockchainData || {};
        
        if (blockchainProfile) {
          if (parseFloat(blockchainProfile.balance) > 0) skills.push({ name: 'ETH Holder', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 10) skills.push({ name: 'Active Trader', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 50) skills.push({ name: 'Power User', proof: `etherscan://${resolvedAddress}` });
        }
        
        if (resolvedEns?.includes('.eth') || resolvedEns?.includes('.box')) skills.push({ name: 'ENS Owner', proof: `ens://${resolvedEns}` });
        
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
        
        // Add some default Web3 skills without relying on web3.bio
        skills.push(
          { name: 'Smart Contract Developer', proof: 'talentprotocol.com/skills/dev' },
          { name: 'EVM Expert', proof: 'talentprotocol.com/skills/evm' },
          { name: 'Solidity', proof: 'talentprotocol.com/skills/solidity' }
        );

        if (blockchainExtendedData?.boxDomains && blockchainExtendedData.boxDomains.length > 0) {
          skills.push({ name: '.box Domain Owner', proof: 'box.domains' });
        }

        if (blockchainExtendedData?.snsActive) {
          skills.push({ name: 'SNS.ID User', proof: 'sns.id' });
        }
        
        // Collect social data from ENS records and Etherscan
        const socials = {
          github: blockchainExtendedData?.github || undefined,
          twitter: blockchainExtendedData?.twitter || undefined,
          linkedin: blockchainExtendedData?.linkedin || undefined,
          website: blockchainExtendedData?.website || undefined,
          email: blockchainExtendedData?.email || undefined
        };
        
        // Get bio from blockchain data or ENS records
        const bio = blockchainProfile?.description || 
                   blockchainExtendedData?.description || 
                   '';
        
        // Get the best name to display (prioritize ENS records displayName)
        const displayName = blockchainExtendedData?.displayName || 
                           (resolvedEns ? resolvedEns.split('.')[0] : truncateAddress(resolvedAddress));
        
        const newPassport: BlockchainPassport = {
          passport_id: resolvedEns || truncateAddress(resolvedAddress),
          owner_address: resolvedAddress,
          avatar_url: avatarUrl || '/placeholder.svg',
          name: displayName,
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
