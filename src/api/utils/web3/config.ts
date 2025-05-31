
// Configuration for web3 services - NO SENSITIVE DATA
import { getClientConfig, getSecureHeaders, RATE_LIMIT_CONFIG } from './secureConfig';

// Client-side configuration (safe to expose)
const clientConfig = getClientConfig();

// Safe headers for client-side requests
export const SAFE_HEADERS = getSecureHeaders();

// Rate limiting configuration
export const REQUEST_DELAY_MS = clientConfig.REQUEST_DELAY_MS;
export const MAX_RETRIES = clientConfig.MAX_RETRIES;
export const CACHE_DURATION = clientConfig.CACHE_DURATION;

// Rate limiting settings
export const RATE_LIMITS = RATE_LIMIT_CONFIG;

// API endpoints (safe to expose)
export const API_ENDPOINTS = {
  WEB3_BIO: 'https://api.web3.bio',
  WEBACY: 'https://api.webacy.com',
  ETHERSCAN: 'https://api.etherscan.io/api'
};

// Warning: API keys should never be stored here
// Use environment variables and proxy endpoints instead
console.warn('API keys have been moved to secure server-side configuration');
