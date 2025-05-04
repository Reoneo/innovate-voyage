
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
export async function getEnsLinks(ensName: string, network: 'mainnet' = 'mainnet'): Promise<EnsLinks> {
  try {
    console.log(`Getting ENS links for ${ensName} on ${network}`);
    
    if (!ensName) {
      return { socials: {}, ensLinks: [] };
    }
    
    // Fetch the ENS profile which contains all records
    const profile = await fetchEnsProfile(ensName);
    
    if (!profile) {
      return { socials: {}, ensLinks: [] };
    }
    
    // Return formatted links
    return {
      socials: profile.socials || {},
      ensLinks: [],
      description: profile.description,
      keywords: profile.records?.keywords?.split(',').map(k => k.trim()) || []
    };
  } catch (error) {
    console.error(`Error getting ENS links: ${error}`);
    return { socials: {}, ensLinks: [] };
  }
}
