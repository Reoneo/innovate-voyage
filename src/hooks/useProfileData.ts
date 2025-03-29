
import { useState, useEffect } from 'react';
import { useEnsByAddress, useAddressByEns, useWeb3BioProfile } from '@/hooks/useWeb3';
import { useBlockchainProfile, useLatestTransactions, useTokenTransfers } from '@/hooks/useEtherscan';
import { BlockchainPassport, calculateHumanScore } from '@/lib/utils';
import { fetchBlockchainData } from '@/api/services/blockchainDataService';

export function useProfileData(ensName?: string, address?: string) {
  const [passport, setPassport] = useState<BlockchainPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockchainData, setBlockchainData] = useState({
    mirrorPosts: 0,
    lensActivity: 0,
    boxDomains: [],
    snsActive: false
  });

  // Resolve ENS name and address
  const { data: addressData } = useAddressByEns(
    ensName?.includes('.eth') ? ensName : undefined
  );
  const { data: ensData } = useEnsByAddress(
    !ensName?.includes('.eth') ? address : undefined
  );
  
  const resolvedAddress = addressData?.address || address;
  const resolvedEns = ensName || ensData?.ensName;
  
  // Fetch blockchain data
  const { data: blockchainProfile, isLoading: loadingBlockchain } = useBlockchainProfile(resolvedAddress);
  const { data: transactions } = useLatestTransactions(resolvedAddress, 20);
  const { data: tokenTransfers } = useTokenTransfers(resolvedAddress, 10);
  const { data: web3BioProfile } = useWeb3BioProfile(resolvedAddress || resolvedEns);
  
  // Fetch additional blockchain data
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (resolvedAddress) {
        try {
          const data = await fetchBlockchainData(resolvedAddress);
          setBlockchainData(data);
        } catch (error) {
          console.error('Error fetching blockchain data:', error);
        }
      }
    };
    
    loadBlockchainData();
  }, [resolvedAddress]);

  // Create passport
  useEffect(() => {
    const createPassport = async () => {
      if (!resolvedAddress) return;
      
      setLoading(true);
      
      try {
        const skills = [];
        
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

        if (blockchainData.boxDomains && blockchainData.boxDomains.length > 0) {
          skills.push({ name: '.box Domain Owner', proof: 'box.domains' });
        }

        if (blockchainData.snsActive) {
          skills.push({ name: 'SNS.ID User', proof: 'sns.id' });
        }
        
        const newPassport: BlockchainPassport = {
          passport_id: resolvedEns || truncateAddress(resolvedAddress),
          owner_address: resolvedAddress,
          avatar_url: web3BioProfile?.avatar || '/placeholder.svg',
          name: resolvedEns ? resolvedEns.split('.')[0] : truncateAddress(resolvedAddress),
          issued: new Date().toISOString(),
          skills: skills,
          socials: {
            github: web3BioProfile?.github,
            twitter: web3BioProfile?.twitter,
            linkedin: web3BioProfile?.linkedin,
            website: web3BioProfile?.website,
            email: web3BioProfile?.email
          }
        };
        
        setPassport(newPassport);
      } catch (error) {
        console.error('Error creating passport:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (resolvedAddress) {
      createPassport();
    }
  }, [resolvedAddress, resolvedEns, blockchainProfile, transactions, tokenTransfers, web3BioProfile, blockchainData]);

  // Calculate passport with score
  const passportWithScore = passport ? {
    ...passport,
    ...calculateHumanScore(passport)
  } : null;

  return {
    loading,
    passport: passportWithScore,
    blockchainProfile: blockchainProfile ? {
      ...blockchainProfile,
      mirrorPosts: blockchainData.mirrorPosts,
      lensActivity: blockchainData.lensActivity,
      boxDomains: blockchainData.boxDomains,
      snsActive: blockchainData.snsActive
    } : null,
    transactions,
    resolvedEns,
  };
}

// Helper function from utils.ts
function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}
