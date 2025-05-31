
import { WEB3_BIO_HEADERS, REQUEST_DELAY_MS } from './config';

// In-memory storage for rate limiting
let lastRequestTime = 0;

/**
 * Helper function to enforce rate limiting
 */
export async function enforceRateLimit(delayMs: number = REQUEST_DELAY_MS) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < delayMs) {
    const waitTime = delayMs - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Function to get proper fetch headers for Web3.bio API
 */
export function getWeb3BioHeaders() {
  return WEB3_BIO_HEADERS;
}

/**
 * Rate limiter function
 */
export const rateLimiter = {
  enforceRateLimit,
  getWeb3BioHeaders
};

/**
 * Create rate limit function
 */
export function createRateLimit(delayMs: number) {
  return () => enforceRateLimit(delayMs);
}
