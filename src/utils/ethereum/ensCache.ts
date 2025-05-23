
// ENS resolution caching utilities - DISABLED for accurate resolution

export const DEFAULT_ENS_TTL = 0;
export const PRIORITY_ENS_TTL = 0;

interface EnsCacheEntry {
  address?: string;
  ensName?: string;
  avatar?: string;
  bio?: string;
  links?: any;
  textRecords?: Record<string, string | null>;
  expiresAt: number;
  attempts?: number;
}

const ensCache: Map<string, EnsCacheEntry> = new Map();

// No initialization - cache disabled
const initializeCache = () => {
  console.log('ENS cache disabled for accurate resolution');
};

// Run initialization
initializeCache();

// Always return null - cache disabled
export function getFromEnsCache(key: string): EnsCacheEntry | null {
  console.log(`Cache disabled - not using cached data for ${key}`);
  return null;
}

// No-op - cache disabled
export function addToEnsCache(
  key: string, 
  data: Partial<EnsCacheEntry>, 
  ttl: number = DEFAULT_ENS_TTL
): void {
  console.log(`Cache disabled - not caching data for ${key}`);
}

// No-op - cache disabled
export function markFailedResolution(key: string): void {
  console.log(`Cache disabled - not marking failed resolution for ${key}`);
}
