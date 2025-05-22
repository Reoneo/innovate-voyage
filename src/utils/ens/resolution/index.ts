
// Re-export all resolution functionality
export { resolveEnsToAddress, resolveNameAndMetadata } from './forwardResolution';
export { resolveAddressToEns, lookupAddressAndMetadata } from './reverseResolution';
export { checkCache, updateCache, handleFailedResolution, checkCacheForTextRecords } from './cache';
export { 
  validateEnsName, validateAddress, getEffectiveEnsName, 
  setupTimeoutController, firstSuccessful, getAllEnsTextKeys,
  getCommonTextKeys, fetchTextRecords
} from './utils';
export { STANDARD_TIMEOUT } from './constants';
export type { ResolvedENS, EnsResolutionResult, DotBitResult, TextRecord } from './types';
