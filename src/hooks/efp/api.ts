
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

// Fetch followers from EFP API with pagination support
export async function fetchEfpFollowers(ensOrAddress: string, limit = 100): Promise<any[]> {
  try {
    // Fetch initial batch
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    
    const followers = data.followers || [];
    
    // If we have a lot of followers and need more data, implement pagination
    if (followers.length === limit && data.total_count > limit) {
      const remainingBatches = Math.min(Math.ceil((data.total_count - limit) / limit), 9); // Cap at 10 batches total (1000 users)
      
      const additionalRequests = [];
      for (let i = 1; i <= remainingBatches; i++) {
        const offset = i * limit;
        additionalRequests.push(
          fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}&offset=${offset}&sort=latest`)
            .then(res => res.json())
            .then(data => data.followers || [])
            .catch(err => {
              console.error(`Error fetching followers batch ${i}:`, err);
              return [];
            })
        );
      }
      
      const additionalBatches = await Promise.all(additionalRequests);
      return [...followers, ...additionalBatches.flat()];
    }
    
    return followers;
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Fetch following from EFP API with pagination support
export async function fetchEfpFollowing(ensOrAddress: string, limit = 100): Promise<any[]> {
  try {
    // Fetch initial batch
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}&sort=latest`
    );
    const data = await response.json();
    
    const following = data.following || [];
    
    // If we have a lot of following and need more data, implement pagination
    if (following.length === limit && data.total_count > limit) {
      const remainingBatches = Math.min(Math.ceil((data.total_count - limit) / limit), 9); // Cap at 10 batches total (1000 users)
      
      const additionalRequests = [];
      for (let i = 1; i <= remainingBatches; i++) {
        const offset = i * limit;
        additionalRequests.push(
          fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}&offset=${offset}&sort=latest`)
            .then(res => res.json())
            .then(data => data.following || [])
            .catch(err => {
              console.error(`Error fetching following batch ${i}:`, err);
              return [];
            })
        );
      }
      
      const additionalBatches = await Promise.all(additionalRequests);
      return [...following, ...additionalBatches.flat()];
    }
    
    return following;
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
  // To avoid rate limiting, process in batches of 10
  const batchSize = 10;
  const results: EfpPerson[] = [];
  
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    const batchPromises = batch.map(async (user) => {
      const address = user.data || user.address;
      const ensData = await fetchEnsData(address);
      return {
        address,
        ensName: ensData?.ens?.name,
        avatar: ensData?.ens?.avatar
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < users.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  return results;
}
