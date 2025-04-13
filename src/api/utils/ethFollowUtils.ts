
import { enforceRateLimit } from './web3/rateLimiter';

const ETHFOLLOW_API_BASE_URL = 'https://api.ethfollow.xyz/api/v1';

/**
 * Fetches follower and following counts for a wallet address or ENS name
 * @param addressOrEns Ethereum wallet address or ENS name
 * @returns Object containing follower and following counts
 */
export async function fetchFollowerStats(addressOrEns: string) {
  if (!addressOrEns) {
    return { followers_count: '0', following_count: '0' };
  }
  
  try {
    // Apply rate limiting to prevent excessive API calls
    await enforceRateLimit(250);
    
    const response = await fetch(`${ETHFOLLOW_API_BASE_URL}/users/${addressOrEns}/stats`);
    
    if (!response.ok) {
      console.error(`EthFollow API error: ${response.status} ${response.statusText}`);
      return { followers_count: '0', following_count: '0' };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching EthFollow stats:', error);
    return { followers_count: '0', following_count: '0' };
  }
}

/**
 * Fetches followers for a wallet address or ENS name
 * @param addressOrEns Ethereum wallet address or ENS name
 * @param limit Optional number of records to return
 * @param offset Optional starting index for records
 * @returns Object containing followers array
 */
export async function fetchFollowers(addressOrEns: string, limit = 20, offset = 0) {
  if (!addressOrEns) {
    return { followers: [] };
  }
  
  try {
    // Apply rate limiting to prevent excessive API calls
    await enforceRateLimit(250);
    
    const response = await fetch(
      `${ETHFOLLOW_API_BASE_URL}/users/${addressOrEns}/followers?limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      console.error(`EthFollow API error: ${response.status} ${response.statusText}`);
      return { followers: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching EthFollow followers:', error);
    return { followers: [] };
  }
}

/**
 * Fetches following accounts for a wallet address or ENS name
 * @param addressOrEns Ethereum wallet address or ENS name
 * @param limit Optional number of records to return
 * @param offset Optional starting index for records
 * @returns Object containing following array
 */
export async function fetchFollowing(addressOrEns: string, limit = 20, offset = 0) {
  if (!addressOrEns) {
    return { following: [] };
  }
  
  try {
    // Apply rate limiting to prevent excessive API calls
    await enforceRateLimit(250);
    
    const response = await fetch(
      `${ETHFOLLOW_API_BASE_URL}/users/${addressOrEns}/following?limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      console.error(`EthFollow API error: ${response.status} ${response.statusText}`);
      return { following: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching EthFollow following:', error);
    return { following: [] };
  }
}

/**
 * Fetches ENS data for a wallet address or ENS name
 * @param addressOrEns Ethereum wallet address or ENS name
 * @returns Object containing ENS data
 */
export async function fetchEnsData(addressOrEns: string) {
  if (!addressOrEns) {
    return { ens: null };
  }
  
  try {
    // Apply rate limiting to prevent excessive API calls
    await enforceRateLimit(250);
    
    const response = await fetch(`${ETHFOLLOW_API_BASE_URL}/users/${addressOrEns}/ens`);
    
    if (!response.ok) {
      console.error(`EthFollow API error: ${response.status} ${response.statusText}`);
      return { ens: null };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching EthFollow ENS data:', error);
    return { ens: null };
  }
}
