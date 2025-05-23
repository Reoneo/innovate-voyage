
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

// Cache disabled - no caching for accurate resolution
export const DEFAULT_ENS_TTL = 0;
export const PRIORITY_ENS_TTL = 0;

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

// Cache completely disabled for accurate resolution
interface EnsCacheEntry {
  address?: string;
  ensName?: string;
  avatar?: string;
  bio?: string;
  links?: any;
  textRecords?: Record<string, string | null>;
  expiresAt: number;
  attempts?: number;
}

const ensCache: Map<string, EnsCacheEntry> = new Map();

// No initialization - cache disabled
const initializeCache = () => {
  console.log('ENS cache disabled for accurate resolution');
};

// Run initialization
initializeCache();

// Always return null - cache disabled
export function getFromEnsCache(key: string): EnsCacheEntry | null {
  console.log(`Cache disabled - not using cached data for ${key}`);
  return null;
}

// No-op - cache disabled
export function addToEnsCache(
  key: string, 
  data: Partial<EnsCacheEntry>, 
  ttl: number = DEFAULT_ENS_TTL
): void {
  console.log(`Cache disabled - not caching data for ${key}`);
}

// No-op - cache disabled
export function markFailedResolution(key: string): void {
  console.log(`Cache disabled - not marking failed resolution for ${key}`);
}
