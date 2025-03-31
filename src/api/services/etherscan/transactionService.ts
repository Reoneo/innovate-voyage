
import { fetchFromEtherscan, isEmptyResultError } from './etherscanCore';
import { getMockStakingPositions } from './mockAdvancedData';

// Get latest transactions
export async function getLatestTransactions(address: string, limit: number = 5): Promise<any[]> {
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
    console.error('Error fetching Etherscan transactions:', error);
    
    // If it's just an empty result, return empty array
    if (isEmptyResultError(error)) {
      return [];
    }
    throw error;
  }
}

// Get ERC-20 token transfers
export async function getTokenTransfers(address: string, limit: number = 5): Promise<any[]> {
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
    console.error('Error fetching Etherscan token transfers:', error);
    
    // If it's just an empty result, return empty array
    if (isEmptyResultError(error)) {
      return [];
    }
    throw error;
  }
}

// Get staking positions
export async function getStakingPositions(address: string): Promise<any[]> {
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
    console.error('Error fetching staking positions:', error);
    
    // If it's just an empty result, return empty array
    if (isEmptyResultError(error)) {
      return [];
    }
    throw error;
  }
}
