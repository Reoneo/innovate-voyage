
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { mockEnsRecords } from '../data/mockWeb3Data';
import { generateFallbackAvatar } from '../utils/web3Utils';
import { getAvatar, getName } from '@/utils/ens/ensClient';

const ETHERSCAN_API_KEY = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";

// Get all available ENS records (for demo purposes)
export async function getAllEnsRecords(): Promise<ENSRecord[]> {
  await delay(400);
  
  // Make sure all records have avatars
  await Promise.all(
    mockEnsRecords.map(async (record) => {
      if (!record.avatar) {
        // Try to fetch real avatar using ENS.js
        try {
          const avatar = await getAvatar(record.ensName);
          if (avatar) {
            record.avatar = avatar;
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

// Fetch all ENS domains associated with an address using Etherscan API and ENS.js
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    // First try to fetch domains using Etherscan API
    const domains: string[] = [];
    
    try {
      // First try to get primary ENS name using ENS.js
      const nameResult = await getName(address);
      if (nameResult && nameResult.name) {
        domains.push(nameResult.name);
      }
      
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
      
      // Also fetch NameWrapper wrapped names
      const nameWrapperResponse = await fetch(`https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&contractaddress=0xD4416b13d2B3a9aBae7AcD5D6C2BbDBE25686401&page=1&offset=100&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
      
      if (nameWrapperResponse.ok) {
        const nameWrapperData = await nameWrapperResponse.json();
        
        if (nameWrapperData.status === '1' && nameWrapperData.result) {
          // Process NameWrapper transactions
          const nameWrapperTxs = nameWrapperData.result;
          
          for (const tx of nameWrapperTxs) {
            if (tx.to.toLowerCase() === address.toLowerCase()) {
              try {
                // For NameWrapper, the token name may contain the domain
                const tokenName = tx.tokenName;
                if (tokenName && tokenName.includes("Wrapped Name")) {
                  // Try to extract from token name or use alternative methods
                  if (tx.tokenSymbol === "WENS") {
                    // This is a wrapped ENS name
                    // Try to derive the name from available data
                    const wrappedName = tx.tokenID.includes(".") 
                      ? tx.tokenID 
                      : `${tx.tokenID}.eth`;
                      
                    if (!domains.includes(wrappedName)) {
                      domains.push(wrappedName);
                    }
                  }
                }
              } catch (err) {
                console.error("Error processing NameWrapper transaction:", err);
              }
            }
          }
        }
      }
    } catch (etherscanError) {
      console.error("Etherscan API error:", etherscanError);
    }
    
    return domains;
  } catch (error) {
    console.error(`Error fetching ENS domains for address ${address}:`, error);
    return [];
  }
}
