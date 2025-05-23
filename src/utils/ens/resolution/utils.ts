
// Re-export all utilities from modular files
export { validateEnsName, validateAddress, getEffectiveEnsName } from './validation';
export { setupTimeoutController, firstSuccessful } from './timeoutUtils';
export { getAllEnsTextKeys, getCommonTextKeys, fetchTextRecords } from './textRecordUtils';
export { 
  resolveDotBoxDomain, 
  resolveWithDirectResolver, 
  resolveWithResolveName,
  standardEnsLookup,
  dotBoxLookup
} from './resolutionMethods';
export { resolveBoxDomainOnOptimism, lookupAddressOnOptimism } from './optimismResolver';
