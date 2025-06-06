
import { normalize } from 'viem/ens';
import { getRecords, getResolver } from '@ensdomains/ensjs/public';
import { ensClient } from './client';
import { ENSProfile, ALL_TEXT_RECORDS } from './types';

/**
 * Fetch comprehensive ENS profile (slower, for complete data)
 */
export async function getENSProfile(ensName: string): Promise<ENSProfile | null> {
  try {
    if (!ensName || (!ensName.endsWith('.eth') && !ensName.endsWith('.box'))) {
      return null;
    }

    const normalizedName = normalize(ensName);
    
    const resolver = await getResolver(ensClient, { name: normalizedName });
    
    if (!resolver) {
      return null;
    }

    // Fetch all records
    const [recordsResult, addressResult] = await Promise.all([
      getRecords(ensClient, {
        name: normalizedName,
        records: {
          texts: ALL_TEXT_RECORDS,
          coinTypes: [60]
        }
      }).catch(() => null),
      ensClient.getEnsAddress({ name: normalizedName }).catch(() => null)
    ]);

    const profile: ENSProfile = {
      ensName: normalizedName,
      address: addressResult || undefined,
      socials: {},
      textRecords: {}
    };

    if (recordsResult && typeof recordsResult === 'object' && 'texts' in recordsResult && recordsResult.texts) {
      // Process all text records
      Object.entries(recordsResult.texts).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          profile.textRecords[key] = value;
          
          // Map to common social fields
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
              profile.socials.email = value;
              break;
            case 'url':
            case 'website':
              profile.website = value;
              profile.socials.website = value;
              break;
            case 'com.github':
              profile.socials.github = value;
              break;
            case 'com.twitter':
              profile.socials.twitter = value;
              break;
            case 'com.linkedin':
              profile.socials.linkedin = value;
              break;
            case 'com.discord':
            case 'com.discord.ens':
              profile.socials.discord = value;
              break;
            case 'org.telegram':
              profile.socials.telegram = value;
              break;
            case 'com.reddit':
              profile.socials.reddit = value;
              break;
            case 'com.youtube':
              profile.socials.youtube = value;
              break;
            case 'com.instagram':
              profile.socials.instagram = value;
              break;
            case 'com.facebook':
              profile.socials.facebook = value;
              break;
            case 'xyz.farcaster':
              profile.socials.farcaster = value;
              break;
            case 'app.bsky.ens':
              profile.socials.bluesky = value;
              break;
            case 'com.whatsapp.ens':
              profile.socials.whatsapp = value;
              break;
            case 'location':
            case 'location.ens':
              profile.socials.location = value;
              break;
            case 'portfolio':
              profile.socials.portfolio = value;
              break;
            case 'resume':
              profile.socials.resume = value;
              break;
          }
        }
      });
    }

    return profile;

  } catch (error) {
    console.error(`Error fetching ENS profile for ${ensName}:`, error);
    return null;
  }
}
