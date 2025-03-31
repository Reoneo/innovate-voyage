
// Implement mock data services for Etherscan API

// Mock token data
export const getMockTokens = (address: string) => {
  return [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      balanceFormatted: '1.2345',
      balance: '1234500000000000000',
      decimals: '18'
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      balanceFormatted: '125.00',
      balance: '125000000000000000000',
      decimals: '18'
    },
    {
      name: 'Chainlink Token',
      symbol: 'LINK',
      balanceFormatted: '50.00',
      balance: '50000000000000000000',
      decimals: '18'
    }
  ];
};

// Mock transaction data
export const getMockTransactions = (address: string, limit: number = 5) => {
  // Generate different mock data based on the address
  // to simulate different users
  const now = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;
  
  const baseTxs = [
    {
      blockNumber: '12345678',
      timeStamp: String(now - day * 1),
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      nonce: '0',
      blockHash: '0xabc',
      from: address,
      to: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      value: '1000000000000000000',
      gas: '21000',
      gasPrice: '20000000000',
      isError: '0',
      input: '0x',
      contractAddress: '',
      cumulativeGasUsed: '21000',
      gasUsed: '21000',
      confirmations: '10',
      methodId: '0x',
      functionName: ''
    },
    {
      blockNumber: '12345679',
      timeStamp: String(now - day * 3),
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      nonce: '1',
      blockHash: '0xdef',
      from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      to: address,
      value: '2000000000000000000',
      gas: '21000',
      gasPrice: '20000000000',
      isError: '0',
      input: '0x',
      contractAddress: '',
      cumulativeGasUsed: '21000',
      gasUsed: '21000',
      confirmations: '9',
      methodId: '0x',
      functionName: ''
    },
    {
      blockNumber: '12345680',
      timeStamp: String(now - day * 5),
      hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      nonce: '2',
      blockHash: '0xfed',
      from: address,
      to: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      value: '500000000000000000',
      gas: '21000',
      gasPrice: '20000000000',
      isError: '0',
      input: '0x',
      contractAddress: '',
      cumulativeGasUsed: '21000',
      gasUsed: '21000',
      confirmations: '8',
      methodId: '0x',
      functionName: ''
    }
  ];
  
  // Generate more transactions if needed
  const transactions = [...baseTxs];
  while (transactions.length < limit) {
    const lastTx = {...transactions[transactions.length - 1]};
    const blockNum = parseInt(lastTx.blockNumber) + 1;
    const timestamp = parseInt(lastTx.timeStamp) - day * 2; 
    
    transactions.push({
      ...lastTx,
      blockNumber: String(blockNum),
      timeStamp: String(timestamp),
      hash: '0x' + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
      from: Math.random() > 0.5 ? address : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      to: Math.random() > 0.5 ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' : address,
      value: String(Math.floor(Math.random() * 5 * 1e18))
    });
  }
  
  return transactions.slice(0, limit);
};

// Mock token transfer data
export const getMockTokenTransfers = (address: string, limit: number = 5) => {
  const now = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;
  
  const baseTransfers = [
    {
      blockNumber: '12345678',
      timeStamp: String(now - day * 2),
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      nonce: '0',
      blockHash: '0xabc',
      from: address,
      to: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      value: '5000000000000000000',
      tokenName: 'Uniswap',
      tokenSymbol: 'UNI',
      tokenDecimal: '18',
      transactionIndex: '0',
      gas: '100000',
      gasPrice: '20000000000',
      gasUsed: '80000',
      cumulativeGasUsed: '80000',
      input: '0x',
      confirmations: '10'
    },
    {
      blockNumber: '12345679',
      timeStamp: String(now - day * 4),
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      nonce: '1',
      blockHash: '0xdef',
      from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      to: address,
      contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      value: '10000000000000000000',
      tokenName: 'Chainlink Token',
      tokenSymbol: 'LINK',
      tokenDecimal: '18',
      transactionIndex: '0',
      gas: '100000',
      gasPrice: '20000000000',
      gasUsed: '80000',
      cumulativeGasUsed: '80000',
      input: '0x',
      confirmations: '9'
    }
  ];
  
  // Generate more transfers if needed
  const transfers = [...baseTransfers];
  const tokens = [
    { 
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 
      name: 'Uniswap', 
      symbol: 'UNI' 
    },
    { 
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', 
      name: 'Chainlink Token', 
      symbol: 'LINK' 
    },
    { 
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', 
      name: 'Dai Stablecoin', 
      symbol: 'DAI' 
    }
  ];
  
  while (transfers.length < limit) {
    const lastTransfer = {...transfers[transfers.length - 1]};
    const blockNum = parseInt(lastTransfer.blockNumber) + 1;
    const timestamp = parseInt(lastTransfer.timeStamp) - day * 2;
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
    
    transfers.push({
      ...lastTransfer,
      blockNumber: String(blockNum),
      timeStamp: String(timestamp),
      hash: '0x' + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
      from: Math.random() > 0.5 ? address : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      to: Math.random() > 0.5 ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' : address,
      contractAddress: randomToken.address,
      tokenName: randomToken.name,
      tokenSymbol: randomToken.symbol,
      value: String(Math.floor(Math.random() * 20 * 1e18))
    });
  }
  
  return transfers.slice(0, limit);
};
