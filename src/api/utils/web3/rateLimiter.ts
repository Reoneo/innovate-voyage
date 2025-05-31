
import { SAFE_HEADERS, REQUEST_DELAY_MS } from './config';

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
 * Function to get safe fetch headers (no API keys exposed)
 */
export function getSafeHeaders() {
  return SAFE_HEADERS;
}

/**
 * Rate limiter for different services
 */
class RateLimiter {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  canMakeRequest(service: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const current = this.requestCounts.get(service);

    if (!current || now > current.resetTime) {
      this.requestCounts.set(service, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count++;
    return true;
  }

  async waitForRateLimit(service: string, limit: number, windowMs: number): Promise<void> {
    while (!this.canMakeRequest(service, limit, windowMs)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export const rateLimiter = new RateLimiter();
