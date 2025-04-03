
import { delay } from '../jobsApi';

// Get account balance
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      // Convert wei to ether
      const balanceInWei = data.result;
      const balanceInEther = parseFloat(balanceInWei) / 1e18;
      return balanceInEther.toFixed(4);
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      return '0';
    }
  } catch (error) {
    console.error('Error fetching Etherscan data:', error);
    return '0';
  }
}

// Get transaction count (number of transactions)
export async function getTransactionCount(address: string): Promise<number> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result) {
      // Convert hex to decimal
      return parseInt(data.result, 16);
    } else {
      console.warn('Etherscan API returned an error');
      return 0;
    }
  } catch (error) {
    console.error('Error fetching Etherscan transaction count:', error);
    return 0;
  }
}

// Get latest transactions
export async function getLatestTransactions(address: string, limit: number = 5): Promise<any[]> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan transactions:', error);
    return [];
  }
}

// Get ERC-20 token transfers
export async function getTokenTransfers(address: string, limit: number = 5): Promise<any[]> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan token transfers:', error);
    return [];
  }
}
