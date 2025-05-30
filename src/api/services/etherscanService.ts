
import { delay } from '../jobsApi';

// Updated API key from your Infura setup
const ETHERSCAN_API_KEY = "a48e86456d8043f6bce467b4076ab638";
const OPTIMISM_ETHERSCAN_API_KEY = "a48e86456d8043f6bce467b4076ab638"; // Using same key for Optimism

// Get account balance with retry mechanism
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const response = await fetchWithRetry(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);
    
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

// Get transaction count from txlist API for more accurate count
export async function getTransactionCount(address: string): Promise<number> {
  try {
    const response = await fetchWithRetry(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${ETHERSCAN_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1' && Array.isArray(data.result)) {
      // Get total transaction count using a separate API call
      const countResponse = await fetchWithRetry(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
      );
      
      if (countResponse.ok) {
        const countData = await countResponse.json();
        return parseInt(countData.result, 16); // Convert hex to decimal
      }
      
      return data.result.length;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching Etherscan transaction count:', error);
    return 0;
  }
}

// Get latest transactions with retry mechanism
export async function getLatestTransactions(address: string, limit: number = 10): Promise<any[]> {
  try {
    const response = await fetchWithRetry(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    );
    
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

// Get first transaction for CV profile data
export async function getFirstTransaction(address: string): Promise<any | null> {
  try {
    const response = await fetchWithRetry(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${ETHERSCAN_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1' && data.result.length > 0) {
      return data.result[0];
    } else {
      console.warn('No first transaction found:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching first transaction:', error);
    return null;
  }
}

// Get Optimism transactions for multi-chain support
export async function getOptimismTransactions(address: string, limit: number = 5): Promise<any[]> {
  try {
    const response = await fetchWithRetry(
      `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${OPTIMISM_ETHERSCAN_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Optimism Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Optimism Etherscan API returned an error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Optimism transactions:', error);
    return [];
  }
}

// Get ERC-20 token transfers with retry mechanism
export async function getTokenTransfers(address: string, limit: number = 5): Promise<any[]> {
  try {
    const response = await fetchWithRetry(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    );
    
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

// Get account age in days
export async function getAccountAge(address: string): Promise<number> {
  try {
    const firstTx = await getFirstTransaction(address);
    if (firstTx) {
      const firstTxDate = new Date(parseInt(firstTx.timeStamp) * 1000);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - firstTxDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  } catch (error) {
    console.error('Error calculating account age:', error);
    return 0;
  }
}

// Helper function to fetch with retry logic
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add a small delay between retries
      if (attempt > 0) {
        await delay(attempt * 1000); // Exponential backoff
      }
      
      const response = await fetch(url, { cache: "no-cache" });
      
      // If the response is rate limited, wait and retry
      if (response.status === 429) {
        console.log(`Rate limited (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`);
        continue;
      }
      
      return response;
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
      lastError = error;
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError || new Error('Failed to fetch after multiple retries');
}
