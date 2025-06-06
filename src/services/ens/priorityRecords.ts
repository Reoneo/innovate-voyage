
import { normalize } from 'viem/ens';
import { getRecords, getResolver } from '@ensdomains/ensjs/public';
import { ensClient } from './client';
import { ENSProfile, PRIORITY_RECORDS } from './types';

/**
 * Fast fetch of priority ENS records (GitHub, LinkedIn, Twitter, etc.)
 */
export async function getPriorityENSRecords(ensName: string): Promise<Partial<ENSProfile>> {
  try {
    if (!ensName || (!ensName.endsWith('.eth') && !ensName.endsWith('.box'))) {
      return { socials: {}, textRecords: {} };
    }

    const normalizedName = normalize(ensName);
    
    // Get resolver with timeout
    const resolver = await Promise.race([
      getResolver(ensClient, { name: normalizedName }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Resolver timeout')), 1000))
    ]);

    if (!resolver) {
      return { socials: {}, textRecords: {} };
    }

    // Fetch priority records quickly
    const recordsResult = await Promise.race([
      getRecords(ensClient, {
        name: normalizedName,
        records: {
          texts: PRIORITY_RECORDS,
          coinTypes: [60] // ETH address
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Records timeout')), 1500))
    ]);

    const profile: Partial<ENSProfile> = {
      ensName: normalizedName,
      socials: {},
      textRecords: {}
    };

    if (recordsResult && typeof recordsResult === 'object' && 'texts' in recordsResult && recordsResult.texts) {
      // Process priority text records
      Object.entries(recordsResult.texts).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          profile.textRecords![key] = value;
          
          // Map to social fields immediately
          switch (key) {
            case 'avatar':
              profile.avatar = value;
              break;
            case 'description':
            case 'bio.ens':
              profile.description = value;
              break;
            case 'email':
            case 'mail':
              profile.email = value;
              profile.socials!.email = value;
              break;
            case 'url':
            case 'website':
              profile.website = value;
              profile.socials!.website = value;
              break;
            case 'com.github':
              profile.socials!.github = value;
              break;
            case 'com.twitter':
              profile.socials!.twitter = value;
              break;
            case 'com.linkedin':
              profile.socials!.linkedin = value;
              break;
          }
        }
      });
    }

    // Get address
    if (recordsResult && typeof recordsResult === 'object' && 'addresses' in recordsResult && recordsResult.addresses) {
      const ethAddress = recordsResult.addresses['60'];
      if (ethAddress) {
        profile.address = ethAddress;
      }
    }

    return profile;

  } catch (error) {
    console.error(`Error fetching priority ENS records for ${ensName}:`, error);
    return { socials: {}, textRecords: {} };
  }
}
