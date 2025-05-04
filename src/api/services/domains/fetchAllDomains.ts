
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
    
    // Try to get real domains from web3.bio API first with timeout
    let domains: string[] = [];
    try {
      domains = await Promise.race([
        fetchDomainsFromWeb3Bio(address),
        new Promise<string[]>((_, reject) => 
          setTimeout(() => reject(new Error('Web3.bio timeout')), 8000)
        )
      ]);
      clearTimeout(timeoutId);
    } catch (web3Error) {
      console.log('Web3.bio fetch timed out or errored:', web3Error);
      // Continue with other methods
    }
    
    // If no domains found through web3.bio or limited results, try Etherscan
    if (domains.length === 0 || domains.length < 5) {
      try {
        // Set a timeout for Etherscan API as well
        const etherscanController = new AbortController();
        const etherscanTimeoutId = setTimeout(() => etherscanController.abort(), 5000);
        
        const etherscanDomains = await fetchDomainsFromEtherscan(address);
        clearTimeout(etherscanTimeoutId);
        
        // Add any new domains not already in the list
        for (const domain of etherscanDomains) {
          if (!domains.includes(domain)) {
            domains.push(domain);
          }
        }
      } catch (etherscanError) {
        console.error("Etherscan API error:", etherscanError);
      }
    }
    
    // If we found too many domains (over 50), limit the display
    // This prevents processing too many domains which can cause timeouts
    if (domains.length > 50) {
      console.log(`Found ${domains.length} domains, limiting to 50 for performance`);
      domains = domains.slice(0, 50);
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
