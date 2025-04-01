
import { getAllEnsRecords } from './getAllEnsRecords';
import { fetchDomainsFromWeb3Bio } from './providers/web3BioProvider';
import { fetchDomainsFromEtherscan } from './providers/etherscanProvider';

// Fetch all domains associated with an address using web3.bio API
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    console.log(`Fetching domains for address: ${address}`);
    
    // Try to get real domains from web3.bio API first
    const domains: string[] = await fetchDomainsFromWeb3Bio(address);
    
    // If no domains found through web3.bio, fall back to Etherscan
    if (domains.length === 0) {
      try {
        const etherscanDomains = await fetchDomainsFromEtherscan(address);
        domains.push(...etherscanDomains);
      } catch (etherscanError) {
        console.error("Etherscan API error:", etherscanError);
      }
    }
    
    // Also check mock data as fallback
    if (domains.length === 0) {
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
    }
    
    console.log(`Found ${domains.length} domains for address ${address}:`, domains);
    return domains;
  } catch (error) {
    console.error(`Error fetching domains for address ${address}:`, error);
    return [];
  }
}
