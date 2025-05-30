
// Types for Etherscan API responses
export interface BlockchainProfile {
  address: string;
  balance: string;
  transactionCount: number;
  latestTransactions?: any[];
  tokenTransfers?: any[];
  boxDomains?: string[];
  snsActive?: boolean;
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    bluesky?: string;
  };
  ensLinks?: string[];
  // Add description field for user bio
  description?: string;
  // Add new fields for extended data
  mirrorPosts?: number;
  lensActivity?: number;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface TokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}
