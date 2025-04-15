
/**
 * Service for interacting with the Ethereum Follow Protocol API
 */

// Base URL for EthFollow API
const API_BASE_URL = 'https://api.ethfollow.xyz/api/v1';

/**
 * Fetch stats for a user (followers/following counts)
 * @param addressOrENS Ethereum address or ENS name
 */
export async function fetchFollowStats(addressOrENS: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${addressOrENS}/stats?live=true&cache=fresh`);
    
    if (!response.ok) {
      throw new Error(`Error fetching follow stats: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchFollowStats:', error);
    return {
      followers_count: "0",
      following_count: "0"
    };
  }
}

/**
 * Fetch followers for a user
 * @param addressOrENS Ethereum address or ENS name
 * @param limit Optional limit of results (default 50)
 * @param offset Optional offset for pagination
 */
export async function fetchFollowers(addressOrENS: string, limit = 50, offset = 0) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/${addressOrENS}/followers?limit=${limit}&offset=${offset}&cache=fresh`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching followers: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchFollowers:', error);
    return { followers: [] };
  }
}

/**
 * Fetch following for a user
 * @param addressOrENS Ethereum address or ENS name
 * @param limit Optional limit of results (default 50)
 * @param offset Optional offset for pagination
 */
export async function fetchFollowing(addressOrENS: string, limit = 50, offset = 0) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/${addressOrENS}/following?limit=${limit}&offset=${offset}&cache=fresh`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching following: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchFollowing:', error);
    return { following: [] };
  }
}

/**
 * Fetch ENS data for a user
 * @param addressOrENS Ethereum address or ENS name
 */
export async function fetchEnsData(addressOrENS: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${addressOrENS}/ens`);
    
    if (!response.ok) {
      throw new Error(`Error fetching ENS data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchEnsData:', error);
    return { ens: null };
  }
}
