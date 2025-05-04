
import { ENS_API_URL } from '../client/publicClient';
import { EnsProfile } from '../types/ensTypes';

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
    console.log(`Calling ENS API: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No ENS profile found for ${normalizedId}`);
        return null;
      }
      throw new Error(`ENS API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`ENS API result for ${normalizedId}:`, data);
    
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
        } else if (key.includes('youtube')) {
          socialLinks.youtube = data.records[key];
        } else if (key.includes('facebook')) {
          socialLinks.facebook = data.records[key];
        } else if (key.includes('whatsapp')) {
          socialLinks.whatsapp = data.records[key];
        } else if (key.includes('bluesky')) {
          socialLinks.bluesky = data.records[key];
        }
      }
    }

    return {
      name: data.name,
      address: data.address,
      avatar: data.avatar || null,
      description: data.records?.description || data.records?.['com.discord'] || null,
      records: data.records || {},
      socials: socialLinks
    };
  } catch (error) {
    console.error('Error fetching ENS profile:', error);
    return null;
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
