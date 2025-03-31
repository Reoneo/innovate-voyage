
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { mockEnsRecords } from '../data/mockWeb3Data';
import { fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';

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
    await delay(500); // Simulate API delay
    
    // Try to get real domains from web3.bio API
    const profile = await fetchWeb3BioProfile(address);
    let domains: string[] = [];
    
    if (profile && profile.identity) {
      if (profile.identity.includes('.eth') || profile.identity.includes('.box')) {
        domains.push(profile.identity);
      }
      
      // Try to get all domains for this address by checking mock data
      // This simulates having access to an ENS indexer in a real app
      const mockRecords = await getAllEnsRecords();
      const additionalDomains = mockRecords
        .filter(record => record.address.toLowerCase() === address.toLowerCase())
        .filter(record => record.ensName !== profile.identity) // Filter out the main identity
        .map(record => record.ensName);
      
      domains = [...domains, ...additionalDomains];
    }
    
    return domains;
  } catch (error) {
    console.error(`Error fetching ENS domains for address ${address}:`, error);
    return [];
  }
}
