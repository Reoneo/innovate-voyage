import { delay } from '../jobsApi';

// Get account balance
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
    
    const response = await fetch(`${apiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    
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
      if (!apiKey || (data.message && data.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock balance data due to missing API key");
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
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
    
    const response = await fetch(`${apiUrl}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${apiKey}`);
    
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
      if (!apiKey || (data.message && data.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock transaction count due to missing API key");
        return 42;
      }
      return 0;
    }
  } catch (error) {
    console.error('Error fetching Etherscan transaction count:', error);
    return 0;
  }
}

// Get wallet creation date (first transaction)
export async function getWalletCreationDate(address: string): Promise<string | null> {
  try {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
    
    const response = await fetch(`${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1' && data.result.length > 0) {
      const timestamp = parseInt(data.result[0].timeStamp);
      return new Date(timestamp * 1000).toISOString();
    } else {
      console.warn('Etherscan API returned an error or no transactions found');
      // Return mock data for demonstration if API key is missing
      if (!apiKey || (data.message && data.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock creation date due to missing API key");
        return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year ago
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching wallet creation date:', error);
    return null;
  }
}

// Get latest transactions
export async function getLatestTransactions(address: string, limit: number = 5): Promise<any[]> {
  try {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
    
    const response = await fetch(`${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Return mock data for demonstration if API key is missing
      if (!apiKey || (data.message && data.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock transactions due to missing API key");
        return getMockTransactions(address, limit);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan transactions:', error);
    console.log("Using mock transactions due to fetch error");
    return getMockTransactions(address, limit);
  }
}

// Get ERC-20 token transfers
export async function getTokenTransfers(address: string, limit: number = 5): Promise<any[]> {
  try {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
    
    const response = await fetch(`${apiUrl}?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Return mock data for demonstration if API key is missing
      if (!apiKey || (data.message && data.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock token transfers due to missing API key");
        return getMockTokenTransfers(address, limit);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan token transfers:', error);
    console.log("Using mock token transfers due to fetch error");
    return getMockTokenTransfers(address, limit);
  }
}

// Get staking positions
export async function getStakingPositions(address: string): Promise<any[]> {
  try {
    // First check for ETH 2.0 staking transactions
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
    
    const response = await fetch(`${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      // Filter for transactions to ETH 2.0 deposit contract
      const eth2DepositContract = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
      const stakingTxs = data.result.filter((tx: any) => 
        tx.to && tx.to.toLowerCase() === eth2DepositContract.toLowerCase()
      );
      
      return stakingTxs.map((tx: any) => ({
        type: 'ETH 2.0 Staking',
        hash: tx.hash,
        timestamp: tx.timeStamp,
        value: parseFloat(tx.value) / 1e18,
        valueFormatted: `${(parseFloat(tx.value) / 1e18).toFixed(2)} ETH`
      }));
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Return mock data for demonstration if API key is missing
      if (!apiKey || (data.message && data.message.includes("Missing/Invalid API Key"))) {
        return getMockStakingPositions(address);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching staking positions:', error);
    return getMockStakingPositions(address);
  }
}

// Get tokens by address (token holdings)
export async function getTokensByAddress(address: string): Promise<any[]> {
  try {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
    
    const response = await fetch(`${apiUrl}?module=account&action=tokenlist&address=${address}&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result.map((token: any) => ({
        name: token.name,
        symbol: token.symbol,
        tokenAddress: token.contractAddress,
        decimals: token.decimals,
        balance: parseFloat(token.balance) / Math.pow(10, parseInt(token.decimals)),
        balanceFormatted: `${(parseFloat(token.balance) / Math.pow(10, parseInt(token.decimals))).toFixed(2)} ${token.symbol}`
      }));
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      // Return mock data for demonstration if API key is missing
      if (!apiKey || (data.message && data.message.includes("Missing/Invalid API Key"))) {
        return getMockTokens(address);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching token list:', error);
    return getMockTokens(address);
  }
}

// Mock transaction data for demonstration purposes when API key is missing
function getMockTransactions(address: string, limit: number): any[] {
  const now = Math.floor(Date.now() / 1000);
  const transactions = [];
  
  for (let i = 0; i < limit; i++) {
    const isSending = i % 2 === 0;
    const mockValue = Math.floor(Math.random() * 1000000000000000000); // Random value in wei
    
    transactions.push({
      blockNumber: String(16000000 - i * 100),
      timeStamp: String(now - i * 86400), // One day apart
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      from: isSending ? address.toLowerCase() : `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      to: isSending ? `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` : address.toLowerCase(),
      value: String(mockValue), // Random value in wei
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
  
  console.log(`Generated ${transactions.length} mock transactions for address ${address}`);
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

// Mock staking positions for demonstration purposes
function getMockStakingPositions(address: string): any[] {
  return [
    {
      type: 'ETH 2.0 Staking',
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      timestamp: String(Math.floor(Date.now() / 1000) - 90 * 86400), // 90 days ago
      value: 32,
      valueFormatted: '32.00 ETH'
    },
    {
      type: 'Lido Staking',
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      timestamp: String(Math.floor(Date.now() / 1000) - 60 * 86400), // 60 days ago
      value: 16,
      valueFormatted: '16.00 ETH'
    }
  ];
}

// Mock token list for demonstration purposes
function getMockTokens(address: string): any[] {
  return [
    {
      name: 'Uniswap',
      symbol: 'UNI',
      tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      decimals: 18,
      balance: 100,
      balanceFormatted: '100.00 UNI'
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      tokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18,
      balance: 50,
      balanceFormatted: '50.00 LINK'
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      balance: 1000,
      balanceFormatted: '1000.00 USDC'
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18,
      balance: 500,
      balanceFormatted: '500.00 DAI'
    },
    {
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimals: 18,
      balance: 1.5,
      balanceFormatted: '1.50 WETH'
    }
  ];
}
