
import { WEB3_BIO_HEADERS } from './config';

// In-memory storage for rate limiting
let lastRequestTime = 0;
const requestCache = new Map<string, {data: any, timestamp: number}>();

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
  return WEB3_BIO_HEADERS;
}

/**
 * Get cached data if available and not expired
 * @param key Cache key 
 * @param maxAge Maximum age of cache in milliseconds
 * @returns Cached data or null
 */
export function getCachedData(key: string, maxAge: number = 60000) {
  const cachedItem = requestCache.get(key);
  if (cachedItem && (Date.now() - cachedItem.timestamp) < maxAge) {
    return cachedItem.data;
  }
  return null;
}

/**
 * Set data in the cache
 * @param key Cache key
 * @param data Data to cache
 */
export function setCachedData(key: string, data: any) {
  requestCache.set(key, {
    data,
    timestamp: Date.now()
  });
}
