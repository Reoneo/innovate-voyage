
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
  await delay(300); // Simulate network delay
  const record = mockEnsRecords.find(record => record.address.toLowerCase() === address.toLowerCase());
  
  if (record && !record.avatar) {
    // Try to fetch real avatar if not already set
    const avatar = await getRealAvatar(record.ensName);
    if (avatar) {
      record.avatar = avatar;
    } else {
      record.avatar = generateFallbackAvatar();
    }
  }
  
  return record || null;
}

// Reverse lookup address by ENS name
export async function getAddressByEns(ensName: string): Promise<ENSRecord | null> {
  await delay(300); // Simulate network delay
  const record = mockEnsRecords.find(record => record.ensName.toLowerCase() === ensName.toLowerCase());
  
  if (record && !record.avatar) {
    // Try to fetch real avatar if not already set
    const avatar = await getRealAvatar(record.ensName);
    if (avatar) {
      record.avatar = avatar;
    } else {
      record.avatar = generateFallbackAvatar();
    }
  }
  
  return record || null;
}

// Get all available ENS records (for demo purposes)
export async function getAllEnsRecords(): Promise<ENSRecord[]> {
  await delay(400);
  
  // Make sure all records have avatars
  await Promise.all(
    mockEnsRecords.map(async (record) => {
      if (!record.avatar) {
        const avatar = await getRealAvatar(record.ensName);
        if (avatar) {
          record.avatar = avatar;
        } else {
          record.avatar = generateFallbackAvatar();
        }
      }
    })
  );
  
  return [...mockEnsRecords];
}
