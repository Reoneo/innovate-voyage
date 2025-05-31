
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { ensClient } from '@/utils/ens/ensClient';
import { getRealAvatar } from './avatarService';
import { generateFallbackAvatar } from '../utils/web3/index';

// Lookup ENS record by address
export async function getEnsByAddress(address: string): Promise<ENSRecord | null> {
  try {
    // Try reverse resolution with ENS client
    const nameRecord = await ensClient.getName({ address: address as `0x${string}` });
    
    if (nameRecord) {
      const ensName = nameRecord;
      
      // Get additional records
      const [avatar, description] = await Promise.all([
        ensClient.getTextRecord({ name: ensName, key: 'avatar' }).catch(() => null),
        ensClient.getTextRecord({ name: ensName, key: 'description' }).catch(() => null),
      ]);

      const record: ENSRecord = {
        address,
        ensName,
        avatar: avatar || await getRealAvatar(ensName) || generateFallbackAvatar(),
        skills: [],
        socialProfiles: {},
        description: description || ''
      };
      
      return record;
    }
    
    await delay(300);
    return null;
  } catch (error) {
    console.error(`Error fetching ENS for address ${address}:`, error);
    return null;
  }
}

// Reverse lookup address by ENS name
export async function getAddressByEns(ensName: string): Promise<ENSRecord | null> {
  try {
    const addressRecord = await ensClient.getAddressRecord({ name: ensName });
    
    if (addressRecord) {
      const address = addressRecord;
      
      // Get additional records
      const [avatar, description] = await Promise.all([
        ensClient.getTextRecord({ name: ensName, key: 'avatar' }).catch(() => null),
        ensClient.getTextRecord({ name: ensName, key: 'description' }).catch(() => null),
      ]);

      const record: ENSRecord = {
        address,
        ensName,
        avatar: avatar || await getRealAvatar(ensName) || generateFallbackAvatar(),
        skills: [],
        socialProfiles: {},
        description: description || ''
      };
      
      return record;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching address for ENS ${ensName}:`, error);
    return null;
  }
}
