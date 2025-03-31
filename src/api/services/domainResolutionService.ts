
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { fetchWeb3BioProfile, addressCache, domainCache, avatarCache, normalizeIdentity } from '../utils/web3Utils';
import { getRealAvatar } from './avatarService';
import { generateFallbackAvatar } from '../utils/web3Utils';

// Lookup ENS record by address with improved caching and error handling
export async function getEnsByAddress(address: string): Promise<ENSRecord | null> {
  if (!address) return null;
  
  try {
    // Check if we have this address cached already
    const cachedDomain = domainCache[address.toLowerCase()];
    let profile = null;
    
    if (cachedDomain) {
      // Use the cached domain to get full profile
      profile = await fetchWeb3BioProfile(cachedDomain);
    }
    
    // If no cache hit or cached domain didn't resolve, fetch fresh
    if (!profile) {
      profile = await fetchWeb3BioProfile(address);
    }
    
    if (profile && profile.identity && (profile.identity.includes('.eth') || profile.identity.includes('.box'))) {
      // Create ENS record from profile data
      const record: ENSRecord = {
        address: profile.address,
        ensName: profile.identity,
        avatar: profile.avatar || await getRealAvatar(profile.identity) || generateFallbackAvatar(),
        skills: [], // Will be populated later in the app
        socialProfiles: {
          twitter: profile.twitter,
          github: profile.github,
          linkedin: profile.linkedin,
          website: profile.website,
          email: profile.email,
          facebook: profile.facebook,
          whatsapp: profile.whatsapp,
          bluesky: profile.bluesky,
          instagram: profile.instagram,
          youtube: profile.youtube,
          telegram: profile.telegram,
          reddit: profile.reddit,
          discord: profile.discord,
          messenger: profile.messenger,
          telephone: profile.telephone || profile.whatsapp, // Use WhatsApp as fallback phone
          location: profile.location
        },
        description: profile.description
      };
      
      return record;
    }
    
    // No real data found
    return null;
  } catch (error) {
    console.error(`Error fetching ENS for address ${address}:`, error);
    return null;
  }
}

// Reverse lookup address by ENS name with improved validation and normalization
export async function getAddressByEns(ensName: string): Promise<ENSRecord | null> {
  if (!ensName) return null;
  
  try {
    // Normalize the ENS name
    const normalizedEns = normalizeIdentity(ensName);
    
    // Check if we have this domain cached already
    const cachedAddress = addressCache[normalizedEns];
    let profile = null;
    
    if (cachedAddress) {
      // Double check that the cached address resolves correctly
      profile = await fetchWeb3BioProfile(normalizedEns);
      
      // If cache is invalid, clear it
      if (!profile || profile.address !== cachedAddress) {
        delete addressCache[normalizedEns];
      }
    }
    
    // If no cache hit or cache invalid, fetch fresh
    if (!profile) {
      profile = await fetchWeb3BioProfile(normalizedEns);
    }
    
    if (profile && profile.address) {
      // Create ENS record from profile data
      const record: ENSRecord = {
        address: profile.address,
        ensName: profile.identity || normalizedEns,
        avatar: profile.avatar || await getRealAvatar(normalizedEns) || generateFallbackAvatar(),
        skills: [], // Will be populated later in the app
        socialProfiles: {
          twitter: profile.twitter,
          github: profile.github,
          linkedin: profile.linkedin,
          website: profile.website,
          email: profile.email,
          facebook: profile.facebook,
          whatsapp: profile.whatsapp,
          bluesky: profile.bluesky,
          instagram: profile.instagram,
          youtube: profile.youtube,
          telegram: profile.telegram,
          reddit: profile.reddit,
          discord: profile.discord,
          messenger: profile.messenger,
          telephone: profile.telephone || profile.whatsapp, // Use WhatsApp as fallback phone
          location: profile.location
        },
        description: profile.description
      };
      
      return record;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching address for ENS ${ensName}:`, error);
    return null;
  }
}
