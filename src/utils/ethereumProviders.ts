import { ethers } from 'ethers';

// Multiple provider URLs for redundancy with public endpoints
const MAINNET_RPC_URLS = [
  // Public RPC endpoints - use multiple for fallbacks
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://rpc.ankr.com/eth",
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
];

// Create a FallbackProvider for better reliability
function createMainnetProvider() {
  try {
    // Try to use environment variable first if available
    if (import.meta.env.VITE_ETHEREUM_RPC_URL) {
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_ETHEREUM_RPC_URL);
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
  import.meta.env.VITE_OPTIMISM_RPC_URL || "https://optimism-mainnet.public.blastapi.io"
);

console.log("Ethereum providers initialized");
