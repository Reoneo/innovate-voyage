
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { addressCache, domainCache, avatarCache, normalizeIdentity } from '../utils/web3Utils';
import { getRealAvatar } from './avatarService';
import { generateFallbackAvatar } from '../utils/web3Utils';
import { 
  getAddressRecord, 
  getName, 
  getTextRecord, 
  getAvatar
} from '@/utils/ens/ensClient';

// Lookup ENS record by address with ENS.js
export async function getEnsByAddress(address: string): Promise<ENSRecord | null> {
  if (!address) return null;
  
  try {
    // Check if we have this address cached already
    const cachedDomain = domainCache[address.toLowerCase()];
    
    // First try ENS.js to get the primary name
    const nameResult = await getName(address);
    
    if (nameResult && nameResult.name) {
      const ensName = nameResult.name;
      
      // Get avatar
      const avatar = await getAvatar(ensName) || await getRealAvatar(ensName) || generateFallbackAvatar();
      
      // Get social data from text records
      const github = await getTextRecord(ensName, 'com.github');
      const twitter = await getTextRecord(ensName, 'com.twitter');
      const linkedin = await getTextRecord(ensName, 'com.linkedin');
      const email = await getTextRecord(ensName, 'email');
      const url = await getTextRecord(ensName, 'url');
      const description = await getTextRecord(ensName, 'description');
      const location = await getTextRecord(ensName, 'location');
      
      // Create ENS record from data
      const record: ENSRecord = {
        address,
        ensName,
        avatar,
        skills: [], // Will be populated later in the app
        socialProfiles: {
          github: github || '',
          twitter: twitter || '',
          linkedin: linkedin || '',
          website: url || '',
          email: email || '',
          location: location || '',
        },
        description
      };
      
      return record;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ENS for address ${address}:`, error);
    return null;
  }
}

// Reverse lookup address by ENS name
export async function getAddressByEns(ensName: string): Promise<ENSRecord | null> {
  if (!ensName) return null;
  
  try {
    // Normalize the ENS name
    const normalizedEns = normalizeIdentity(ensName);
    
    // Check if we have this domain cached already
    const cachedAddress = addressCache[normalizedEns];
    
    // Use ENS.js to resolve the address
    const address = await getAddressRecord(normalizedEns);
    
    if (address) {
      // Get avatar
      const avatar = await getAvatar(normalizedEns) || await getRealAvatar(normalizedEns) || generateFallbackAvatar();
      
      // Get social data from text records
      const github = await getTextRecord(normalizedEns, 'com.github');
      const twitter = await getTextRecord(normalizedEns, 'com.twitter');
      const linkedin = await getTextRecord(normalizedEns, 'com.linkedin');
      const email = await getTextRecord(normalizedEns, 'email');
      const url = await getTextRecord(normalizedEns, 'url');
      const description = await getTextRecord(normalizedEns, 'description');
      const location = await getTextRecord(normalizedEns, 'location');
      
      // Create ENS record from profile data
      const record: ENSRecord = {
        address,
        ensName: normalizedEns,
        avatar,
        skills: [], // Will be populated later in the app
        socialProfiles: {
          github: github || '',
          twitter: twitter || '',
          linkedin: linkedin || '',
          website: url || '',
          email: email || '',
          location: location || '',
        },
        description
      };
      
      return record;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching address for ENS ${ensName}:`, error);
    return null;
  }
}
