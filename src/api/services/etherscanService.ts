
import { delay } from '../jobsApi';

// Get account balance with retry mechanism
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetchWithRetry(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    
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

// Get transaction count (number of transactions) with retry mechanism
export async function getTransactionCount(address: string): Promise<number> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetchWithRetry(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return Array.isArray(data.result) ? data.result.length : 0;
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
export async function getLatestTransactions(address: string, limit: number = 5): Promise<any[]> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetchWithRetry(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`
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

// Get ERC-20 token transfers with retry mechanism
export async function getTokenTransfers(address: string, limit: number = 5): Promise<any[]> {
  try {
    const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
    const response = await fetchWithRetry(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`
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

// Helper function to fetch with retry logic
async function fetchWithRetry(url: string, maxRetries = 2): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add a small delay between retries
      if (attempt > 0) {
        await delay(attempt * 750); // Exponential backoff
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
