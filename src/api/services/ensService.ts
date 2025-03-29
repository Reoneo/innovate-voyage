
import { ENSRecord } from '../types/web3Types';
import { mockEnsRecords } from '../data/mockWeb3Data';
import { avatarCache, fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';
import { delay } from '../jobsApi';

// Get real avatar for an ENS name
export async function getRealAvatar(ensName: string): Promise<string | null> {
  // Check cache first
  if (avatarCache[ensName]) {
    return avatarCache[ensName];
  }
  
  // If not in cache, fetch from API
  try {
    // Try Web3Bio API first
    const profile = await fetchWeb3BioProfile(ensName);
    if (profile && profile.avatar) {
      avatarCache[ensName] = profile.avatar;
      return profile.avatar;
    }
    
    // Generate a fallback avatar for all domains
    const randomSeed = ensName.split('.')[0].length * 3 + 10;
    const avatarUrl = `https://i.pravatar.cc/300?img=${randomSeed}`;
    avatarCache[ensName] = avatarUrl;
    return avatarUrl;
  } catch (error) {
    console.error(`Error fetching avatar for ${ensName}:`, error);
  }
  
  return null;
}

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

// Get all available ENS records (for demo purposes)
export async function getAllEnsRecords(): Promise<ENSRecord[]> {
  await delay(400);
  
  // Make sure all records have avatars
  await Promise.all(
    mockEnsRecords.map(async (record) => {
      if (!record.avatar) {
        // Try to fetch real avatar for this ENS
        try {
          const profile = await fetchWeb3BioProfile(record.ensName);
          if (profile && profile.avatar) {
            record.avatar = profile.avatar;
          } else {
            record.avatar = generateFallbackAvatar();
          }
        } catch (error) {
          record.avatar = generateFallbackAvatar();
        }
      }
    })
  );
  
  return [...mockEnsRecords];
}

// Fetch all ENS domains associated with an address
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    // In a real implementation, we would query an ENS indexer or the ENS graph API
    // For now, we'll only use real data from web3.bio API
    
    await delay(500); // Simulate API delay
    
    // Try to get real domains from web3.bio API
    const profile = await fetchWeb3BioProfile(address);
    let domains: string[] = [];
    
    if (profile && profile.identity) {
      if (profile.identity.includes('.eth')) {
        domains.push(profile.identity);
      }
      
      // Add .box domains if applicable, treating them as mainnet domains
      if (profile.identity.includes('.box')) {
        domains.push(profile.identity);
      }
    }
    
    // Do not add mock domains
    
    return domains;
  } catch (error) {
    console.error(`Error fetching ENS domains for address ${address}:`, error);
    return [];
  }
}
