
import { getEnsTextRecords, fetchEnsProfile } from '../../api/services/ens/ensApiClient';

interface EnsLinks {
  socials: Record<string, string>;
  ensLinks: string[];
  description?: string;
  keywords?: string[];
}

/**
 * Get social and other links from ENS records using ENS API
 */
export async function getEnsLinks(ensName: string, network: string = 'mainnet'): Promise<EnsLinks> {
  try {
    console.log(`Getting ENS links for ${ensName} on ${network}`);
    
    if (!ensName) {
      return { socials: {}, ensLinks: [], keywords: [] };
    }
    
    // Fetch the ENS profile which contains all records
    const profile = await fetchEnsProfile(ensName);
    
    if (!profile) {
      console.log(`No ENS profile found for ${ensName}`);
      return { socials: {}, ensLinks: [], keywords: [] };
    }
    
    console.log(`Profile data for ${ensName}:`, profile);
    
    // Extract keywords if present
    const keywords = profile.records?.keywords ? 
      profile.records.keywords.split(',').map(k => k.trim()) : 
      [];
    
    // Return formatted links
    return {
      socials: profile.socials || {},
      ensLinks: [],
      description: profile.description,
      keywords: keywords
    };
  } catch (error) {
    console.error(`Error getting ENS links: ${error}`);
    return { socials: {}, ensLinks: [], keywords: [] };
  }
}
