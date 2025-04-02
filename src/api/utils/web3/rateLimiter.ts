
// Simple rate limiter for API requests
let lastRequestTime = 0;

/**
 * Enforces a minimum delay between API requests to avoid rate limiting
 * @param minDelay Minimum delay in ms between requests
 */
export async function enforceRateLimit(minDelay: number): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < minDelay) {
    const waitTime = minDelay - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}
