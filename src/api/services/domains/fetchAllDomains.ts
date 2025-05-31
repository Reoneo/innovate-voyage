
import { getAllEnsRecords } from './getAllEnsRecords';

// Fetch all domains associated with an address using ENS client
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    console.log(`Fetching domains for address: ${address}`);
    
    const domains: string[] = [];
    
    // Check mock data as fallback
    const mockRecords = await getAllEnsRecords();
    const additionalDomains = mockRecords
      .filter(record => record.address.toLowerCase() === address.toLowerCase())
      .map(record => record.ensName);
    
    // Add any additional domains found
    for (const domain of additionalDomains) {
      if (!domains.includes(domain)) {
        domains.push(domain);
      }
    }
    
    console.log(`Found ${domains.length} domains for address ${address}:`, domains);
    return domains;
  } catch (error) {
    console.error(`Error fetching domains for address ${address}:`, error);
    return [];
  }
}
