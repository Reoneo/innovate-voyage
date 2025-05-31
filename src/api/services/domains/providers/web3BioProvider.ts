
import { enforceRateLimit, getSafeHeaders } from '../../../utils/web3/rateLimiter';
import { getServerConfig } from '../../../utils/web3/secureConfig';

const serverConfig = getServerConfig();

/**
 * Web3BioProvider class for handling Web3.bio API calls
 */
export class Web3BioProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchProfile(input: string): Promise<any> {
    try {
      await enforceRateLimit(300);
      
      const url = `https://api.web3.bio/profile/${input}?nocache=${Date.now()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.warn(`Web3.bio API returned status ${response.status} for input ${input}`);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching from web3.bio:", error);
      return null;
    }
  }
}

/**
 * Fetch domains from web3.bio API
 */
export async function fetchDomainsFromWeb3Bio(address: string): Promise<string[]> {
  try {
    // Add a cache-busting parameter to prevent stale data
    const url = `https://api.web3.bio/profile/${address}?nocache=${Date.now()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${serverConfig.WEB3_BIO_API_KEY}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn(`Web3.bio API returned status ${response.status} for address ${address}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      if (data.identity) {
        return [data.identity];
      }
      return [];
    }
    
    // Extract all identities
    const domains: string[] = [];
    
    for (const profile of data) {
      if (profile.identity) {
        domains.push(profile.identity);
      }
      
      // Also extract aliases if available
      if (profile.aliases && Array.isArray(profile.aliases)) {
        for (const alias of profile.aliases) {
          // Handle different alias formats
          if (typeof alias === 'string') {
            if (alias.includes(',')) {
              // Format: "platform,name"
              const parts = alias.split(',');
              if (parts.length === 2 && parts[1].includes('.')) {
                if (!domains.includes(parts[1])) {
                  domains.push(parts[1]);
                }
              }
            } else if (alias.includes('.')) {
              // Direct domain name
              if (!domains.includes(alias)) {
                domains.push(alias);
              }
            }
          }
        }
      }
    }
    
    console.log(`Web3.bio returned ${domains.length} domains for ${address}:`, domains);
    return domains;
  } catch (error) {
    console.error("Error fetching from web3.bio:", error);
    return [];
  }
}

/**
 * Fetch Web3.bio profile data
 */
export async function fetchWeb3BioProfile(input: string): Promise<any> {
  const provider = new Web3BioProvider(serverConfig.WEB3_BIO_API_KEY);
  return provider.fetchProfile(input);
}
