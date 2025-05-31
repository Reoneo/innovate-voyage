
// Use explicit named exports instead of star exports
export { 
  getWeb3Profile,
  getEnsBio,
  getEnsAvatar,
  getEnsRecords,
  validateEthereumAddress,
  resolveEnsName,
  getAddressByEns
} from './web3Api';

// Export specific types instead of star export
export type { 
  Web3Profile,
  EnsRecord,
  Web3ApiResponse,
  ProfileData
} from './types/web3Types';

export type {
  EtherscanTransaction,
  EtherscanResponse,
  TokenTransfer
} from './types/etherscanTypes';
