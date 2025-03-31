
import { ENSRecord, SkillNFT, Web3Credentials, Web3BioProfile } from './types/web3Types';
import { BlockchainProfile } from './types/etherscanTypes';
import { 
  getRealAvatar, 
  getEnsByAddress, 
  getAddressByEns,
  getAllEnsRecords 
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
import { fetchWeb3BioProfile } from './utils/web3Utils';

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
  getBlockchainProfile
};

// Re-export types for convenience
export type { ENSRecord, SkillNFT, Web3Credentials, Web3BioProfile, BlockchainProfile };
