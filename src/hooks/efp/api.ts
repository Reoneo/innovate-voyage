
import { EfpPerson } from './types';

// Fetch user stats from EFP API
export async function fetchEfpStats(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/stats?cache=fresh`);
    const data = await response.json();
    return {
      followers: parseInt(data.followers_count || '0'),
      following: parseInt(data.following_count || '0')
    };
  } catch (error) {
    console.error('Error fetching EFP stats:', error);
    return { followers: 0, following: 0 };
  }
}

// Fetch followers from EFP API
export async function fetchEfpFollowers(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.followers || [];
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Fetch following from EFP API
export async function fetchEfpFollowing(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    return data.following || [];
  } catch (error) {
    console.error('Error fetching EFP following:', error);
    return [];
  }
}

// Fetch ENS data for an address
export async function fetchEnsData(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/ens`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching ENS data:', error);
    return null;
  }
}

// Process users with ENS data
export async function processUsers(users: any[]): Promise<EfpPerson[]> {
  return Promise.all(
    users.map(async (user) => {
      const address = user.data || user.address;
      const ensData = await fetchEnsData(address);
      return {
        address,
        ensName: ensData?.ens?.name,
        avatar: ensData?.ens?.avatar
      };
    })
  );
}
