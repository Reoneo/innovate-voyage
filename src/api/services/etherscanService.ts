
import { delay } from '../jobsApi';

// Get account balance
export async function getAccountBalance(address: string): Promise<string> {
  try {
    console.log('Fetching account balance from Etherscan for:', address);
    const apiKey = process.env.VITE_ETHERSCAN_API_KEY || '';
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    
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
      // If no API key is set, mention it
      if (data.message && data.message.includes('API Key')) {
        console.warn('No Etherscan API key set. Set VITE_ETHERSCAN_API_KEY environment variable for better results.');
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
    const apiKey = process.env.VITE_ETHERSCAN_API_KEY || '';
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${apiKey}`);
    
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
    console.log(`Fetching latest ${limit} transactions for address:`, address);
    const apiKey = process.env.VITE_ETHERSCAN_API_KEY || '';
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Etherscan transactions response:', data.status, data.message);
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Use fake data in development if no API key
      if (process.env.NODE_ENV !== 'production' && (!apiKey || apiKey === '')) {
        console.log('Using mock transaction data due to missing API key');
        return generateMockTransactions(address, limit);
      }
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
    console.log(`Fetching ${limit} token transfers for address:`, address);
    const apiKey = process.env.VITE_ETHERSCAN_API_KEY || '';
    const response = await fetch(`${import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api'}?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Etherscan token transfers response:', data.status, data.message);
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Use fake data in development if no API key
      if (process.env.NODE_ENV !== 'production' && (!apiKey || apiKey === '')) {
        console.log('Using mock token transfer data due to missing API key');
        return generateMockTokenTransfers(address, limit);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan token transfers:', error);
    return [];
  }
}

// Mock data generators for development without API keys
function generateMockTransactions(address: string, count: number): any[] {
  const now = Math.floor(Date.now() / 1000);
  return Array(count).fill(null).map((_, i) => {
    const isOutgoing = i % 2 === 0;
    return {
      blockNumber: String(15000000 - i),
      timeStamp: String(now - i * 86400),
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      nonce: String(i),
      blockHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      from: isOutgoing ? address : `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      to: isOutgoing ? `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` : address,
      value: String(Math.floor(Math.random() * 1000000000000000000)),
      gas: "21000",
      gasPrice: "20000000000",
      isError: "0",
      txreceipt_status: "1",
      input: "0x",
      contractAddress: "",
      cumulativeGasUsed: "314159",
      gasUsed: "21000",
      confirmations: "1000",
      methodId: "0x",
      functionName: ""
    };
  });
}

function generateMockTokenTransfers(address: string, count: number): any[] {
  const now = Math.floor(Date.now() / 1000);
  const tokenNames = ['POAPBadge', 'Ethereum POAP', 'ETHDenver', 'DevCon', 'GitcoinPOAP', 'EthLondon'];
  const tokenSymbols = ['POAP', 'ETHP', 'DENV', 'DCON', 'GTC', 'ELDN'];
  const contractAddresses = [
    '0x22c1f6050e56d2876009903609a2cc3fef83b415',
    '0x1ce5621d386b2801f5600f1dbe29522805b8ac11',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
  ];
  
  return Array(count).fill(null).map((_, i) => {
    const tokenIndex = i % tokenNames.length;
    const contractIndex = i % contractAddresses.length;
    const isOutgoing = i % 3 !== 0; // Most are incoming
    
    return {
      blockNumber: String(15000000 - i),
      timeStamp: String(now - i * 86400),
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      nonce: String(i),
      blockHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      from: isOutgoing ? address : contractAddresses[contractIndex],
      to: isOutgoing ? contractAddresses[contractIndex] : address,
      contractAddress: contractAddresses[contractIndex],
      value: String(Math.floor(Math.random() * 1000000000000000000)),
      tokenName: tokenNames[tokenIndex],
      tokenSymbol: tokenSymbols[tokenIndex],
      tokenDecimal: "18",
      transactionIndex: String(i),
      gas: "100000",
      gasPrice: "20000000000",
      gasUsed: "80000",
      cumulativeGasUsed: "314159",
      input: "0x",
      confirmations: "1000",
      tokenID: String(i + 1000) // For NFTs
    };
  });
}
