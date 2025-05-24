
import { ethers } from 'ethers';
import { MAINNET_RPC_URLS, OPTIMISM_RPC_URLS } from './rpcUrls';

// Create a more reliable mainnet provider with better error handling
export const mainnetProvider = new ethers.FallbackProvider(
  MAINNET_RPC_URLS.slice(0, 5).map((url, i) => ({
    provider: new ethers.JsonRpcProvider(url, 1), // Explicitly set chainId to 1 for mainnet
    priority: i + 1,
    weight: i === 0 ? 4 : i === 1 ? 3 : i === 2 ? 2 : 1,
    stallTimeout: 5000, // Increased timeout
    maxRetries: 2
  })),
  2 // Require 2 providers to agree (quorum)
);

export const optimismProvider = new ethers.FallbackProvider(
  OPTIMISM_RPC_URLS.slice(0, 3).map((url, i) => ({
    provider: new ethers.JsonRpcProvider(url, 10), // Explicitly set chainId to 10 for Optimism
    priority: i + 1,
    weight: i === 0 ? 3 : i === 1 ? 2 : 1,
    stallTimeout: 5000,
    maxRetries: 2
  })),
  1 // Only need 1 provider to respond for Optimism
);
