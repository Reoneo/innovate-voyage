
import { getTextRecord } from '@ensdomains/ensjs/public';
import { ensClient, fallbackEnsClient } from './client';

// All ENS text records we want to fetch
const ENS_TEXT_RECORDS = [
  'avatar',
  'description', 
  'email',
  'url',
  'github',
  'twitter',
  'linkedin',
  'discord',
  'telegram',
  'instagram',
  'youtube',
  'facebook',
  'xyz.farcaster', // Farcaster handle
  'com.github',
  'com.twitter',
  'com.discord',
  'com.linkedin'
] as const;

export type ENSTextRecordKey = typeof ENS_TEXT_RECORDS[number];

export interface ENSTextRecords {
  [key: string]: string | null;
}

export interface ENSSocialData {
  socials: Record<string, string>;
  farcasterHandle: string | null;
  avatar: string | null;
  description: string | null;
  email: string | null;
  website: string | null;
}

/**
 * Fetch all ENS text records for a domain using ENS.js
 */
export async function fetchAllENSTextRecords(ensName: string): Promise<ENSTextRecords> {
  console.log(`Fetching all ENS text records for: ${ensName}`);
  
  const records: ENSTextRecords = {};
  
  try {
    // Fetch all records in parallel with timeout
    const recordPromises = ENS_TEXT_RECORDS.map(async (key) => {
      try {
        const value = await Promise.race([
          getTextRecord(ensClient, { name: ensName, key }),
          new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          )
        ]);
        return { key, value: value || null };
      } catch (error) {
        console.warn(`Failed to fetch ${key} for ${ensName}:`, error);
        // Try fallback client
        try {
          const fallbackValue = await Promise.race([
            getTextRecord(fallbackEnsClient, { name: ensName, key }),
            new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 2000)
            )
          ]);
          return { key, value: fallbackValue || null };
        } catch (fallbackError) {
          console.warn(`Fallback also failed for ${key}:`, fallbackError);
          return { key, value: null };
        }
      }
    });

    const results = await Promise.allSettled(recordPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.value) {
        records[result.value.key] = result.value.value;
      }
    });

    console.log(`ENS records fetched for ${ensName}:`, records);
    return records;
    
  } catch (error) {
    console.error(`Error fetching ENS records for ${ensName}:`, error);
    return {};
  }
}

/**
 * Process ENS text records into structured social data
 */
export function processENSTextRecords(records: ENSTextRecords): ENSSocialData {
  const socials: Record<string, string> = {};
  
  // Map ENS records to social platforms
  const recordMapping: Record<string, string> = {
    'github': 'github',
    'com.github': 'github',
    'twitter': 'twitter', 
    'com.twitter': 'twitter',
    'linkedin': 'linkedin',
    'com.linkedin': 'linkedin',
    'discord': 'discord',
    'com.discord': 'discord',
    'telegram': 'telegram',
    'instagram': 'instagram',
    'youtube': 'youtube',
    'facebook': 'facebook'
  };

  // Process social links
  Object.entries(records).forEach(([key, value]) => {
    if (value && recordMapping[key]) {
      const platform = recordMapping[key];
      if (!socials[platform]) { // Don't override if already set
        socials[platform] = value;
      }
    }
  });

  return {
    socials,
    farcasterHandle: records['xyz.farcaster'] || null,
    avatar: records['avatar'] || null,
    description: records['description'] || null,
    email: records['email'] || null,
    website: records['url'] || null
  };
}

/**
 * Main function to get complete ENS data
 */
export async function getCompleteENSData(ensName: string): Promise<ENSSocialData> {
  const records = await fetchAllENSTextRecords(ensName);
  return processENSTextRecords(records);
}
