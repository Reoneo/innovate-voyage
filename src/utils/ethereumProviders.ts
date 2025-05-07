import { ethers } from 'ethers';

// Multiple provider URLs for redundancy with public endpoints
const MAINNET_RPC_URLS = [
  // Custom Infura endpoint with API key
  "https://mainnet.infura.io/v3/a48e86456d8043f6bce467b4076ab638",
  // Fallback public RPC endpoints
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://rpc.ankr.com/eth"
];

// Create a FallbackProvider for better reliability
function createMainnetProvider() {
  try {
    // Try to use the primary Infura provider first
    const provider = new ethers.JsonRpcProvider(MAINNET_RPC_URLS[0]);
    console.log("Using Infura provider for ENS resolution");
    
    // Test the provider
    provider.getBlockNumber().catch(err => {
      console.warn("Infura provider failed, trying fallbacks", err);
      return createFallbackProvider();
    });
    
    return provider;
  } catch (error) {
    console.error("Error creating provider:", error);
    // Last resort - try direct provider
    return new ethers.JsonRpcProvider(MAINNET_RPC_URLS[1]);
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

console.log("Ethereum providers initialized with Infura API key");
