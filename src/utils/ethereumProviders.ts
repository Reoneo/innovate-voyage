
// Re-export all ethereum provider functionality from modular files
export { mainnetProvider, optimismProvider } from './ethereum/providers';
export { 
  getFromEnsCache, 
  addToEnsCache, 
  markFailedResolution, 
  DEFAULT_ENS_TTL, 
  PRIORITY_ENS_TTL 
} from './ethereum/ensCache';
export { MAINNET_RPC_URLS, OPTIMISM_RPC_URLS } from './ethereum/rpcUrls';
export { createProviders, createFallbackProvider } from './ethereum/providerFactory';
