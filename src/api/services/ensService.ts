
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
    const profile = await fetchWeb3BioProfile(ensName);
    if (profile && profile.avatar) {
      avatarCache[ensName] = profile.avatar;
      return profile.avatar;
    }
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
        avatar: profile.avatar || generateFallbackAvatar(),
        skills: [], // Will be populated later in the app
        socialProfiles: {
          twitter: profile.twitter,
          github: profile.github,
          linkedin: profile.linkedin,
          website: profile.website,
          email: profile.email
        }
      };
      
      return record;
    }
    
    // Fallback to mock data if API doesn't return a valid result
    await delay(300); // Simulate network delay
    const mockRecord = mockEnsRecords.find(record => record.address.toLowerCase() === address.toLowerCase());
    
    if (mockRecord && !mockRecord.avatar) {
      // Try to fetch real avatar if not already set
      const avatar = await getRealAvatar(mockRecord.ensName);
      if (avatar) {
        mockRecord.avatar = avatar;
      } else {
        mockRecord.avatar = generateFallbackAvatar();
      }
    }
    
    return mockRecord || null;
  } catch (error) {
    console.error(`Error fetching ENS for address ${address}:`, error);
    
    // Fallback to mock data on error
    await delay(300);
    const mockRecord = mockEnsRecords.find(record => record.address.toLowerCase() === address.toLowerCase());
    return mockRecord || null;
  }
}

// Reverse lookup address by ENS name
export async function getAddressByEns(ensName: string): Promise<ENSRecord | null> {
  try {
    // Handle both .eth and .box domains through web3.bio API
    // Use the direct API path without 'ens/' prefix to work with all domain types
    const profile = await fetchWeb3BioProfile(ensName);
    
    if (profile && profile.address) {
      // Create ENS record from profile data
      const record: ENSRecord = {
        address: profile.address,
        ensName: profile.identity || ensName,
        avatar: profile.avatar || generateFallbackAvatar(),
        skills: [], // Will be populated later in the app
        socialProfiles: {
          twitter: profile.twitter,
          github: profile.github,
          linkedin: profile.linkedin,
          website: profile.website,
          email: profile.email
        }
      };
      
      console.log(`Resolved ${ensName} to address:`, profile.address);
      return record;
    }
    
    // Fallback to mock data if API doesn't return a valid result
    await delay(300); // Simulate network delay
    const mockRecord = mockEnsRecords.find(record => 
      record.ensName.toLowerCase() === ensName.toLowerCase()
    );
    
    if (mockRecord && !mockRecord.avatar) {
      // Try to fetch real avatar if not already set
      const avatar = await getRealAvatar(mockRecord.ensName);
      if (avatar) {
        mockRecord.avatar = avatar;
      } else {
        mockRecord.avatar = generateFallbackAvatar();
      }
    }
    
    return mockRecord || null;
  } catch (error) {
    console.error(`Error fetching address for ENS ${ensName}:`, error);
    
    // Fallback to mock data on error
    await delay(300);
    const mockRecord = mockEnsRecords.find(record => 
      record.ensName.toLowerCase() === ensName.toLowerCase()
    );
    return mockRecord || null;
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
