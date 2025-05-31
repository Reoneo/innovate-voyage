import { InputValidator } from '../../../../utils/inputValidation';

// SECURITY FIX: Remove hardcoded API key
// This should be handled through a secure backend proxy
const ETHERSCAN_API_KEY = undefined;

/**
 * Fetch ENS domains from Etherscan via secure proxy
 * SECURITY NOTE: This should be moved to a backend service
 */
export async function fetchDomainsFromEtherscan(address: string): Promise<string[]> {
  const domains: string[] = [];
  
  try {
    // Validate input address
    if (!InputValidator.isValidEthereumAddress(address)) {
      console.warn('Invalid Ethereum address provided to Etherscan provider');
      return domains;
    }

    // TODO: Replace with secure backend proxy call
    // For now, return empty array to prevent API key exposure
    console.warn('Etherscan API calls disabled for security - implement backend proxy');
    return domains;
    
    // Original implementation commented out for security:
    /*
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
    */
    
  } catch (error) {
    console.error(`Secure error handling for address ${address.substring(0, 6)}...${address.substring(38)}:`, error);
    return domains;
  }
}
