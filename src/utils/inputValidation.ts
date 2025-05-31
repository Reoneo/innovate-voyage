
// Input validation utilities for security
export class InputValidator {
  // Validate Ethereum address format
  static isValidEthereumAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    
    // Check if it's a valid hex string with 0x prefix and 40 characters
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    return addressRegex.test(address);
  }

  // Validate ENS name format
  static isValidEnsName(ensName: string): boolean {
    if (!ensName || typeof ensName !== 'string') return false;
    
    // Basic ENS validation - alphanumeric with dots and hyphens
    const ensRegex = /^[a-zA-Z0-9.-]+\.eth$/;
    return ensRegex.test(ensName) && ensName.length >= 7 && ensName.length <= 255;
  }

  // Validate GitHub username
  static isValidGitHubUsername(username: string): boolean {
    if (!username || typeof username !== 'string') return false;
    
    // GitHub username rules: 1-39 characters, alphanumeric and hyphens, no consecutive hyphens
    const githubRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]){0,38}$/;
    return githubRegex.test(username) && !username.includes('--');
  }

  // Sanitize HTML to prevent XSS
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate and sanitize URL
  static isValidUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Rate limiting helper
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, number[]>();
    
    return (identifier: string): boolean => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      if (!requests.has(identifier)) {
        requests.set(identifier, []);
      }
      
      const userRequests = requests.get(identifier)!;
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => time > windowStart);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(identifier, validRequests);
      return true;
    };
  }
}
