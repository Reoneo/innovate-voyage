
import { getMockTokenTransfers, getMockStakingPositions } from './mockAdvancedData';

// Mock transaction data for demonstration purposes when API key is missing
export function getMockTransactions(address: string, limit: number): any[] {
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

// Mock token list for demonstration purposes
export function getMockTokens(address: string): any[] {
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
