
// Mock token transfer data for demonstration purposes when API key is missing
export function getMockTokenTransfers(address: string, limit: number): any[] {
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
export function getMockStakingPositions(address: string): any[] {
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
