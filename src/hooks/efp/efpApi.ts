
/**
 * API functions for Ethereum Follow Protocol
 */

// Base API URL for EthIdentityKit
const EFK_API_BASE = "https://api.ethfollow.xyz/api/v1";

// Fetch user stats from EFK API
export async function fetchEfpStats(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`${EFK_API_BASE}/users/${ensOrAddress}/stats?cache=fresh`);
    const data = await response.json();
    return {
      followers: parseInt(data.followers_count || '0'),
      following: parseInt(data.following_count || '0'),
      mutualFollows: parseInt(data.mutual_follows_count || '0')
    };
  } catch (error) {
    console.error('Error fetching EFP stats:', error);
    return { followers: 0, following: 0, mutualFollows: 0 };
  }
}

// Fetch followers from EFK API
export async function fetchEfpFollowers(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `${EFK_API_BASE}/users/${ensOrAddress}/followers?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.followers || [];
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Fetch following from EFK API
export async function fetchEfpFollowing(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `${EFK_API_BASE}/users/${ensOrAddress}/following?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.following || [];
  } catch (error) {
    console.error('Error fetching EFP following:', error);
    return [];
  }
}

// Fetch mutual follows
export async function fetchEfpMutualFollows(address1: string, address2: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${EFK_API_BASE}/users/${address1}/mutual-follows/${address2}?limit=50`
    );
    const data = await response.json();
    return data.mutual_follows || [];
  } catch (error) {
    console.error('Error fetching mutual follows:', error);
    return [];
  }
}

// Fetch ENS data for an address
export async function fetchEnsData(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`${EFK_API_BASE}/users/${ensOrAddress}/ens`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching ENS data:', error);
    return null;
  }
}

// Check if a user is following another user
export async function checkIsFollowing(follower: string, followee: string): Promise<boolean> {
  try {
    const response = await fetch(`${EFK_API_BASE}/users/${follower}/follows/${followee}`);
    const data = await response.json();
    return data.follows === true;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}
