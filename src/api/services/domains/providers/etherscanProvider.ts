
import { supabase } from '@/integrations/supabase/client';

// API key for Etherscan is now in a proxy function

/**
 * Fetch ENS domains from Etherscan as a fallback
 */
export async function fetchDomainsFromEtherscan(address: string): Promise<string[]> {
  const domains: string[] = [];
  
  try {
    // Use the Etherscan API via a proxy to get ENS domain records
    const params = `module=account&action=tokennfttx&address=${address}&contractaddress=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&page=1&offset=100&sort=asc`;
    const { data, error } = await supabase.functions.invoke('proxy-etherscan', {
      body: { params }
    });
    
    if (error) {
      throw error;
    }
    
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
    console.error(`Error fetching from Etherscan proxy: ${error}`);
    return domains;
  }
}

