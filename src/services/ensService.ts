
// Re-export all ENS functionality from the refactored modules
export { 
  getPriorityENSRecords, 
  getENSProfile, 
  getENSNameByAddress,
  fetchPriorityRecords,
  fetchAllTextRecords,
  fetchRecordsBatch
} from './ens';

export type { 
  ENSProfile, 
  ENSTextRecord, 
  ENSSocialRecord,
  ENSTextRecordKey,
  PriorityRecordKey
} from './ens';

export { 
  PRIORITY_RECORDS, 
  ALL_TEXT_RECORDS, 
  RECORD_TO_PLATFORM_MAP 
} from './ens';
