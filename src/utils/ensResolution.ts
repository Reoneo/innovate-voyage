
// Re-export all ENS-related functions from the new modules
// This maintains backward compatibility with existing code
export { 
  resolveEnsToAddress as resolveEnsToAddress,
  resolveAddressToEns,
  getEnsAvatar,
  getEnsBio,
  getEnsLinks
} from './ens';
