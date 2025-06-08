
// Main ENS service exports
export { getPriorityENSRecords } from './priorityRecords';
export { getENSProfile } from './fullProfile';
export { getENSNameByAddress } from './reverseLookup';
export { fetchPriorityRecords, fetchAllTextRecords, fetchRecordsBatch } from './textRecords';

// New unified ENS system
export { 
  fetchAllENSTextRecords, 
  processENSTextRecords, 
  getCompleteENSData 
} from './unifiedTextRecords';

// Type exports
export type { 
  ENSProfile, 
  ENSTextRecord, 
  ENSSocialRecord,
  ENSTextRecordKey,
  PriorityRecordKey
} from './types';

// New unified types
export type { 
  ENSTextRecords, 
  ENSSocialData 
} from './unifiedTextRecords';

// Constant exports
export { 
  PRIORITY_RECORDS, 
  ALL_TEXT_RECORDS, 
  RECORD_TO_PLATFORM_MAP 
} from './types';
