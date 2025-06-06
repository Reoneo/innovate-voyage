
import { getTextRecord } from '@ensdomains/ensjs/public';
import { ensClient, fallbackClients } from './client';
import { ALL_TEXT_RECORDS, PRIORITY_RECORDS, RECORD_TO_PLATFORM_MAP } from './types';
import type { ENSTextRecord, ENSProfile } from './types';

/**
 * Fast batch fetch of priority ENS text records (GitHub, Twitter, LinkedIn)
 */
export async function fetchPriorityRecords(ensName: string): Promise<Partial<ENSProfile>> {
  try {
    console.log(`Fetching priority records for ${ensName}`);
    
    const priorityPromises = PRIORITY_RECORDS.map(async (key) => {
      try {
        const value = await Promise.race([
          getTextRecord(ensClient, { name: ensName, key }),
          new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          )
        ]);
        return { key, value: value || null };
      } catch (error) {
        console.warn(`Failed to fetch ${key} for ${ensName}:`, error);
        return { key, value: null };
      }
    });

    const results = await Promise.allSettled(priorityPromises);
    
    const profile: Partial<ENSProfile> = {
      socials: {},
      textRecords: {}
    };

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.value) {
        const { key, value } = result.value;
        
        // Store in textRecords
        profile.textRecords![key] = value;
        
        // Map to social platforms
        const platform = RECORD_TO_PLATFORM_MAP[key];
        if (platform && value) {
          profile.socials![platform] = value;
        }
        
        // Handle special cases
        if (key === 'avatar') profile.avatar = value;
        if (key === 'description') profile.description = value;
        if (key === 'email') profile.email = value;
        if (key === 'url' || key === 'website') profile.website = value;
      }
    });

    console.log(`Priority records fetched for ${ensName}:`, profile);
    return profile;
    
  } catch (error) {
    console.error(`Error fetching priority records for ${ensName}:`, error);
    return { socials: {}, textRecords: {} };
  }
}

/**
 * Comprehensive fetch of all ENS text records with fallback support
 */
export async function fetchAllTextRecords(ensName: string): Promise<ENSProfile> {
  try {
    console.log(`Fetching all records for ${ensName}`);
    
    const profile: ENSProfile = {
      ensName,
      socials: {},
      textRecords: {}
    };

    // Try main client first, then fallbacks
    const clients = [ensClient, ...fallbackClients];
    let successfulClient = null;

    for (const client of clients) {
      try {
        const recordPromises = ALL_TEXT_RECORDS.map(async (key) => {
          try {
            const value = await Promise.race([
              getTextRecord(client, { name: ensName, key }),
              new Promise<null>((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 3000)
              )
            ]);
            return { key, value: value || null };
          } catch {
            return { key, value: null };
          }
        });

        const results = await Promise.allSettled(recordPromises);
        
        // Process successful results
        let successCount = 0;
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.value) {
            const { key, value } = result.value;
            successCount++;
            
            // Store in textRecords
            profile.textRecords[key] = value;
            
            // Map to social platforms
            const platform = RECORD_TO_PLATFORM_MAP[key];
            if (platform && value) {
              profile.socials[platform] = value;
            }
            
            // Handle special profile fields
            if (key === 'avatar') profile.avatar = value;
            if (key === 'description') profile.description = value;
            if (key === 'email') profile.email = value;
            if (key === 'url' || key === 'website') profile.website = value;
          }
        });

        if (successCount > 0) {
          successfulClient = client;
          break;
        }
        
      } catch (error) {
        console.warn(`Client failed for ${ensName}, trying next...`, error);
        continue;
      }
    }

    console.log(`All records fetched for ${ensName}:`, profile);
    return profile;
    
  } catch (error) {
    console.error(`Error fetching all records for ${ensName}:`, error);
    return {
      ensName,
      socials: {},
      textRecords: {}
    };
  }
}

/**
 * Optimized batch fetch using multicall for better performance
 */
export async function fetchRecordsBatch(ensName: string, keys: readonly string[]): Promise<ENSTextRecord[]> {
  try {
    // Use Promise.allSettled for better error handling
    const promises = keys.map(async (key) => {
      try {
        const value = await getTextRecord(ensClient, { name: ensName, key });
        return { key, value: value || null };
      } catch (error) {
        console.warn(`Failed to fetch ${key}:`, error);
        return { key, value: null };
      }
    });

    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<ENSTextRecord> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
      .filter(record => record.value !== null);
      
  } catch (error) {
    console.error(`Batch fetch error for ${ensName}:`, error);
    return [];
  }
}
