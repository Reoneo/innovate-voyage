
// Secure API configuration
interface ApiConfig {
  githubToken?: string;
  web3BioApiKey?: string;
  etherscanApiKey?: string;
}

class SecureApiConfig {
  private config: ApiConfig = {};

  constructor() {
    // Only use environment variables for sensitive keys
    // GitHub token should be handled server-side
    this.config = {
      // These will be moved to server-side proxies
      githubToken: undefined, // Remove from frontend
      web3BioApiKey: undefined, // Remove from frontend  
      etherscanApiKey: undefined // Remove from frontend
    };
  }

  // Get public/publishable keys only
  getPublicConfig() {
    return {
      // Only return non-sensitive configuration
      apiBaseUrl: window.location.origin,
      githubApiUrl: 'https://api.github.com',
      web3BioApiUrl: 'https://api.web3.bio'
    };
  }

  // Validate API responses
  validateApiResponse(response: any, expectedFields: string[]): boolean {
    if (!response || typeof response !== 'object') return false;
    
    return expectedFields.every(field => 
      response.hasOwnProperty(field)
    );
  }
}

export const apiConfig = new SecureApiConfig();
