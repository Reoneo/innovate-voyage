
// Store the API key for web3.bio
// HARDCODED KEY REMOVED FOR SECURITY. This should be handled via a secure backend proxy.
export const WEB3_BIO_API_KEY = "";

// API headers for web3.bio with authentication
// This will no longer work without a valid key.
export const WEB3_BIO_HEADERS = {
  'X-API-KEY': `Bearer ${WEB3_BIO_API_KEY}`,
  'Accept': 'application/json'
};

// Rate limiting variables
export const REQUEST_DELAY_MS = 300; // Minimum time between requests
