
// Use explicit named exports instead of star exports
export { 
  web3Api,
  getEnsByAddress,
  getAddressByEns,
  getEnsBio
} from './web3Api';

// Export specific types instead of star export
export type { 
  Web3BioProfile,
  ENSRecord,
  SkillNFT,
  Web3Credentials
} from './types/web3Types';

export type {
  BlockchainProfile
} from './types/etherscanTypes';
