import { ENSRecord, SkillNFT, Web3Credentials, Web3BioProfile } from './types/web3Types';
import { BlockchainProfile } from './types/etherscanTypes';
import { 
  getEnsByAddress, 
  getAddressByEns,
  getAllEnsRecords,
  getEnsBio
} from './services/ensService';
import { 
  getSkillNftsByAddress,
  getAllSkillNfts
} from './services/nftService';
import { 
  getAccountBalance,
  getTransactionCount,
  getLatestTransactions,
  getTokenTransfers,
  getFirstTransaction,
  getOptimismTransactions,
  getAccountAge
} from './services/etherscanService';
import { fetchWeb3BioProfile } from './utils/web3/index';
import { getRealAvatar } from './services/avatar';

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

// Get blockchain profile data from Etherscan with enhanced data and debugging
async function getBlockchainProfile(address: string): Promise<BlockchainProfile> {
  console.log('🔄 Fetching enhanced blockchain profile for:', address);
  
  const [
    balanceResult,
    transactionCountResult,
    latestTransactionsResult,
    tokenTransfersResult,
    firstTransactionResult,
    optimismTxsResult,
    accountAgeResult
  ] = await Promise.all([
    getAccountBalance(address),
    getTransactionCount(address),
    getLatestTransactions(address, 10),
    getTokenTransfers(address, 5),
    getFirstTransaction(address),
    getOptimismTransactions(address, 5),
    getAccountAge(address)
  ]);
  
  console.log('📊 Blockchain profile results:', {
    balance: balanceResult.balance,
    txCount: transactionCountResult.count,
    firstTx: firstTransactionResult.transaction,
    accountAge: accountAgeResult.age
  });
  
  return {
    address,
    balance: balanceResult.balance,
    transactionCount: transactionCountResult.count,
    latestTransactions: latestTransactionsResult.transactions,
    tokenTransfers: tokenTransfersResult.transfers,
    firstTransaction: firstTransactionResult.transaction,
    optimismTransactions: optimismTxsResult.transactions,
    accountAge: accountAgeResult.age
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
  getEnsBio,
  getFirstTransaction,
  getOptimismTransactions,
  getAccountAge
};

// Re-export types for convenience
export type { ENSRecord, SkillNFT, Web3Credentials, Web3BioProfile, BlockchainProfile };
