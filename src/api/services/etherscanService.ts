
import { delay } from '../jobsApi';

// Multiple API keys and endpoints for redundancy
const API_CONFIGS = [
  {
    name: 'Etherscan Primary',
    apiKey: "a48e86456d8043f6bce467b4076ab638",
    baseUrl: "https://api.etherscan.io/api"
  },
  {
    name: 'Etherscan Free',
    apiKey: "YourApiKeyToken", // Free tier fallback
    baseUrl: "https://api.etherscan.io/api"
  }
];

const OPTIMISM_API_CONFIG = {
  name: 'Optimism Etherscan',
  apiKey: "a48e86456d8043f6bce467b4076ab638",
  baseUrl: "https://api-optimistic.etherscan.io/api"
};

// Track API status for debugging
const apiStatus = {
  etherscan: { working: false, lastError: null as string | null },
  optimism: { working: false, lastError: null as string | null }
};

// Get account balance with multiple API fallbacks
export async function getAccountBalance(address: string): Promise<{ balance: string; source: string; error?: string }> {
  console.log('🔍 Fetching account balance for:', address);
  
  for (const config of API_CONFIGS) {
    try {
      const url = `${config.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${config.apiKey}`;
      console.log(`📡 Trying ${config.name}:`, url);
      
      const response = await fetchWithRetry(url);
      
      if (!response.ok) {
        console.warn(`❌ ${config.name} HTTP error:`, response.status);
        continue;
      }
      
      const data = await response.json();
      console.log(`📊 ${config.name} response:`, data);
      
      if (data.status === '1') {
        // Convert wei to ether
        const balanceInWei = data.result;
        const balanceInEther = parseFloat(balanceInWei) / 1e18;
        apiStatus.etherscan.working = true;
        console.log(`✅ ${config.name} balance success:`, balanceInEther.toFixed(4));
        return { 
          balance: balanceInEther.toFixed(4), 
          source: config.name 
        };
      } else {
        console.warn(`⚠️ ${config.name} API error:`, data.message);
        apiStatus.etherscan.lastError = data.message;
        continue;
      }
    } catch (error) {
      console.error(`💥 ${config.name} fetch error:`, error);
      apiStatus.etherscan.lastError = error instanceof Error ? error.message : 'Unknown error';
      continue;
    }
  }
  
  return { 
    balance: '0', 
    source: 'Failed - All APIs', 
    error: apiStatus.etherscan.lastError || 'All APIs failed' 
  };
}

// Get transaction count with multiple API fallbacks
export async function getTransactionCount(address: string): Promise<{ count: number; source: string; error?: string }> {
  console.log('🔍 Fetching transaction count for:', address);
  
  for (const config of API_CONFIGS) {
    try {
      const url = `${config.baseUrl}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${config.apiKey}`;
      console.log(`📡 Trying ${config.name} for tx count:`, url);
      
      const response = await fetchWithRetry(url);
      
      if (!response.ok) {
        console.warn(`❌ ${config.name} HTTP error:`, response.status);
        continue;
      }
      
      const data = await response.json();
      console.log(`📊 ${config.name} tx count response:`, data);
      
      if (data.result) {
        const count = parseInt(data.result, 16); // Convert hex to decimal
        console.log(`✅ ${config.name} tx count success:`, count);
        return { 
          count, 
          source: config.name 
        };
      } else {
        console.warn(`⚠️ ${config.name} tx count error:`, data.error);
        continue;
      }
    } catch (error) {
      console.error(`💥 ${config.name} tx count error:`, error);
      continue;
    }
  }
  
  return { 
    count: 0, 
    source: 'Failed - All APIs', 
    error: 'All APIs failed' 
  };
}

// Get first transaction with detailed debugging
export async function getFirstTransaction(address: string): Promise<{ transaction: any | null; source: string; error?: string }> {
  console.log('🔍 Fetching FIRST transaction for:', address);
  
  for (const config of API_CONFIGS) {
    try {
      const url = `${config.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${config.apiKey}`;
      console.log(`📡 Trying ${config.name} for first tx:`, url);
      
      const response = await fetchWithRetry(url);
      
      if (!response.ok) {
        console.warn(`❌ ${config.name} HTTP error:`, response.status);
        continue;
      }
      
      const data = await response.json();
      console.log(`📊 ${config.name} first tx response:`, data);
      
      if (data.status === '1' && data.result && data.result.length > 0) {
        const firstTx = data.result[0];
        console.log(`✅ ${config.name} first tx success:`, {
          hash: firstTx.hash,
          timestamp: firstTx.timeStamp,
          date: new Date(parseInt(firstTx.timeStamp) * 1000).toISOString()
        });
        return { 
          transaction: firstTx, 
          source: config.name 
        };
      } else {
        console.warn(`⚠️ ${config.name} first tx error:`, data.message || 'No transactions found');
        continue;
      }
    } catch (error) {
      console.error(`💥 ${config.name} first tx error:`, error);
      continue;
    }
  }
  
  return { 
    transaction: null, 
    source: 'Failed - All APIs', 
    error: 'No first transaction found from any API' 
  };
}

