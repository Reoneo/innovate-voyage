
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { mockEnsRecords } from '../data/mockWeb3Data';
import { fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';

const ETHERSCAN_API_KEY = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";

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

// Fetch all ENS domains associated with an address using Etherscan API
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    // First try to fetch domains using Etherscan API
    const domains: string[] = [];
    
    try {
      // Use the Etherscan API to get ENS domain records
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
    } catch (etherscanError) {
      console.error("Etherscan API error:", etherscanError);
    }
    
    // If no domains found through Etherscan, fall back to web3.bio
    if (domains.length === 0) {
      // Try to get real domains from web3.bio API
      const profile = await fetchWeb3BioProfile(address);
      
      if (profile && profile.identity) {
        if (profile.identity.includes('.eth') || profile.identity.includes('.box')) {
          domains.push(profile.identity);
        }
        
        // Also check mock data as fallback
        const mockRecords = await getAllEnsRecords();
        const additionalDomains = mockRecords
          .filter(record => record.address.toLowerCase() === address.toLowerCase())
          .filter(record => record.ensName !== profile.identity) // Filter out the main identity
          .map(record => record.ensName);
        
        // Add any additional domains found
        for (const domain of additionalDomains) {
          if (!domains.includes(domain)) {
            domains.push(domain);
          }
        }
      }
    }
    
    return domains;
  } catch (error) {
    console.error(`Error fetching ENS domains for address ${address}:`, error);
    return [];
  }
}
