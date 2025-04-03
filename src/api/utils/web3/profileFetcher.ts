
import { enforceRateLimit, getWeb3BioHeaders } from './rateLimiter';
import { REQUEST_DELAY_MS } from './config';
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
    
    // Extract and normalize the profile data
    const profile: Web3BioProfile = {
      address: data.address || '',
      avatar: data.avatar || '',
      description: data.description || '',
      github: data.github || '',
      twitter: data.twitter || '',
      telegram: data.telegram || '',
      lens: data.lens || '',
      farcaster: data.farcaster || '',
      ens: data.ens || '',
      unstoppableDomains: data.unstoppableDomains || '',
      website: data.website || '',
      linkedin: data.linkedin || '',
      email: data.email || ''
    };
    
    return profile;
  } catch (error) {
    console.error('Error fetching web3.bio profile:', error);
    return null;
  }
}