// Get latest transactions with multiple API fallbacks
export async function getLatestTransactions(address: string, limit: number = 10): Promise<{ transactions: any[]; source: string; error?: string }> {
  console.log('🔍 Fetching latest transactions for:', address);
  
  for (const config of API_CONFIGS) {
    try {
      const url = `${config.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${config.apiKey}`;
      
      const response = await fetchWithRetry(url);
      
      if (!response.ok) {
        console.warn(`❌ ${config.name} HTTP error:`, response.status);
        continue;
      }
      
      const data = await response.json();
      
      if (data.status === '1') {
        console.log(`✅ ${config.name} latest tx success:`, data.result?.length || 0, 'transactions');
        return { 
          transactions: data.result || [], 
          source: config.name 
        };
      } else {
        console.warn(`⚠️ ${config.name} latest tx error:`, data.message);
        continue;
      }
    } catch (error) {
      console.error(`💥 ${config.name} latest tx error:`, error);
      continue;
    }
  }
  
  return { 
    transactions: [], 
    source: 'Failed - All APIs', 
    error: 'All APIs failed' 
  };
}

// Get Optimism transactions
export async function getOptimismTransactions(address: string, limit: number = 5): Promise<{ transactions: any[]; source: string; error?: string }> {
  console.log('🔍 Fetching Optimism transactions for:', address);
  
  try {
    const url = `${OPTIMISM_API_CONFIG.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${OPTIMISM_API_CONFIG.apiKey}`;
    console.log(`📡 Trying ${OPTIMISM_API_CONFIG.name}:`, url);
    
    const response = await fetchWithRetry(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`📊 ${OPTIMISM_API_CONFIG.name} response:`, data);
    
    if (data.status === '1') {
      apiStatus.optimism.working = true;
      console.log(`✅ ${OPTIMISM_API_CONFIG.name} success:`, data.result?.length || 0, 'transactions');
      return { 
        transactions: data.result || [], 
        source: OPTIMISM_API_CONFIG.name 
      };
    } else {
      apiStatus.optimism.lastError = data.message;
      console.warn(`⚠️ ${OPTIMISM_API_CONFIG.name} error:`, data.message);
      return { 
        transactions: [], 
        source: OPTIMISM_API_CONFIG.name, 
        error: data.message 
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    apiStatus.optimism.lastError = errorMsg;
    console.error(`💥 ${OPTIMISM_API_CONFIG.name} error:`, error);
    return { 
      transactions: [], 
      source: OPTIMISM_API_CONFIG.name, 
      error: errorMsg 
    };
  }
}

// Get ERC-20 token transfers
export async function getTokenTransfers(address: string, limit: number = 5): Promise<{ transfers: any[]; source: string; error?: string }> {
  console.log('🔍 Fetching token transfers for:', address);
  
  for (const config of API_CONFIGS) {
    try {
      const url = `${config.baseUrl}?module=account&action=tokentx&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${config.apiKey}`;
      
      const response = await fetchWithRetry(url);
      
      if (!response.ok) {
        console.warn(`❌ ${config.name} HTTP error:`, response.status);
        continue;
      }
      
      const data = await response.json();
      
      if (data.status === '1') {
        console.log(`✅ ${config.name} token transfers success:`, data.result?.length || 0, 'transfers');
        return { 
          transfers: data.result || [], 
          source: config.name 
        };
      } else {
        console.warn(`⚠️ ${config.name} token transfers error:`, data.message);
        continue;
      }
    } catch (error) {
      console.error(`💥 ${config.name} token transfers error:`, error);
      continue;
    }
  }
  
  return { 
    transfers: [], 
    source: 'Failed - All APIs', 
    error: 'All APIs failed' 
  };
}

// Get account age in days
export async function getAccountAge(address: string): Promise<{ age: number; source: string; error?: string }> {
  console.log('🔍 Calculating account age for:', address);
  
  const firstTxResult = await getFirstTransaction(address);
  
  if (firstTxResult.transaction) {
    const firstTxDate = new Date(parseInt(firstTxResult.transaction.timeStamp) * 1000);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - firstTxDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log(`✅ Account age calculated:`, {
      firstTxDate: firstTxDate.toISOString(),
      ageDays: diffDays,
      source: firstTxResult.source
    });
    
    return { 
      age: diffDays, 
      source: firstTxResult.source 
    };
  }
  
  return { 
    age: 0, 
    source: firstTxResult.source, 
    error: firstTxResult.error 
  };
}

// Get API status for debugging
export function getApiStatus() {
  return apiStatus;
}

// Helper function to fetch with retry logic
async function fetchWithRetry(url: string, maxRetries = 2): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add a small delay between retries
      if (attempt > 0) {
        await delay(attempt * 500); // Shorter delay for faster debugging
      }
      
      const response = await fetch(url, { cache: "no-cache" });
      
      // If the response is rate limited, wait and retry
      if (response.status === 429) {
        console.log(`⏱️ Rate limited (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`);
        continue;
      }
      
      return response;
    } catch (error) {
      console.error(`💥 Fetch attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
      lastError = error;
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError || new Error('Failed to fetch after multiple retries');
}
