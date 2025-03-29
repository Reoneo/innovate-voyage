
import { delay } from '../jobsApi';

const ETHERSCAN_API_KEY = '5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM';
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

// Get account balance
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const response = await fetch(`${ETHERSCAN_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);
    
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
    const response = await fetch(`${ETHERSCAN_API_URL}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);
    
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
    const response = await fetch(`${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${ETHERSCAN_API_KEY}`);
    
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
    const response = await fetch(`${ETHERSCAN_API_URL}?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${ETHERSCAN_API_KEY}`);
    
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
