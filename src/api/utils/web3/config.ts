
// Store the API key for web3.bio
export const WEB3_BIO_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNDkyNzREIiwiZXhwIjoyMjA1OTExMzI0LCJyb2xlIjo2fQ.dGQ7o_ItgDU8X_MxBlja4in7qvGWtmKXjqhCHq2gX20";

// API headers for web3.bio with authentication
export const WEB3_BIO_HEADERS = {
  'X-API-KEY': `Bearer ${WEB3_BIO_API_KEY}`,
  'Accept': 'application/json'
};

// Rate limiting variables
export const REQUEST_DELAY_MS = 300; // Minimum time between requests
