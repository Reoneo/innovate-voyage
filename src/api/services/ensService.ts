
// Re-export all ENS-related service functions
export { getRealAvatar } from './avatarService';
export { getEnsByAddress, getAddressByEns } from './domainResolutionService';
export { getAllEnsRecords, fetchAllEnsDomains } from './domains';
export { getEnsBio } from '../../utils/ensResolution';

// Add a utility function to handle IPFS avatars
export const getFormattedAvatar = (avatar: string | null): string | null => {
  if (!avatar) return null;
  
  // Handle IPFS URLs
  if (avatar.startsWith("ipfs://")) {
    const cid = avatar.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cid}`;
  }
  
  return avatar;
};
