
import { enforceRateLimit, getWeb3BioHeaders } from './rateLimiter';
import { REQUEST_DELAY_MS } from './config';
import { processWeb3BioProfileData } from './profileProcessor';
import type { Web3BioProfile } from '../../types/web3Types';

/**
 * Fetches profile data from web3.bio API
 * @param identity ENS name or Ethereum address
 * @returns Profile data or null if not found
 */
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  try {
    // Enforce rate limiting
    await enforceRateLimit(REQUEST_DELAY_MS);
    
    // Prepare the API URL
    const apiUrl = `https://api.web3.bio/profile/${identity}`;
    
    // Make the API request with proper authentication
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: getWeb3BioHeaders()
    });
    
    // Handle API errors
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No web3.bio profile found for ${identity}`);
        return null;
      }
      throw new Error(`Web3.bio API error: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Process the profile data
    return processWeb3BioProfileData(data, identity);
  } catch (error) {
    console.error('Error fetching web3.bio profile:', error);
    return null;
  }
}

/**
 * Fetch profile data - alias for backward compatibility
 */
export function fetchProfileData(identity: string): Promise<Web3BioProfile | null> {
  return fetchWeb3BioProfile(identity);
}

/**
 * Get profile by ID - alias for backward compatibility
 */
export function getProfileById(id: string): Promise<Web3BioProfile | null> {
  return fetchWeb3BioProfile(id);
}
