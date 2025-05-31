
// Security configuration and utilities
export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP_DIRECTIVES: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' https://cdn.gpteng.co",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'img-src': "'self' data: https: blob:",
    'connect-src': "'self' https://api.github.com https://api.web3.bio https://api.etherscan.io https://opensea.io https:",
    'font-src': "'self' https://fonts.gstatic.com",
    'frame-src': "'none'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'"
  },
  
  // Rate limiting configuration
  RATE_LIMITS: {
    API_CALLS_PER_MINUTE: 60,
    GITHUB_API_CALLS_PER_HOUR: 5000
  }
};

// Security headers utility
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
});
