
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { getEnsText, getEnsAvatar, getEnsAddress, getEnsName } from '@ensdomains/ensjs/public';

// Create a public client for ENS resolution
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc.publicnode.com')
});

// Fetch ENS records direct from ENS API
export const ENS_API_URL = 'https://ens-api.vercel.app';

interface EnsProfile {
  name?: string;
  address?: string;
  avatar?: string;
  description?: string;
  records?: Record<string, string>;
  socials?: Record<string, string>;
}

/**
 * Fetch ENS profile data from official ENS API
 * @param identifier ENS name or address
 */
export async function fetchEnsProfile(identifier: string): Promise<EnsProfile | null> {
  try {
    if (!identifier) return null;
    
    console.log(`Fetching ENS profile for: ${identifier}`);
    
    // Normalize identifier
    const normalizedId = identifier.toLowerCase().trim();
    
    // Create URL for ENS API
    const apiUrl = `${ENS_API_URL}/profile/${normalizedId}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No ENS profile found for ${normalizedId}`);
        return null;
      }
      throw new Error(`ENS API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract social links from records
    const socialLinks: Record<string, string> = {};
    if (data.records) {
      // Process social links
      const recordKeys = Object.keys(data.records);
      for (const key of recordKeys) {
        // Handle known social records
        if (key.startsWith('com.twitter') || key === 'twitter') {
          socialLinks.twitter = data.records[key];
        } else if (key.startsWith('com.github') || key === 'github') {
          socialLinks.github = data.records[key];
        } else if (key.startsWith('com.linkedin') || key === 'linkedin') {
          socialLinks.linkedin = data.records[key];
        } else if (key === 'email') {
          socialLinks.email = data.records[key];
        } else if (key === 'url' || key === 'website') {
          socialLinks.website = data.records[key];
        } else if (key.startsWith('com.discord') || key === 'discord') {
          socialLinks.discord = data.records[key];
        } else if (key.startsWith('org.telegram') || key === 'telegram') {
          socialLinks.telegram = data.records[key];
        } else if (key.includes('instagram')) {
          socialLinks.instagram = data.records[key];
        }
      }
    }

    return {
      name: data.name,
      address: data.address,
      avatar: data.avatar,
      description: data.records?.description || data.records?.['com.discord'],
      records: data.records || {},
      socials: socialLinks
    };
  } catch (error) {
    console.error('Error fetching ENS profile:', error);
    return null;
  }
}

/**
 * Resolve ENS name to address using ensjs directly
 */
export async function resolveEnsName(ensName: string): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Resolving ENS name: ${ensName}`);
    
    // Use ENS.js to resolve the name
    const resolved = await getEnsAddress({
      client: publicClient,
      name: ensName,
    });
    
    return resolved || null;
  } catch (error) {
    console.error(`Error resolving ENS name ${ensName}:`, error);
    return null;
  }
}

/**
 * Reverse resolve address to ENS name using ensjs directly
 */
export async function lookupEnsName(address: string): Promise<string | null> {
  try {
    if (!address) return null;
    
    console.log(`Looking up ENS for address: ${address}`);
    
    // Use ENS.js to lookup the address
    const name = await getEnsName({
      client: publicClient,
      address: address as `0x${string}`,
    });
    
    return name || null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}

/**
 * Get ENS avatar using ensjs directly
 */
export async function getEnsAvatarUrl(ensName: string): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Getting avatar for ENS: ${ensName}`);
    
    // Use ENS.js to get avatar
    const avatar = await getEnsAvatar({
      client: publicClient,
      name: ensName,
    });
    
    return avatar || null;
  } catch (error) {
    console.error(`Error getting avatar for ENS ${ensName}:`, error);
    return null;
  }
}

/**
 * Get specific text record from ENS
 */
export async function getEnsTextRecord(ensName: string, key: string): Promise<string | null> {
  try {
    if (!ensName || !key) return null;
    
    console.log(`Getting ${key} text record for ENS: ${ensName}`);
    
    // Use ENS.js to get text record
    const value = await getEnsText({
      client: publicClient,
      name: ensName,
      key: key,
    });
    
    return value || null;
  } catch (error) {
    console.error(`Error getting ${key} text record for ENS ${ensName}:`, error);
    return null;
  }
}

/**
 * Get multiple text records at once
 */
export async function getEnsTextRecords(
  ensName: string, 
  keys: string[]
): Promise<Record<string, string>> {
  try {
    if (!ensName || !keys.length) return {};
    
    const results: Record<string, string> = {};
    
    // Fetch profile - more efficient than individual calls
    const profile = await fetchEnsProfile(ensName);
    
    if (profile && profile.records) {
      for (const key of keys) {
        if (profile.records[key]) {
          results[key] = profile.records[key];
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error getting text records for ENS ${ensName}:`, error);
    return {};
  }
}

/**
 * Get social links from ENS profile
 */
export async function getEnsSocialLinks(ensName: string): Promise<Record<string, string>> {
  try {
    if (!ensName) return {};
    
    console.log(`Getting social links for ENS: ${ensName}`);
    
    const profile = await fetchEnsProfile(ensName);
    
    if (profile && profile.socials) {
      return profile.socials;
    }
    
    return {};
  } catch (error) {
    console.error(`Error getting social links for ENS ${ensName}:`, error);
    return {};
  }
}
