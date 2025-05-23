
import { ethers } from 'ethers';

/**
 * Create providers with optimized timeout and retry settings
 */
export const createProviders = (urls: string[]) => {
  return urls.map(url => {
    const provider = new ethers.JsonRpcProvider(url);
    // Set shorter timeouts - prevent hanging on unreachable RPC endpoints
    provider.pollingInterval = 4000;
    return provider;
  });
};

/**
 * Create a FallbackProvider with weighted priorities
 */
export const createFallbackProvider = (
  providers: ethers.JsonRpcProvider[], 
  quorum: number = 1
) => {
  return new ethers.FallbackProvider(
    providers.map((provider, i) => ({
      provider,
      priority: i + 1,
      // Higher weight to more reliable providers
      weight: i === 0 ? 5 : i === 1 ? 4 : i === 2 ? 3 : i === 3 ? 2 : 1, 
      stallTimeout: 3000, // Increased wait time from 1s to 3s before trying next provider
      maxRetries: 3 // Increased from 2 to 3 retries
    })),
    quorum
  );
};
