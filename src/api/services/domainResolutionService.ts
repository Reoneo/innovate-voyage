
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { getRealAvatar } from './avatarService';
import { generateFallbackAvatar } from '../utils/web3/index';

// ENS API base URL - you can change this to your self-hosted instance
const ENS_API_BASE = 'https://ens-api.vercel.app';

// Lookup ENS record by address using ENS API
export async function getEnsByAddress(address: string): Promise<ENSRecord | null> {
  try {
    console.log(`Fetching ENS data for address: ${address}`);
    
    const response = await fetch(`${ENS_API_BASE}/address/${address}?texts=description,email,url,com.github,com.twitter,com.discord,com.linkedin,org.telegram,com.reddit,location,com.instagram,com.youtube,app.bsky,com.whatsapp,keywords`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.log(`ENS API returned status ${response.status} for address ${address}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data || !data.name) {
      console.log(`No ENS name found for address ${address}`);
      return null;
    }
    
    // Get avatar using the ENS API avatar endpoint
    const avatarUrl = await getEnsApiAvatar(data.name);
    
    // Create ENS record from API data
    const record: ENSRecord = {
      address: data.address || address,
      ensName: data.name,
      avatar: avatarUrl || generateFallbackAvatar(),
      skills: [], // Will be populated later in the app
      socialProfiles: extractSocialProfilesFromEnsApi(data.texts || {}),
      description: data.texts?.description || ''
    };
    
    console.log(`ENS API result for ${address}:`, record);
    return record;
  } catch (error) {
    console.error(`Error fetching ENS for address ${address}:`, error);
    return null;
  }
}

// Reverse lookup address by ENS name using ENS API
export async function getAddressByEns(ensName: string): Promise<ENSRecord | null> {
  try {
    console.log(`Fetching address for ENS name: ${ensName}`);
    
    const response = await fetch(`${ENS_API_BASE}/name/${ensName}?texts=description,email,url,com.github,com.twitter,com.discord,com.linkedin,org.telegram,com.reddit,location,com.instagram,com.youtube,app.bsky,com.whatsapp,keywords`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.log(`ENS API returned status ${response.status} for ENS name ${ensName}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data || !data.address) {
      console.log(`No address found for ENS name ${ensName}`);
      return null;
    }
    
    // Get avatar using the ENS API avatar endpoint
    const avatarUrl = await getEnsApiAvatar(ensName);
    
    // Create ENS record from API data
    const record: ENSRecord = {
      address: data.address,
      ensName: data.name || ensName,
      avatar: avatarUrl || generateFallbackAvatar(),
      skills: [], // Will be populated later in the app
      socialProfiles: extractSocialProfilesFromEnsApi(data.texts || {}),
      description: data.texts?.description || ''
    };
    
    console.log(`ENS API result for ${ensName}:`, record);
    return record;
  } catch (error) {
    console.error(`Error fetching address for ENS ${ensName}:`, error);
    return null;
  }
}

/**
 * Get avatar from ENS API
 */
async function getEnsApiAvatar(ensName: string): Promise<string | null> {
  try {
    const avatarUrl = `${ENS_API_BASE}/avatar/${ensName}`;
    const response = await fetch(avatarUrl, { method: 'HEAD' });
    
    if (response.ok) {
      console.log(`Found avatar via ENS API for ${ensName}`);
      return avatarUrl;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching avatar from ENS API for ${ensName}:`, error);
    return null;
  }
}

/**
 * Extract social profiles from ENS API text records
 */
function extractSocialProfilesFromEnsApi(texts: Record<string, string>) {
  const socialProfiles: Record<string, string> = {};
  
  // Map ENS text record keys to our social profile keys
  const keyMapping: Record<string, string> = {
    'com.twitter': 'twitter',
    'com.github': 'github',
    'com.linkedin': 'linkedin',
    'url': 'website',
    'email': 'email',
    'com.discord': 'discord',
    'org.telegram': 'telegram',
    'com.reddit': 'reddit',
    'location': 'location',
    'com.instagram': 'instagram',
    'com.youtube': 'youtube',
    'app.bsky': 'bluesky',
    'com.whatsapp': 'whatsapp'
  };
  
  Object.entries(texts).forEach(([key, value]) => {
    if (value && keyMapping[key]) {
      socialProfiles[keyMapping[key]] = value;
    }
  });
  
  return socialProfiles;
}
