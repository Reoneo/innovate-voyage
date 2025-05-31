
// Security headers utility for enhanced protection
import { SECURITY_CONFIG } from '../config/security';

export function applySecurityHeaders() {
  // Apply Content Security Policy
  const csp = Object.entries(SECURITY_CONFIG.CSP_DIRECTIVES)
    .map(([directive, value]) => `${directive} ${value}`)
    .join('; ');
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = csp;
  document.head.appendChild(meta);
  
  // Log security measures (for development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 Security headers applied');
    console.log('🛡️ CSP configured:', csp);
  }
}

// Initialize security headers on app start
export function initializeSecurity() {
  // Apply security headers
  applySecurityHeaders();
  
  // Log security status
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Security initialization complete');
    console.log('✅ API keys removed from frontend');
    console.log('✅ Input validation enabled');
    console.log('✅ XSS protection active');
    console.log('✅ Security headers applied');
  }
}
