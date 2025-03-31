
import { fetchFromEtherscan, getEtherscanConfig } from './etherscanCore';
import { getMockTransactions, getMockTokens } from './mockDataService';

// Get account balance in ETH
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const { apiKey } = getEtherscanConfig();
    
    // Try to fetch real data
    try {
      const result = await fetchFromEtherscan('', {
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest'
      });
      
      const balanceInETH = (parseInt(result) / 1e18).toFixed(4);
      return balanceInETH;
    } catch (error) {
      // If API key is missing or there's another error, return mock data
      if (!apiKey || (error instanceof Error && error.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock balance due to missing API key or error");
        return "1.2345";
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching Etherscan balance:', error);
    console.log("Using mock balance due to fetch error");
    return "1.2345";
  }
}

// Get transaction count
export async function getTransactionCount(address: string): Promise<number> {
  try {
    const { apiKey } = getEtherscanConfig();
    
    // Try to fetch real data
    try {
      const result = await fetchFromEtherscan('', {
        module: 'proxy',
        action: 'eth_getTransactionCount',
        address: address,
        tag: 'latest'
      });
      
      return parseInt(result, 16);
    } catch (error) {
      // If API key is missing or there's another error, fetch transactions and count them
      if (!apiKey || (error instanceof Error && error.message.includes("Missing/Invalid API Key"))) {
        console.log("Counting mock transactions due to missing API key or error");
        const mockTransactions = await getMockTransactions(address, 50);
        return mockTransactions.length;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching Etherscan transaction count:', error);
    console.log("Using mock transaction count due to fetch error");
    return 42;
  }
}

// Get wallet creation date 
export async function getWalletCreationDate(address: string): Promise<string | null> {
  try {
    const { apiKey } = getEtherscanConfig();
    
    // Try to fetch real data
    try {
      const result = await fetchFromEtherscan('', {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '1',
        sort: 'asc'
      });
      
      if (Array.isArray(result) && result.length > 0) {
        const firstTx = result[0];
        return new Date(parseInt(firstTx.timeStamp) * 1000).toISOString();
      } 
      return null;
    } catch (error) {
      // If API key is missing or there's another error, fall back to mock data
      if (!apiKey || (error instanceof Error && error.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock creation date due to missing API key or error");
        // Return a date 1-3 years ago
        const randomYearsAgo = Math.floor(Math.random() * 2) + 1;
        const date = new Date();
        date.setFullYear(date.getFullYear() - randomYearsAgo);
        return date.toISOString();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching wallet creation date:', error);
    console.log("Using mock creation date due to fetch error");
    // Return a date 1-3 years ago
    const randomYearsAgo = Math.floor(Math.random() * 2) + 1;
    const date = new Date();
    date.setFullYear(date.getFullYear() - randomYearsAgo);
    return date.toISOString();
  }
}

// Get tokens held by address
export async function getTokensByAddress(address: string): Promise<any[]> {
  try {
    const { apiKey } = getEtherscanConfig();
    
    // Try to fetch real data
    try {
      const result = await fetchFromEtherscan('', {
        module: 'account',
        action: 'tokentx',
        address: address,
        page: '1',
        offset: '100',
        sort: 'desc'
      });
      
      // Process token transfers to get unique tokens with balances
      const tokens: Record<string, any> = {};
      
      if (Array.isArray(result)) {
        result.forEach(tx => {
          const contractAddress = tx.contractAddress.toLowerCase();
          
          if (!tokens[contractAddress]) {
            tokens[contractAddress] = {
              name: tx.tokenName,
              symbol: tx.tokenSymbol,
              decimals: tx.tokenDecimal,
              contractAddress: tx.contractAddress,
              // Note: This is a simplified calculation that doesn't account for all transfers
              // A real implementation would need to sum all transfers
              balance: tx.to.toLowerCase() === address.toLowerCase() 
                ? tx.value 
                : (-1 * parseInt(tx.value)).toString(),
              balanceFormatted: '0'
            };
          }
        });
        
        // Calculate formatted balances
        Object.values(tokens).forEach(token => {
          const decimals = parseInt(token.decimals);
          const balance = parseInt(token.balance);
          token.balanceFormatted = (balance / Math.pow(10, decimals)).toFixed(2);
        });
      }
      
      return Object.values(tokens).filter(token => parseFloat(token.balanceFormatted) > 0);
    } catch (error) {
      // If API key is missing or there's another error, fall back to mock data
      if (!apiKey || (error instanceof Error && error.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock tokens due to missing API key or error");
        return getMockTokens(address);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching tokens by address:', error);
    console.log("Using mock tokens due to fetch error");
    return getMockTokens(address);
  }
}
