
import { fetchFromEtherscan, getEtherscanConfig, isEmptyResultError } from './etherscanCore';

// Get account balance in ETH
export async function getAccountBalance(address: string): Promise<string> {
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
    console.error('Error fetching Etherscan balance:', error);
    // Only return "0.0000" instead of mock data
    return "0.0000";
  }
}

// Get transaction count
export async function getTransactionCount(address: string): Promise<number> {
  try {
    const result = await fetchFromEtherscan('', {
      module: 'proxy',
      action: 'eth_getTransactionCount',
      address: address,
      tag: 'latest'
    });
    
    return parseInt(result, 16);
  } catch (error) {
    console.error('Error fetching Etherscan transaction count:', error);
    // Return 0 instead of mock count
    return 0;
  }
}

// Get wallet creation date 
export async function getWalletCreationDate(address: string): Promise<string | null> {
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
    console.error('Error fetching wallet creation date:', error);
    // If it's just an empty result, don't throw
    if (isEmptyResultError(error)) {
      return null;
    }
    throw error;
  }
}

// Get tokens held by address
export async function getTokensByAddress(address: string): Promise<any[]> {
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
            // Note: This is a simplified calculation
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
    console.error('Error fetching tokens by address:', error);
    
    // If it's just an empty result, return empty array
    if (isEmptyResultError(error)) {
      return [];
    }
    throw error;
  }
}
