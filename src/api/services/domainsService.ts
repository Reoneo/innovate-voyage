
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { mockEnsRecords } from '../data/mockWeb3Data';
import { fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';

const ETHERSCAN_API_KEY = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
const WEB3_BIO_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNDkyNzREIiwiZXhwIjoyMjA1OTExMzI0LCJyb2xlIjo2fQ.dGQ7o_ItgDU8X_MxBlja4in7qvGWtmKXjqhCHq2gX20";

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

// Fetch all domains associated with an address using web3.bio API
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    // Try to get real domains from web3.bio API
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
    
    return domains;
  } catch (error) {
    console.error(`Error fetching domains for address ${address}:`, error);
    return [];
  }
}

/**
 * Fetch domains from web3.bio API
 */
async function fetchDomainsFromWeb3Bio(address: string): Promise<string[]> {
  try {
    const response = await fetch(`https://api.web3.bio/profile/${address}`, {
      headers: {
        'Authorization': `Bearer ${WEB3_BIO_API_KEY}`
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    // Extract all identities
    const domains: string[] = [];
    
    for (const profile of data) {
      if (profile.identity) {
        domains.push(profile.identity);
      }
      
      // Also extract aliases if available
      if (profile.aliases && Array.isArray(profile.aliases)) {
        for (const alias of profile.aliases) {
          const parts = alias.split(',');
          if (parts.length === 2 && parts[1].includes('.')) {
            if (!domains.includes(parts[1])) {
              domains.push(parts[1]);
            }
          }
        }
      }
    }
    
    return domains;
  } catch (error) {
    console.error("Error fetching from web3.bio:", error);
    return [];
  }
}

/**
 * Fetch ENS domains from Etherscan as a fallback
 */
async function fetchDomainsFromEtherscan(address: string): Promise<string[]> {
  const domains: string[] = [];
  
  // Use the Etherscan API to get ENS domain records (ENS Registry)
  const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&contractaddress=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&page=1&offset=100&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
  
  if (!response.ok) {
    throw new Error(`Etherscan API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.status === '1' && data.result) {
    // Filter for ENS domain transactions
    // The ENS domain registrar contract address: 0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85
    const ensTransactions = data.result;
    
    // Process each transaction to extract ENS names
    for (const tx of ensTransactions) {
      if (tx.to.toLowerCase() === address.toLowerCase()) {
        try {
          // The tokenName is usually in the format: "ENS: domain.eth"
          const tokenName = tx.tokenName;
          if (tokenName && tokenName.startsWith("ENS:")) {
            const ensDomain = tokenName.substring(4).trim();
            if (ensDomain && !domains.includes(ensDomain)) {
              domains.push(ensDomain);
            }
          } else if (tx.tokenID) {
            // If tokenName doesn't work, try to add the tokenID
            const ensName = `${tx.tokenID}.eth`;
            if (!domains.includes(ensName)) {
              domains.push(ensName);
            }
          }
        } catch (err) {
          console.error("Error processing ENS transaction:", err);
        }
      }
    }
  }
  
  return domains;
}
