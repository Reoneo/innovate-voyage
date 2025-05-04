
import { ethers } from 'ethers';

// Multiple provider URLs for redundancy with public endpoints
const MAINNET_RPC_URLS = [
  // Public RPC endpoints - use multiple for fallbacks
  "https://eth.meowrpc.com",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com", 
  "https://rpc.ankr.com/eth",
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
];

// Cache for network requests
const responseCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute TTL

// Helper function to use cached fetch with timeout
async function fetchWithCacheAndTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Using cached response for ${url}`);
    return cached.data;
  }
  
  try {
    // Set default timeout if not provided in options
    if (!options.signal) {
      options.signal = AbortSignal.timeout(timeoutMs);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    responseCache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

// Create a FallbackProvider for better reliability
function createMainnetProvider() {
  try {
    // Try to use environment variable first if available
    if (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_ETHEREUM_RPC_URL) {
      const customRpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL;
      console.log('Using custom RPC URL from env');
      const provider = new ethers.JsonRpcProvider(customRpcUrl);
      
      // Test the provider
      provider.getBlockNumber().catch(err => {
        console.warn("Custom RPC provider failed, using fallbacks", err);
        return createFallbackProvider();
      });
      
      return provider;
    }
    
    return createFallbackProvider();
  } catch (error) {
    console.error("Error creating provider:", error);
    // Last resort - try direct provider
    return new ethers.JsonRpcProvider(MAINNET_RPC_URLS[0]);
  }
}

// Create a provider with multiple fallbacks
function createFallbackProvider() {
  try {
    // Create providers from all RPC URLs
    const providers = MAINNET_RPC_URLS.map(url => {
      return new ethers.JsonRpcProvider(url);
    });
    
    // Return the first one for now, but we could implement more sophisticated
    // fallback mechanisms if needed
    const provider = providers[0];
    
    // Test the provider
    provider.getBlockNumber().catch(err => {
      console.warn("Primary provider failed, trying next one", err);
      return providers[1];
    });
    
    return provider;
  } catch (error) {
    console.error("Error creating fallback provider:", error);
    // Last resort 
    return new ethers.JsonRpcProvider(MAINNET_RPC_URLS[0]);
  }
}

// Initialize Ethereum provider with fallback mechanism
export const mainnetProvider = createMainnetProvider();

// For Optimism (keeping simple for now)
export const optimismProvider = new ethers.JsonRpcProvider(
  typeof import.meta.env !== 'undefined' && import.meta.env.VITE_OPTIMISM_RPC_URL 
    ? import.meta.env.VITE_OPTIMISM_RPC_URL 
    : "https://optimism-mainnet.public.blastapi.io"
);

// Export the fetchWithCacheAndTimeout helper for use in other modules
export { fetchWithCacheAndTimeout };

console.log("Ethereum providers initialized");
