import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { fetchWeb3BioProfile } from '../utils/web3/index';
import { getRealAvatar } from './avatarService';
import { generateFallbackAvatar } from '../utils/web3/index';

// Lookup ENS record by address
export async function getEnsByAddress(address: string): Promise<ENSRecord | null> {
  try {
    // Try to fetch from web3.bio API first - supports all domain types
    const profiles = await fetchMultiPlatformProfiles(address);
    
    // Find the primary profile - prefer ENS, then other domains
    const primaryProfile = findPrimaryProfile(profiles);
    
    if (primaryProfile) {
      // Create ENS record from profile data
      const record: ENSRecord = {
        address: primaryProfile.address || address,
        ensName: primaryProfile.identity || address,
        avatar: primaryProfile.avatar || await getRealAvatar(primaryProfile.identity) || generateFallbackAvatar(),
        skills: [], // Will be populated later in the app
        socialProfiles: extractSocialProfiles(primaryProfile),
        description: primaryProfile.description || ''
      };
      
      return record;
    }
    
    // No real data found
    await delay(300); // Simulate network delay
    return null;
  } catch (error) {
    console.error(`Error fetching ENS for address ${address}:`, error);
    return null;
  }
}

// Reverse lookup address by ENS name
export async function getAddressByEns(ensName: string): Promise<ENSRecord | null> {
  try {
    // Normalize the input
    const normalizedName = ensName;
    
    // Handle all domain types through web3.bio API
    const profile = await fetchWeb3BioProfile(normalizedName);
    
    if (profile && profile.address) {
      // Create ENS record from profile data
      const record: ENSRecord = {
        address: profile.address,
        ensName: profile.identity || normalizedName,
        avatar: profile.avatar || await getRealAvatar(normalizedName) || generateFallbackAvatar(),
        skills: [], // Will be populated later in the app
        socialProfiles: extractSocialProfiles(profile),
        description: profile.description || ''
      };
      
      return record;
    }
    
    // No data found
    return null;
  } catch (error) {
    console.error(`Error fetching address for ENS ${ensName}:`, error);
    return null;
  }
}

/**
 * Fetch profiles from all platforms for a given address
 */
async function fetchMultiPlatformProfiles(address: string) {
  try {
    // Use the universal endpoint to get all profiles
    const profile = await fetchWeb3BioProfile(address);
    
    if (!profile) {
      return [];
    }
    
    // If we got a single profile object, put it in an array
    if (!Array.isArray(profile)) {
      return [profile];
    }
    
    return profile;
  } catch (error) {
    console.error(`Error fetching multiple platform profiles: ${error}`);
    return [];
  }
}

/**
 * Find the primary profile from a list of profiles
 * Priority: ENS > Basenames > Linea > Lens > Others
 */
function findPrimaryProfile(profiles: any[]) {
  if (profiles.length === 0) return null;
  
  // If there's only one profile, return it
  if (profiles.length === 1) return profiles[0];
  
  // Priority order
  const platformPriority = ['ens', 'basenames', 'linea', 'lens', 'farcaster', 'dotbit', 'unstoppabledomains', 'solana'];
  
  // Try to find profiles in priority order
  for (const platform of platformPriority) {
    const profile = profiles.find(p => p.platform === platform);
    if (profile) return profile;
  }
  
  // If no priority match, return the first one
  return profiles[0];
}

/**
 * Extract social profiles from a web3.bio profile
 */
function extractSocialProfiles(profile: any) {
  const socialProfiles: Record<string, string> = {};
  
  // Direct properties
  if (profile.twitter) socialProfiles.twitter = profile.twitter;
  if (profile.github) socialProfiles.github = profile.github;
  if (profile.linkedin) socialProfiles.linkedin = profile.linkedin;
  if (profile.website) socialProfiles.website = profile.website;
  if (profile.email) socialProfiles.email = profile.email;
  if (profile.facebook) socialProfiles.facebook = profile.facebook;
  if (profile.whatsapp) socialProfiles.whatsapp = profile.whatsapp;
  if (profile.bluesky) socialProfiles.bluesky = profile.bluesky;
  if (profile.instagram) socialProfiles.instagram = profile.instagram;
  if (profile.youtube) socialProfiles.youtube = profile.youtube;
  if (profile.telegram) socialProfiles.telegram = profile.telegram;
  if (profile.reddit) socialProfiles.reddit = profile.reddit;
  if (profile.discord) socialProfiles.discord = profile.discord;
  if (profile.location) socialProfiles.location = profile.location;
  
  // Links object
  if (profile.links) {
    Object.entries(profile.links).forEach(([key, value]: [string, any]) => {
      if (value && value.link) {
        socialProfiles[key] = value.link;
      }
    });
  }
  
  return socialProfiles;
}
