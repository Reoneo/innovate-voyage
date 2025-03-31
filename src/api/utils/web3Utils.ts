// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Cache for storing resolved address to reduce API calls
export const addressCache: Record<string, string> = {};

// Cache for storing resolved domain to reduce API calls
export const domainCache: Record<string, string> = {};

// TTL for cache in milliseconds (30 minutes)
const CACHE_TTL = 30 * 60 * 1000;

// Cache timestamps for invalidation
const cacheTimestamps: Record<string, number> = {};

/**
 * Normalize ENS input to ensure consistent format
 */
export function normalizeIdentity(identity: string): string {
  if (!identity) return '';
  
  // Ethereum address
  if (identity.startsWith('0x') && identity.length === 42) {
    return identity.toLowerCase();
  }
  
  // If no extension, add .eth
  if (!identity.includes('.')) {
    return `${identity}.eth`;
  }
  
  return identity.toLowerCase();
}

// Generate a fallback avatar URL
export function generateFallbackAvatar() {
  const fallbackIdx = Math.floor(Math.random() * 30) + 1;
  return `https://i.pravatar.cc/300?img=${fallbackIdx}`;
}

// Clear caches
export function clearWeb3BioCache() {
  Object.keys(avatarCache).forEach(key => delete avatarCache[key]);
  Object.keys(addressCache).forEach(key => delete addressCache[key]);
  Object.keys(domainCache).forEach(key => delete domainCache[key]);
  Object.keys(cacheTimestamps).forEach(key => delete cacheTimestamps[key]);
  
  // Clear session storage cache
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('web3bio:')) {
      sessionStorage.removeItem(key);
    }
  });
}

// Keep fetchWeb3BioProfile function signature for backward compatibility
export async function fetchWeb3BioProfile(identity: string) {
  console.warn('fetchWeb3BioProfile is deprecated. Use ENS.js functions instead.');
  return null;
}
