
import { ethers } from 'ethers';

// Initialize Ethereum providers with public endpoints - using non-key specific public endpoints
export const mainnetProvider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
); 

export const optimismProvider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_OPTIMISM_RPC_URL || "https://optimism-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
); 

// Note: The RPC URLs provided are using Infura's free public endpoint
// For production, it's better to use environment variables for these endpoints
