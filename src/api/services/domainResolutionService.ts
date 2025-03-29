
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { fetchWeb3BioProfile } from '../utils/web3Utils';
import { getRealAvatar } from './avatarService';
import { generateFallbackAvatar } from '../utils/web3Utils';

// Lookup ENS record by address
export async function getEnsByAddress(address: string): Promise<ENSRecord | null> {
  try {
    // Try to fetch from web3.bio API first
    const profile = await fetchWeb3BioProfile(address);
    
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
          messenger: profile.messenger
        }
      };
      
      return record;
    }
    
    // Don't fallback to mock data, just return null if no real data found
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
    // Treat all domains (.eth and .box) as mainnet domains
    // Try to fetch from web3.bio API first
    const profile = await fetchWeb3BioProfile(ensName);
    
    if (profile && profile.address) {
      // Create ENS record from profile data
      const record: ENSRecord = {
        address: profile.address,
        ensName: profile.identity || ensName,
        avatar: profile.avatar || await getRealAvatar(ensName) || generateFallbackAvatar(),
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
          messenger: profile.messenger
        }
      };
      
      return record;
    }
    
    // For .box domains, use the same handling as .eth domains (mainnet)
    if (ensName.includes('.box')) {
      console.log(`Resolving .box domain: ${ensName} using Ethereum Mainnet`);
      
      // We should not generate mock data for .box domains
      // Return null to indicate no data was found
      return null;
    }
    
    // Don't fallback to mock data, just return null
    return null;
  } catch (error) {
    console.error(`Error fetching address for ENS ${ensName}:`, error);
    return null;
  }
}
