
import { delay } from '../jobsApi';

// Get account balance
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=account&action=balance&address=${address}&tag=latest&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY || ''}`);
    
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
      // Return mock data for demonstration if API key is missing
      if (data.message && data.message.includes("Missing/Invalid API Key")) {
        return "1.2345";
      }
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
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY || ''}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result) {
      // Convert hex to decimal
      return parseInt(data.result, 16);
    } else {
      console.warn('Etherscan API returned an error');
      // Return mock data for demonstration if API key is missing
      if (data.message && data.message.includes("Missing/Invalid API Key")) {
        return 42;
      }
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
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY || ''}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Return mock data for demonstration if API key is missing
      if (data.message && data.message.includes("Missing/Invalid API Key")) {
        return getMockTransactions(address, limit);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan transactions:', error);
    return getMockTransactions(address, limit);
  }
}

// Get ERC-20 token transfers
export async function getTokenTransfers(address: string, limit: number = 5): Promise<any[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY || ''}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Return mock data for demonstration if API key is missing
      if (data.message && data.message.includes("Missing/Invalid API Key")) {
        return getMockTokenTransfers(address, limit);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan token transfers:', error);
    return [];
  }
}

// Mock transaction data for demonstration purposes when API key is missing
function getMockTransactions(address: string, limit: number): any[] {
  const now = Math.floor(Date.now() / 1000);
  const transactions = [];
  
  for (let i = 0; i < limit; i++) {
    const isSending = i % 2 === 0;
    transactions.push({
      blockNumber: String(16000000 - i * 100),
      timeStamp: String(now - i * 86400), // One day apart
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      from: isSending ? address.toLowerCase() : `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      to: isSending ? `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` : address.toLowerCase(),
      value: String(Math.floor(Math.random() * 1000000000000000000)), // Random value in wei
      gas: "21000",
      gasPrice: "20000000000",
      isError: "0",
      txreceipt_status: "1",
      input: "0x",
      contractAddress: "",
      cumulativeGasUsed: "21000",
      gasUsed: "21000",
      confirmations: "100"
    });
  }
  
  return transactions;
}

// Mock token transfer data for demonstration purposes when API key is missing
function getMockTokenTransfers(address: string, limit: number): any[] {
  const now = Math.floor(Date.now() / 1000);
  const tokenSymbols = ["UNI", "LINK", "WETH", "USDC", "DAI", "USDT"];
  const transfers = [];
  
  for (let i = 0; i < limit; i++) {
    const isSending = i % 2 === 0;
    transfers.push({
      blockNumber: String(16000000 - i * 100),
      timeStamp: String(now - i * 86400), // One day apart
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      from: isSending ? address.toLowerCase() : `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      to: isSending ? `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` : address.toLowerCase(),
      value: String(Math.floor(Math.random() * 1000000000000000000)), // Random value in token units
      tokenName: tokenSymbols[i % tokenSymbols.length],
      tokenSymbol: tokenSymbols[i % tokenSymbols.length],
      tokenDecimal: "18",
      transactionIndex: String(i),
      gas: "100000",
      gasPrice: "20000000000",
      gasUsed: "80000",
      cumulativeGasUsed: String(80000 * (i + 1)),
      input: "deprecated",
      confirmations: "100"
    });
  }
  
  return transfers;
}
