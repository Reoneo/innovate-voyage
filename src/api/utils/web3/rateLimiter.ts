
// In-memory storage for rate limiting
let lastRequestTime = 0;

/**
 * Helper function to enforce rate limiting
 */
export async function enforceRateLimit(delayMs: number) {
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
  // This function is now deprecated as calls are proxied.
  // Returning empty headers to avoid breaking any lingering imports,
  // although all direct usages should be removed.
  return {};
}
