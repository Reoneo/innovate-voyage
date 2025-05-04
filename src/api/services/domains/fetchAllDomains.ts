
import { getAllEnsRecords } from './getAllEnsRecords';
import { fetchDomainsFromWeb3Bio } from './providers/web3BioProvider';
import { fetchDomainsFromEtherscan } from './providers/etherscanProvider';

// Fetch all domains associated with an address using web3.bio API
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    console.log(`Fetching domains for address: ${address}`);
    
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    // Try to get just one domain from web3.bio API first with timeout
    let domains: string[] = [];
    try {
      const allDomains = await Promise.race([
        fetchDomainsFromWeb3Bio(address),
        new Promise<string[]>((_, reject) => 
          setTimeout(() => reject(new Error('Web3.bio timeout')), 8000)
        )
      ]);
      
      clearTimeout(timeoutId);
      
      // Only take the first domain if available
      if (allDomains && allDomains.length > 0) {
        domains = [allDomains[0]];
        console.log(`Using primary ENS domain: ${domains[0]}`);
        return domains; // Return immediately after finding a valid domain
      }
    } catch (web3Error) {
      console.log('Web3.bio fetch timed out or errored:', web3Error);
      // Continue with other methods
    }
    
    // If no domains found through web3.bio, try Etherscan
    if (domains.length === 0) {
      try {
        // Set a shorter timeout for Etherscan API
        const etherscanController = new AbortController();
        const etherscanTimeoutId = setTimeout(() => etherscanController.abort(), 5000);
        
        const etherscanDomains = await fetchDomainsFromEtherscan(address);
        clearTimeout(etherscanTimeoutId);
        
        // Just take the first domain if available
        if (etherscanDomains && etherscanDomains.length > 0) {
          domains = [etherscanDomains[0]];
          console.log(`Using Etherscan ENS domain: ${domains[0]}`);
          return domains; // Return immediately after finding a valid domain
        }
      } catch (etherscanError) {
        console.error("Etherscan API error:", etherscanError);
      }
    }
    
    // Also check mock data as fallback, but only take one domain
    if (domains.length === 0) {
      const mockRecords = await getAllEnsRecords();
      const additionalDomains = mockRecords
        .filter(record => record.address.toLowerCase() === address.toLowerCase())
        .map(record => record.ensName);
      
      // Just take the first mock domain if available
      if (additionalDomains && additionalDomains.length > 0) {
        domains = [additionalDomains[0]];
        console.log(`Using mock ENS domain: ${domains[0]}`);
      }
    }
    
    console.log(`Found ${domains.length} domain for address ${address}:`, domains);
    return domains;
  } catch (error) {
    console.error(`Error fetching domains for address ${address}:`, error);
    return [];
  }
}
