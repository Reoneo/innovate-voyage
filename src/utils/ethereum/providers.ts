
import { ethers } from 'ethers';
import { MAINNET_RPC_URLS, OPTIMISM_RPC_URLS } from './rpcUrls';
import { createProviders, createFallbackProvider } from './providerFactory';

// Create providers using FallbackProvider for better reliability
const mainnetProviders = createProviders(MAINNET_RPC_URLS);

export const mainnetProvider = createFallbackProvider(mainnetProviders);

export const optimismProvider = new ethers.FallbackProvider(
  OPTIMISM_RPC_URLS.map((url, i) => ({
    provider: new ethers.JsonRpcProvider(url),
    priority: i + 1,
    weight: i === 0 ? 3 : i === 1 ? 2 : 1,
    stallTimeout: 3000, // Increased from 1s to 3s
    maxRetries: 3 // Increased from 2
  })),
  1 // Only need 1 provider to respond
);
