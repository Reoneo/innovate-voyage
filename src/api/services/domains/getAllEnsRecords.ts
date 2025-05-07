
import { ENSRecord } from '../../types/web3Types';
import { delay } from '../../jobsApi';
import { mockEnsRecords } from '../../data/mockWeb3Data';
import { fetchWeb3BioProfile, generateFallbackAvatar } from '../../utils/web3/index';

// Get all available ENS records for a specific ENS name
export async function getAllEnsRecords(ensName?: string): Promise<any> {
  await delay(400);
  
  // If ENS name is provided, return specific record
  if (ensName) {
    // Try to find the record in mock data
    const record = mockEnsRecords.find(r => r.ensName === ensName);
    
    if (record) {
      // Ensure avatar exists
      if (!record.avatar) {
        try {
          const profile = await fetchWeb3BioProfile(ensName);
          if (profile && profile.avatar) {
            record.avatar = profile.avatar;
          } else {
            record.avatar = generateFallbackAvatar();
          }
        } catch (error) {
          record.avatar = generateFallbackAvatar();
        }
      }
      
      // Extract and format data to include description field at top level
      return {
        ...record,
        description: record.description || null
      };
    }
    
    // If not found in mock data, try to fetch from web3.bio
    try {
      const profile = await fetchWeb3BioProfile(ensName);
      if (profile) {
        return {
          ensName: ensName,
          description: profile.description || null,
          avatar: profile.avatar || generateFallbackAvatar(),
          socialProfiles: {
            twitter: profile.twitter,
            github: profile.github,
            linkedin: profile.linkedin,
            website: profile.website,
            email: profile.email
          }
        };
      }
    } catch (error) {
      console.error(`Error fetching profile for ${ensName}:`, error);
    }
    
    // Return empty object with description field if nothing found
    return { description: null };
  }
  
  // If no ENS name provided, return all records
  return [...mockEnsRecords];
}
