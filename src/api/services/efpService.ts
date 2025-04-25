
import { EfpPerson } from '@/hooks/useEfpStats';

// Fetch account data from EFP API
export async function fetchEfpAccountData(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/account`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP account:', error);
    return null;
  }
}

// Fetch followers from EFP API
export async function fetchEfpFollowers(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Fetch following from EFP API
export async function fetchEfpFollowing(ensOrAddress: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP following:', error);
    return [];
  }
}

// Fetch user stats from EFP API
export async function fetchEfpStats(ensOrAddress: string): Promise<any> {
  try {
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/stats`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching EFP stats:', error);
    return { followerCount: 0, followingCount: 0 };
  }
}
