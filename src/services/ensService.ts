
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { getRecords, getResolver, getName } from '@ensdomains/ensjs/public';
import { addEnsContracts } from '@ensdomains/ensjs';

// Create viem client with ENS contracts - simplified configuration
const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://eth-mainnet.g.alchemy.com/v2/demo')
});

// Priority ENS text records for fast loading of social links
const PRIORITY_RECORDS = [
  'com.github',
  'com.twitter', 
  'com.linkedin',
  'avatar',
  'description',
  'email',
  'url',
  'website'
];

// Comprehensive list of ENS text records
const ALL_TEXT_RECORDS = [
  ...PRIORITY_RECORDS,
  'display',
  'keywords',
  'mail',
  'notice',
  'location',
  'phone',
  'com.peepeth',
  'com.discord',
  'com.reddit',
  'com.youtube',
  'com.instagram',
  'com.facebook',
  'com.twitch',
  'com.medium',
  'com.substack',
  'xyz.farcaster',
  'app.bsky.ens',
  'bio.ens',
  'com.whatsapp.ens',
  'com.discord.ens',
  'location.ens',
  'keywords.ens',
  'portfolio',
  'resume'
];

export interface ENSProfile {
  address?: string;
  ensName?: string;
  avatar?: string;
  description?: string;
  email?: string;
  website?: string;
  socials: Record<string, string>;
  textRecords: Record<string, string>;
}

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
      getResolver(client, { name: normalizedName }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Resolver timeout')), 1000))
    ]);

    if (!resolver) {
      return { socials: {}, textRecords: {} };
    }

    // Fetch priority records quickly
    const recordsResult = await Promise.race([
      getRecords(client, {
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

/**
 * Fetch comprehensive ENS profile (slower, for complete data)
 */
export async function getENSProfile(ensName: string): Promise<ENSProfile | null> {
  try {
    if (!ensName || (!ensName.endsWith('.eth') && !ensName.endsWith('.box'))) {
      return null;
    }

    const normalizedName = normalize(ensName);
    
    const resolver = await getResolver(client, { name: normalizedName });
    
    if (!resolver) {
      return null;
    }

    // Fetch all records
    const [recordsResult, addressResult] = await Promise.all([
      getRecords(client, {
        name: normalizedName,
        records: {
          texts: ALL_TEXT_RECORDS,
          coinTypes: [60]
        }
      }).catch(() => null),
      client.getEnsAddress({ name: normalizedName }).catch(() => null)
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

/**
 * Reverse lookup: get ENS name for an address
 */
export async function getENSNameByAddress(address: string): Promise<string | null> {
  try {
    if (!address || !address.startsWith('0x')) {
      return null;
    }

    const ensName = await getName(client, { address: address as `0x${string}` });
    
    return ensName || null;

  } catch (error) {
    console.error(`Error in reverse ENS lookup for ${address}:`, error);
    return null;
  }
}
