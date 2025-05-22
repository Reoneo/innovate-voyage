
import { ethers } from 'ethers';

// Define RPC URLs for different networks - More reliable endpoints first and expanded list
const MAINNET_RPC_URLS = [
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com", 
  "https://rpc.ankr.com/eth",
  "https://eth-mainnet.g.alchemy.com/v2/demo",
  "https://rpc.builder0x69.io",
  "https://cloudflare-eth.com",
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  "https://api.mycryptoapi.com/eth",
  "https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79",
  "https://rpc.eth.gateway.fm"
];

const OPTIMISM_RPC_URLS = [
  "https://mainnet.optimism.io",
  "https://optimism-mainnet.public.blastapi.io",
  "https://op-mainnet.g.alchemy.com/v2/demo",
  "https://optimism.meowrpc.com",
  "https://optimism-rpc.publicnode.com"
];

// Longer cache time-to-live in milliseconds (8 hours)
export const DEFAULT_ENS_TTL = 8 * 60 * 60 * 1000;

// Fast loading cache for popular domains (1 week)
export const PRIORITY_ENS_TTL = 7 * 24 * 60 * 60 * 1000;

// Create providers with more aggressive timeout and retry settings
const createProviders = (urls: string[]) => {
  return urls.map(url => {
    const provider = new ethers.JsonRpcProvider(url);
    // Set shorter timeouts - prevent hanging on unreachable RPC endpoints
    provider.pollingInterval = 4000;
    return provider;
  });
};

// Create providers using FallbackProvider for better reliability
const mainnetProviders = createProviders(MAINNET_RPC_URLS);

export const mainnetProvider = new ethers.FallbackProvider(
  mainnetProviders.map((provider, i) => ({
    provider,
    priority: i + 1,
    // Higher weight to more reliable providers
    weight: i === 0 ? 5 : i === 1 ? 4 : i === 2 ? 3 : i === 3 ? 2 : 1, 
    stallTimeout: 3000, // Increased wait time from 1s to 3s before trying next provider
    maxRetries: 3 // Increased from 2 to 3 retries
  })),
  1 // Only need 1 provider to respond for basic operations
);

export const optimismProvider = new ethers.FallbackProvider(
  OPTIMISM_RPC_URLS.map((url, i) => ({
    provider: new ethers.JsonRpcProvider(url),
    priority: i + 1,
    weight: i === 0 ? 3 : i === 1 ? 2 : 1,
    stallTimeout: 3000, // Increased from 1s to 3s
    maxRetries: 3 // Increased from 2
  })),
  1 // Only need 1 provider to respond
);

// In-memory ENS cache
interface EnsCacheEntry {
  address?: string;
  ensName?: string;
  avatar?: string;
  bio?: string;
  links?: any;
  textRecords?: Record<string, string | null>;
  expiresAt: number;
  attempts?: number; // Track failed resolution attempts
}

const ensCache: Map<string, EnsCacheEntry> = new Map();

// Initialize with commonly used domains - with improved data
const initializeCache = () => {
  // Popular domains that should be pre-cached
  const popularDomains = [
    { 
      key: 'vitalik.eth', 
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      avatar: 'https://metadata.ens.domains/mainnet/avatar/vitalik.eth',
      ttl: PRIORITY_ENS_TTL 
    },
    { 
      key: 'smith.box', 
      address: '0xC05501d710B3Cdb2D2C279d0A6b9A2975b3DD096',
      avatar: 'https://metadata.ens.domains/mainnet/avatar/smith.eth', // Use .eth equivalent
      ttl: PRIORITY_ENS_TTL 
    },
    { 
      key: 'smith.eth', 
      address: '0xC05501d710B3Cdb2D2C279d0A6b9A2975b3DD096',
      avatar: 'https://metadata.ens.domains/mainnet/avatar/smith.eth',
      ttl: PRIORITY_ENS_TTL 
    },
    { 
      key: 'poap.eth', 
      address: '0x6023e55814DC00f094386d4eb7e17Ce49ab1A190',
      avatar: 'https://metadata.ens.domains/mainnet/avatar/poap.eth',
      ttl: PRIORITY_ENS_TTL 
    },
    { 
      key: 'poap.box', 
      address: '0x6023e55814DC00f094386d4eb7e17Ce49ab1A190',
      avatar: 'https://metadata.ens.domains/mainnet/avatar/poap.eth', // Use .eth equivalent
      ttl: PRIORITY_ENS_TTL 
    }
  ];
  
  for (const domain of popularDomains) {
    ensCache.set(domain.key.toLowerCase(), {
      address: domain.address,
      avatar: domain.avatar,
      expiresAt: Date.now() + domain.ttl
    });
    
    // Also cache by address
    ensCache.set(domain.address.toLowerCase(), {
      ensName: domain.key,
      avatar: domain.avatar,
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
    expiresAt: Date.now() + ttl,
    // Reset attempts counter when we get valid data
    attempts: data.address || data.ensName || data.avatar ? 0 : existingEntry.attempts
  });
  
  console.log(`Cached ENS entry for ${key}, expires in ${ttl/1000}s`);

  // If we have both an address and ENS name, cache in both directions
  if (data.address && data.ensName) {
    const addressKey = data.address.toLowerCase();
    const ensKey = data.ensName.toLowerCase();
    
    // Cache address -> ENS
    if (key !== addressKey) {
      ensCache.set(addressKey, {
        ...existingEntry,
        ...data,
        expiresAt: Date.now() + ttl
      });
      console.log(`Cross-cached ENS entry for address ${addressKey}`);
    }
    
    // Cache ENS -> address
    if (key !== ensKey) {
      ensCache.set(ensKey, {
        ...existingEntry,
        ...data,
        expiresAt: Date.now() + ttl
      });
      console.log(`Cross-cached ENS entry for name ${ensKey}`);
    }
  }
}

// Mark a failed resolution attempt
export function markFailedResolution(key: string): void {
  if (!key) return;
  
  const existingEntry = ensCache.get(key.toLowerCase()) || { 
    expiresAt: Date.now() + 5 * 60 * 1000, // Cache failures for 5 minutes
    attempts: 0 
  };
  
  ensCache.set(key.toLowerCase(), {
    ...existingEntry,
    attempts: (existingEntry.attempts || 0) + 1
  });
  
  console.log(`Marked failed resolution attempt for ${key}, attempts: ${(existingEntry.attempts || 0) + 1}`);
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
