
import { InputValidator } from '../../../../utils/inputValidation';
import { secureFetch } from '../../../utils/web3/config';

/**
 * Fetch domains from web3.bio API with enhanced security
 */
export async function fetchDomainsFromWeb3Bio(address: string): Promise<string[]> {
  try {
    // Validate input address
    if (!InputValidator.isValidEthereumAddress(address)) {
      console.warn('Invalid Ethereum address provided to Web3Bio provider');
      return [];
    }

    // Use secure API endpoint (should be proxied through backend)
    const url = `https://api.web3.bio/profile/${address}?nocache=${Date.now()}`;
    
    // SECURITY NOTE: This should be proxied through backend to hide API keys
    const response = await secureFetch(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn(`Web3.bio API returned status ${response.status} for address ${address.substring(0, 6)}...${address.substring(38)}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      if (data.identity && typeof data.identity === 'string') {
        // Validate and sanitize the identity
        const sanitizedIdentity = InputValidator.sanitizeHtml(data.identity);
        return InputValidator.isValidEnsName(sanitizedIdentity) ? [sanitizedIdentity] : [];
      }
      return [];
    }
    
    // Extract and validate all identities
    const domains: string[] = [];
    
    for (const profile of data) {
      if (profile.identity && typeof profile.identity === 'string') {
        const sanitizedIdentity = InputValidator.sanitizeHtml(profile.identity);
        if (InputValidator.isValidEnsName(sanitizedIdentity)) {
          domains.push(sanitizedIdentity);
        }
      }
      
      // Process aliases with validation
      if (profile.aliases && Array.isArray(profile.aliases)) {
        for (const alias of profile.aliases) {
          if (typeof alias === 'string') {
            const sanitizedAlias = InputValidator.sanitizeHtml(alias);
            
            if (sanitizedAlias.includes(',')) {
              const parts = sanitizedAlias.split(',');
              if (parts.length === 2 && InputValidator.isValidEnsName(parts[1])) {
                if (!domains.includes(parts[1])) {
                  domains.push(parts[1]);
                }
              }
            } else if (InputValidator.isValidEnsName(sanitizedAlias)) {
              if (!domains.includes(sanitizedAlias)) {
                domains.push(sanitizedAlias);
              }
            }
          }
        }
      }
    }
    
    console.log(`Web3.bio returned ${domains.length} validated domains for ${address.substring(0, 6)}...${address.substring(38)}`);
    return domains;
  } catch (error) {
    console.error("Secure error handling for web3.bio:", error);
    return [];
  }
}
