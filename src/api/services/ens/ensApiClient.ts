
// Re-export everything from the smaller files
export { publicClient, ENS_API_URL } from './client/publicClient';
export { resolveEnsName, lookupEnsName } from './operations/nameOperations';
export { fetchEnsProfile, getEnsSocialLinks, getEnsTextRecords } from './operations/profileOperations';
export { getEnsAvatarUrl, getEnsTextRecord } from './operations/recordOperations';
export type { EnsProfile } from './types/ensTypes';
