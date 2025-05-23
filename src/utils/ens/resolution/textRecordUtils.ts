
/**
 * Text record utilities for ENS resolution
 */
import { mainnetProvider } from '../../ethereumProviders';
import { TextRecord } from './types';

/**
 * Get common ENS text record keys
 */
export async function getAllEnsTextKeys(name: string): Promise<string[]> {
  try {
    const resolver = await mainnetProvider.getResolver(name);
    if (!resolver) return getCommonTextKeys();
    
    // ENS doesn't provide a "listKeys" method, so we use a predefined list
    return getCommonTextKeys();
  } catch (error) {
    console.warn(`Error getting text keys for ${name}:`, error);
    return getCommonTextKeys();
  }
}

/**
 * Return a list of common ENS text record keys
 */
export function getCommonTextKeys(): string[] {
  return [
    "avatar",
    "avatar.ens",
    "description",
    "url",
    "com.twitter",
    "com.github",
    "com.discord",
    "org.telegram",
    "email",
    "notice",
    "keywords",
    "name",
    "location",
    "com.reddit",
    "eth.ens.delegate"
  ];
}

/**
 * Fetch text records for an ENS name
 */
export async function fetchTextRecords(
  name: string, 
  resolver: any
): Promise<Record<string, string | null>> {
  if (!resolver) return {};
  
  try {
    const textKeys = await getAllEnsTextKeys(name);
    
    // Fetch all text records in parallel
    const textResults: TextRecord[] = await Promise.all(
      textKeys.map(async key => ({
        key,
        value: await resolver.getText(key).catch(() => null)
      }))
    );
    
    // Filter out null records and convert to object
    return Object.fromEntries(
      textResults
        .filter(record => record.value !== null)
        .map(record => [record.key, record.value])
    );
  } catch (error) {
    console.warn(`Error fetching text records for ${name}:`, error);
    return {};
  }
}
