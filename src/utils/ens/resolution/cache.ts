
// ENS resolution caching utilities
import { getFromEnsCache, addToEnsCache, markFailedResolution } from '../../ethereumProviders';

/**
 * Check if an ENS name or address is in the cache
 */
export function checkCache<T extends string | null>(
  key: string, 
  resultType: 'address' | 'ensName'
): T {
  if (!key) return null as T;
  
  const cachedResult = getFromEnsCache(key);
  if (cachedResult && cachedResult[resultType]) {
    console.log(`Using cached ENS ${resultType} for ${key}`);
    return cachedResult[resultType] as T;
  }

  // Handle too many failed attempts
  if (cachedResult && cachedResult.attempts && cachedResult.attempts > 3) {
    console.log(`Skipping resolution for ${key} after ${cachedResult.attempts} failed attempts`);
    return null as T;
  }
  
  return null as T;
}

/**
 * Update the ENS cache with resolution results
 */
export function updateCache(key: string, data: any) {
  addToEnsCache(key, data);
  
  // Cache in reverse direction if we have both ENS and address
  if (data.address && data.ensName) {
    const addressKey = data.address.toLowerCase();
    const ensKey = data.ensName.toLowerCase();
    
    // Cache address -> ENS
    if (key !== addressKey) {
      addToEnsCache(addressKey, data);
    }
    
    // Cache ENS -> address
    if (key !== ensKey) {
      addToEnsCache(ensKey, data);
    }
  }
}

/**
 * Mark a failed resolution attempt
 */
export function handleFailedResolution(key: string) {
  console.warn(`Could not resolve for ${key}`);
  markFailedResolution(key);
  return null;
}
