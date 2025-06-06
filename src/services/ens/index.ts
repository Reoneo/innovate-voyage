
// Main ENS service exports
export { getPriorityENSRecords } from './priorityRecords';
export { getENSProfile } from './fullProfile';
export { getENSNameByAddress } from './reverseLookup';
export { fetchPriorityRecords, fetchAllTextRecords, fetchRecordsBatch } from './textRecords';

// Type exports
export type { 
  ENSProfile, 
  ENSTextRecord, 
  ENSSocialRecord,
  ENSTextRecordKey,
  PriorityRecordKey
} from './types';

// Constant exports
export { 
  PRIORITY_RECORDS, 
  ALL_TEXT_RECORDS, 
  RECORD_TO_PLATFORM_MAP 
} from './types';
