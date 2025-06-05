
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { getRecords, getResolver, getName } from '@ensdomains/ensjs/public';
import { addEnsContracts } from '@ensdomains/ensjs';

// Create viem client with ENS contracts
const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://eth-mainnet.g.alchemy.com/v2/demo')
});

// Comprehensive list of ENS text records to fetch
const TEXT_RECORDS = [
  'avatar',
  'description', 
  'display',
  'email',
  'keywords',
  'mail',
  'notice',
  'location',
  'phone',
  'url',
  'com.github',
  'com.peepeth',
  'com.linkedin',
  'com.twitter',
  'io.keybase',
  'org.telegram',
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
  'resume',
  'website'
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
 * Fetch comprehensive ENS profile for a given ENS name
 */
export async function getENSProfile(ensName: string): Promise<ENSProfile | null> {
  try {
    console.log(`Fetching ENS profile for: ${ensName}`);
    
    if (!ensName || (!ensName.endsWith('.eth') && !ensName.endsWith('.box'))) {
      return null;
    }

    const normalizedName = normalize(ensName);
    
    // Get resolver first
    const resolver = await getResolver(client, { name: normalizedName });
    
    if (!resolver) {
      console.log(`No resolver found for ${ensName}`);
      return null;
    }

    // Fetch all records in parallel
    const [recordsResult, addressResult] = await Promise.all([
      getRecords(client, {
        name: normalizedName,
        records: {
          texts: TEXT_RECORDS,
          coinTypes: [60] // ETH address
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

    if (recordsResult?.texts) {
      // Process text records
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

    console.log(`ENS profile fetched for ${ensName}:`, profile);
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
    console.log(`Reverse lookup ENS for address: ${address}`);
    
    if (!address || !address.startsWith('0x')) {
      return null;
    }

    const ensName = await getName(client, { address: address as `0x${string}` });
    
    console.log(`Found ENS name for ${address}: ${ensName}`);
    return ensName || null;

  } catch (error) {
    console.error(`Error in reverse ENS lookup for ${address}:`, error);
    return null;
  }
}
