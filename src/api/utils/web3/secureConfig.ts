
// Secure configuration management
// This file handles API keys and secrets securely

// Environment-based configuration for server-side operations
export const getServerConfig = () => {
  // These should be set as environment variables in production
  return {
    WEB3_BIO_API_KEY: process.env.WEB3_BIO_API_KEY || '',
    WEBACY_API_KEY: process.env.WEBACY_API_KEY || '',
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN || ''
  };
};

// Client-side configuration (no sensitive data)
export const getClientConfig = () => {
  return {
    REQUEST_DELAY_MS: 300,
    MAX_RETRIES: 3,
    CACHE_DURATION: 300000, // 5 minutes
  };
};

// Safe headers for client-side requests (proxy endpoints)
export const getSecureHeaders = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  WEB3_BIO: { requests: 100, window: 60000 }, // 100 requests per minute
  WEBACY: { requests: 50, window: 60000 },    // 50 requests per minute
  ETHERSCAN: { requests: 5, window: 1000 }    // 5 requests per second
};
