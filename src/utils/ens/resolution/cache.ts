
// ENS resolution caching utilities - DISABLED for accurate resolution

/**
 * Check if an ENS name or address is in the cache - DISABLED
 */
export function checkCache<T extends string | null>(
  key: string, 
  resultType: 'address' | 'ensName'
): T {
  // Always return null to force fresh resolution
  return null as T;
}

/**
 * Update the ENS cache with resolution results - DISABLED
 */
export function updateCache(key: string, data: any) {
  // Cache disabled - no operation
  console.log(`Cache disabled - not caching data for ${key}`);
}

/**
 * Mark a failed resolution attempt - DISABLED
 */
export function handleFailedResolution(key: string) {
  console.warn(`Could not resolve for ${key}`);
  return null;
}

/**
 * Check if text records are in the cache - DISABLED
 */
export function checkCacheForTextRecords(key: string): Record<string, string | null> | null {
  // Always return null to force fresh resolution
  return null;
}
