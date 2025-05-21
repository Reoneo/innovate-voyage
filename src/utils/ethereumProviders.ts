
import { ethers } from 'ethers';

// Define RPC URLs for different networks
const MAINNET_RPC_URLS = [
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://rpc.ankr.com/eth",
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
];

const OPTIMISM_RPC_URLS = [
  "https://mainnet.optimism.io",
  "https://optimism-mainnet.public.blastapi.io"
];

// Default cache time-to-live in milliseconds (4 hours)
export const DEFAULT_ENS_TTL = 4 * 60 * 60 * 1000;

// Create providers using FallbackProvider for better reliability
const mainnetProviders = MAINNET_RPC_URLS.map(
  url => new ethers.JsonRpcProvider(url)
);

export const mainnetProvider = new ethers.FallbackProvider(
  mainnetProviders.map((provider, i) => ({
    provider,
    priority: i + 1,
    weight: i === 0 ? 2 : 1, // Give higher weight to primary provider
  }))
);

export const optimismProvider = new ethers.FallbackProvider(
  OPTIMISM_RPC_URLS.map((url, i) => ({
    provider: new ethers.JsonRpcProvider(url),
    priority: i + 1,
    weight: 1,
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

// Get data from cache
export function getFromEnsCache(key: string): EnsCacheEntry | null {
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
  const existingEntry = ensCache.get(key.toLowerCase()) || { expiresAt: 0 };
  
  ensCache.set(key.toLowerCase(), {
    ...existingEntry,
    ...data,
    expiresAt: Date.now() + ttl
  });
  
  console.log(`Cached ENS entry for ${key}, expires in ${ttl/1000}s`);
}
