
// This file now re-exports from the refactored structure
// to maintain backward compatibility

import { 
  getAccountBalance, 
  getTransactionCount, 
  getWalletCreationDate, 
  getLatestTransactions, 
  getTokenTransfers,
  getStakingPositions,
  getTokensByAddress 
} from './etherscan';

// Re-export everything
export {
  getAccountBalance,
  getTransactionCount,
  getWalletCreationDate,
  getLatestTransactions,
  getTokenTransfers,
  getStakingPositions,
  getTokensByAddress
};
