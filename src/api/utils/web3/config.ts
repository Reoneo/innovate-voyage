
// Secure web3 configuration without hardcoded keys
import { InputValidator } from '../../../utils/inputValidation';

// Remove hardcoded API key - this should be handled server-side
export const WEB3_BIO_API_KEY = undefined; // SECURITY FIX: Removed hardcoded key

// Secure API headers without exposing keys
export const WEB3_BIO_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// Rate limiting configuration
export const REQUEST_DELAY_MS = 500; // Increased for better rate limiting

// Secure fetch wrapper with validation
export async function secureFetch(url: string, options: RequestInit = {}) {
  // Validate URL
  if (!InputValidator.isValidUrl(url)) {
    throw new Error('Invalid URL provided');
  }

  // Add security headers
  const secureOptions: RequestInit = {
    ...options,
    headers: {
      ...WEB3_BIO_HEADERS,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, secureOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('Secure fetch error:', error);
    throw error;
  }
}
