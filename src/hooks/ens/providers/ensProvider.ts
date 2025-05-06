
import { ethers } from 'ethers';

/**
 * Create a provider for ENS resolution with the specified RPC URL
 * @param rpcUrl The RPC URL to use for the provider
 * @returns An ethers provider instance
 */
export function createEnsProvider(rpcUrl: string = 'https://eth-mainnet.g.alchemy.com/v2/demo') {
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get the default mainnet provider for ENS resolution
 */
export const getDefaultProvider = () => createEnsProvider();

/**
 * Execute a provider operation with timeout handling
 * @param operation The async operation to execute
 * @param timeoutMs Timeout in milliseconds
 * @returns The result of the operation, or null if it times out
 */
export async function executeWithTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number = 5000
): Promise<T | null> {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
    );
    
    // Race between the operation and the timeout
    return await Promise.race([
      operation,
      timeoutPromise
    ]) as T;
  } catch (error) {
    console.error('Operation timed out or errored:', error);
    return null;
  }
}
