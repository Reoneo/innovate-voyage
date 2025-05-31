
// API key for Etherscan
const ETHERSCAN_API_KEY = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";

/**
 * Fetch ENS domains from Etherscan as a fallback
 */
export async function fetchDomainsFromEtherscan(address: string): Promise<string[]> {
  const domains: string[] = [];
  
  try {
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
        if (tx.to && tx.to.toLowerCase() === address.toLowerCase()) {
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
    
    console.log(`Etherscan returned ${domains.length} domains for ${address}:`, domains);
    return domains;
  } catch (error) {
    console.error(`Error fetching from Etherscan: ${error}`);
    return domains;
  }
}
