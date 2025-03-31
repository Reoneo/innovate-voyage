
import { fetchFromEtherscan, getEtherscanConfig } from './etherscanCore';
import { getMockTransactions, getMockTokenTransfers } from './mockDataService';
import { getMockStakingPositions } from './mockAdvancedData';

// Get latest transactions
export async function getLatestTransactions(address: string, limit: number = 5): Promise<any[]> {
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
        offset: String(limit),
        sort: 'desc'
      });
      
      return result;
    } catch (error) {
      // If API key is missing or there's another error, fall back to mock data
      if (!apiKey || (error instanceof Error && error.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock transactions due to missing API key or error");
        return getMockTransactions(address, limit);
      }
      throw error;
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
    const { apiKey } = getEtherscanConfig();
    
    // Try to fetch real data
    try {
      const result = await fetchFromEtherscan('', {
        module: 'account',
        action: 'tokentx',
        address: address,
        page: '1',
        offset: String(limit),
        sort: 'desc'
      });
      
      return result;
    } catch (error) {
      // If API key is missing or there's another error, fall back to mock data
      if (!apiKey || (error instanceof Error && error.message.includes("Missing/Invalid API Key"))) {
        console.log("Using mock token transfers due to missing API key or error");
        return getMockTokenTransfers(address, limit);
      }
      throw error;
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
        offset: '100',
        sort: 'desc'
      });
      
      // Filter for transactions to ETH 2.0 deposit contract
      const eth2DepositContract = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
      const stakingTxs = result.filter((tx: any) => 
        tx.to && tx.to.toLowerCase() === eth2DepositContract.toLowerCase()
      );
      
      return stakingTxs.map((tx: any) => ({
        type: 'ETH 2.0 Staking',
        hash: tx.hash,
        timestamp: tx.timeStamp,
        value: parseFloat(tx.value) / 1e18,
        valueFormatted: `${(parseFloat(tx.value) / 1e18).toFixed(2)} ETH`
      }));
    } catch (error) {
      // If API key is missing or there's another error, fall back to mock data
      if (!apiKey || (error instanceof Error && error.message.includes("Missing/Invalid API Key"))) {
        return getMockStakingPositions(address);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching staking positions:', error);
    return getMockStakingPositions(address);
  }
}
