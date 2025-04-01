
// Re-export all ENS-related service functions
export { getRealAvatar } from './avatarService';
export { getEnsByAddress, getAddressByEns } from './domainResolutionService';
export { getAllEnsRecords, fetchAllEnsDomains } from './domains';
export { getEnsBio } from '../../utils/ensResolution';
