
import { ENSRecord, SkillNFT, Web3Credentials, Web3BioProfile } from './types/web3Types';
import { BlockchainProfile } from './types/etherscanTypes';
import { 
  getAllEnsRecords,
} from './services/ensService';
import { 
  getSkillNftsByAddress,
  getAllSkillNfts
} from './services/nftService';
import { 
  getAccountBalance,
  getTransactionCount,
  getLatestTransactions,
  getTokenTransfers
} from './services/etherscanService';
import { fetchWeb3BioProfile } from './utils/web3/index';
import { getRealAvatar } from './services/avatar';

// Add these missing functions
export async function getEnsByAddress(address: string): Promise<ENSRecord | null> {
  try {
    const profile = await fetchWeb3BioProfile(address);
    if (profile && profile.identity) {
      return {
        ensName: profile.identity,
        address: profile.address,
        avatar: profile.avatar,
        bio: profile.description
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting ENS by address:', error);
    return null;
  }
}

export async function getAddressByEns(ensName: string): Promise<string | null> {
  try {
    const profile = await fetchWeb3BioProfile(ensName);
    return profile?.address || null;
  } catch (error) {
    console.error('Error getting address by ENS:', error);
    return null;
  }
}

export async function getEnsBio(identity: string): Promise<string | null> {
  try {
    const profile = await fetchWeb3BioProfile(identity);
    return profile?.description || null;
  } catch (error) {
    console.error('Error getting ENS bio:', error);
    return null;
  }
}

// Get all Web3 credentials (ENS + Skill NFTs) by address
async function getWeb3CredentialsByAddress(address: string): Promise<Web3Credentials> {
  const [ensRecord, skillNfts] = await Promise.all([
    getEnsByAddress(address),
    getSkillNftsByAddress(address)
  ]);
  
  return {
    ensRecord,
    skillNfts
  };
}

// Get blockchain profile data from Etherscan
async function getBlockchainProfile(address: string): Promise<BlockchainProfile> {
  const [balance, transactionCount, latestTransactions, tokenTransfers] = await Promise.all([
    getAccountBalance(address),
    getTransactionCount(address),
    getLatestTransactions(address),
    getTokenTransfers(address)
  ]);
  
  return {
    address,
    balance,
    transactionCount,
    latestTransactions,
    tokenTransfers
  };
}

export const web3Api = {
  getRealAvatar,
  getEnsByAddress,
  getAddressByEns,
  getSkillNftsByAddress,
  getWeb3CredentialsByAddress,
  getAllEnsRecords,
  getAllSkillNfts,
  fetchWeb3BioProfile,
  getAccountBalance,
  getTransactionCount,
  getLatestTransactions,
  getTokenTransfers,
  getBlockchainProfile,
  getEnsBio
};

// Re-export types for convenience
export type { ENSRecord, SkillNFT, Web3Credentials, Web3BioProfile, BlockchainProfile };
