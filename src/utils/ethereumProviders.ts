import { ethers } from 'ethers';

// Multiple provider URLs for redundancy
const MAINNET_RPC_URLS = [
  // Prioritize LlamaRPC (no API key required)
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  // Fallback to Infura's free endpoint
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
];

// Create a provider with fallbacks
function createFallbackProvider() {
  try {
    // Try to use environment variable first if available
    if (import.meta.env.VITE_ETHEREUM_RPC_URL) {
      return new ethers.JsonRpcProvider(import.meta.env.VITE_ETHEREUM_RPC_URL);
    }
    
    // Otherwise use the first URL with fallbacks
    return new ethers.JsonRpcProvider(MAINNET_RPC_URLS[0]);
  } catch (error) {
    console.error("Error creating primary provider, trying fallback:", error);
    // If first provider fails, try the next one
    try {
      return new ethers.JsonRpcProvider(MAINNET_RPC_URLS[1]);
    } catch (secondError) {
      console.error("Error creating fallback provider, trying final fallback:", secondError);
      // Last resort fallback
      return new ethers.JsonRpcProvider(MAINNET_RPC_URLS[2]);
    }
  }
}

// Initialize Ethereum provider with fallback mechanism
export const mainnetProvider = createFallbackProvider();

// For Optimism (keeping simple for now)
export const optimismProvider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_OPTIMISM_RPC_URL || "https://optimism-mainnet.public.blastapi.io"
);

console.log("Ethereum providers initialized");
