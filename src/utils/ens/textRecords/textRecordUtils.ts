
import { mainnetProvider } from '../../ethereumProviders';
import { TextRecord } from '../resolution/types';

/**
 * Get common ENS text record keys
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
 * Get all available ENS text record keys for a name
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

/**
 * Extract social media links from text records
 */
export function extractSocialsFromTextRecords(textRecords?: Record<string, string | null>): Record<string, string> {
  if (!textRecords) return {};
  
  const socials: Record<string, string> = {};
  
  // Map common ENS text records to social platform keys
  if (textRecords['com.twitter']) socials.twitter = textRecords['com.twitter'];
  if (textRecords['com.github']) socials.github = textRecords['com.github'];
  if (textRecords['com.discord']) socials.discord = textRecords['com.discord'];
  if (textRecords['org.telegram']) socials.telegram = textRecords['org.telegram'];
  if (textRecords['com.reddit']) socials.reddit = textRecords['com.reddit'];
  if (textRecords['email']) socials.email = textRecords['email'];
  if (textRecords['url']) socials.website = textRecords['url'];
  
  return socials;
}
