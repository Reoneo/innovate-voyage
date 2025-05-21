
import { ethers } from 'ethers';

// Define RPC URLs for different networks - More reliable endpoints first
const MAINNET_RPC_URLS = [
  "https://eth-mainnet.g.alchemy.com/v2/demo",
  "https://rpc.ankr.com/eth",
  "https://ethereum.publicnode.com",
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
];

const OPTIMISM_RPC_URLS = [
  "https://mainnet.optimism.io",
  "https://optimism-mainnet.public.blastapi.io",
  "https://op-mainnet.g.alchemy.com/v2/demo"
];

// Longer cache time-to-live in milliseconds (8 hours)
export const DEFAULT_ENS_TTL = 8 * 60 * 60 * 1000;

// Fast loading cache for popular domains (1 week)
export const PRIORITY_ENS_TTL = 7 * 24 * 60 * 60 * 1000;

// Create providers using FallbackProvider for better reliability
const mainnetProviders = MAINNET_RPC_URLS.map(
  url => new ethers.JsonRpcProvider(url)
);

export const mainnetProvider = new ethers.FallbackProvider(
  mainnetProviders.map((provider, i) => ({
    provider,
    priority: i + 1,
    weight: i === 0 ? 3 : i === 1 ? 2 : 1, // Higher weight to more reliable providers
    stallTimeout: 2000, // Wait 2s before trying next provider
    maxRetries: 2 // Allow some retries
  }))
);

export const optimismProvider = new ethers.FallbackProvider(
  OPTIMISM_RPC_URLS.map((url, i) => ({
    provider: new ethers.JsonRpcProvider(url),
    priority: i + 1,
    weight: i === 0 ? 2 : 1,
    stallTimeout: 2000,
    maxRetries: 2
  }))
);

// In-memory ENS cache
interface EnsCacheEntry {
  address?: string;
  ensName?: string;
  avatar?: string;
  bio?: string;
  links?: any;
  expiresAt: number;
}

const ensCache: Map<string, EnsCacheEntry> = new Map();

// Initialize with commonly used domains
const initializeCache = () => {
  // Popular domains that should be pre-cached
  const popularDomains = [
    { key: 'vitalik.eth', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', ttl: PRIORITY_ENS_TTL },
    { key: 'poap.eth', address: '0x6023e55814DC00f094386d4eb7e17Ce49ab1A190', ttl: PRIORITY_ENS_TTL }
  ];
  
  for (const domain of popularDomains) {
    ensCache.set(domain.key.toLowerCase(), {
      address: domain.address,
      expiresAt: Date.now() + domain.ttl
    });
    
    // Also cache by address
    ensCache.set(domain.address.toLowerCase(), {
      ensName: domain.key,
      expiresAt: Date.now() + domain.ttl
    });
  }
};

// Run initialization
initializeCache();

// Get data from cache
export function getFromEnsCache(key: string): EnsCacheEntry | null {
  if (!key) return null;
  
  const now = Date.now();
  const entry = ensCache.get(key.toLowerCase());
  
  if (entry && entry.expiresAt > now) {
    console.log(`Using cached ENS entry for ${key}`);
    return entry;
  }
  
  return null;
}

// Add data to cache with TTL
export function addToEnsCache(
  key: string, 
  data: Partial<EnsCacheEntry>, 
  ttl: number = DEFAULT_ENS_TTL
): void {
  if (!key) return;
  
  const existingEntry = ensCache.get(key.toLowerCase()) || { expiresAt: 0 };
  
  ensCache.set(key.toLowerCase(), {
    ...existingEntry,
    ...data,
    expiresAt: Date.now() + ttl
  });
  
  console.log(`Cached ENS entry for ${key}, expires in ${ttl/1000}s`);
}

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  let cleared = 0;
  
  for (const [key, entry] of ensCache.entries()) {
    if (entry.expiresAt < now) {
      ensCache.delete(key);
      cleared++;
    }
  }
  
  if (cleared > 0) {
    console.log(`Cleared ${cleared} expired ENS cache entries`);
  }
}, 15 * 60 * 1000); // Run every 15 minutes
