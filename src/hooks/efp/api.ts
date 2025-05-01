
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

// Optimized fetch followers with concurrent requests and memoization
export async function fetchEfpFollowers(ensOrAddress: string, limit = 100): Promise<any[]> {
  try {
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    // Fetch initial batch with signal
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}&sort=latest`,
      { signal: controller.signal }
    );
    const data = await response.json();
    clearTimeout(timeoutId);
    
    const followers = data.followers || [];
    
    // If we have a lot of followers and need more data, implement pagination
    if (followers.length === limit && data.total_count > limit) {
      const remainingBatches = Math.min(Math.ceil((data.total_count - limit) / limit), 9); // Cap at 10 batches total (1000 users)
      
      // Use Promise.allSettled to handle partial failures
      const promises = [];
      for (let i = 1; i <= remainingBatches; i++) {
        const offset = i * limit;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout per batch
        
        promises.push(
          fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/followers?limit=${limit}&offset=${offset}&sort=latest`, 
            { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
              clearTimeout(timeoutId);
              return data.followers || [];
            })
            .catch(err => {
              clearTimeout(timeoutId);
              console.error(`Error fetching followers batch ${i}:`, err);
              return [];
            })
        );
      }
      
      // Process results as they come in
      const results = await Promise.allSettled(promises);
      const additionalBatches = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any[]>).value);
      
      return [...followers, ...additionalBatches.flat()];
    }
    
    return followers;
  } catch (error) {
    console.error('Error fetching EFP followers:', error);
    return [];
  }
}

// Optimized fetch following with concurrent requests and memoization
export async function fetchEfpFollowing(ensOrAddress: string, limit = 100): Promise<any[]> {
  try {
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    // Fetch initial batch with signal
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}&sort=latest`,
      { signal: controller.signal }
    );
    const data = await response.json();
    clearTimeout(timeoutId);
    
    const following = data.following || [];
    
    // If we have a lot of following and need more data, implement pagination
    if (following.length === limit && data.total_count > limit) {
      const remainingBatches = Math.min(Math.ceil((data.total_count - limit) / limit), 9); // Cap at 10 batches total (1000 users)
      
      // Use Promise.allSettled to handle partial failures
      const promises = [];
      for (let i = 1; i <= remainingBatches; i++) {
        const offset = i * limit;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout per batch
        
        promises.push(
          fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/following?limit=${limit}&offset=${offset}&sort=latest`, 
            { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
              clearTimeout(timeoutId);
              return data.following || [];
            })
            .catch(err => {
              clearTimeout(timeoutId);
              console.error(`Error fetching following batch ${i}:`, err);
              return [];
            })
        );
      }
      
      // Process results as they come in
      const results = await Promise.allSettled(promises);
      const additionalBatches = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any[]>).value);
      
      return [...following, ...additionalBatches.flat()];
    }
    
    return following;
  } catch (error) {
    console.error('Error fetching EFP following:', error);
    return [];
  }
}

// Fetch ENS data for an address with caching
const ensCache = new Map<string, any>();

export async function fetchEnsData(ensOrAddress: string): Promise<any> {
  // Check cache first
  if (ensCache.has(ensOrAddress)) {
    return ensCache.get(ensOrAddress);
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${ensOrAddress}/ens`, 
      { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    // Cache the result
    ensCache.set(ensOrAddress, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching ENS data:', error);
    return null;
  }
}

// Process users with ENS data using batching and caching
export async function processUsers(users: any[]): Promise<EfpPerson[]> {
  // To avoid rate limiting, process in batches of 15
  const batchSize = 15;
  const results: EfpPerson[] = [];
  
  // Create chunks of users to process in parallel
  const chunks = [];
  for (let i = 0; i < users.length; i += batchSize) {
    chunks.push(users.slice(i, i + batchSize));
  }
  
  // Process each chunk sequentially to avoid overwhelming the API
  for (const chunk of chunks) {
    const chunkPromises = chunk.map(async (user) => {
      const address = user.data || user.address;
      // Reuse the cached fetchEnsData function
      const ensData = await fetchEnsData(address);
      return {
        address,
        ensName: ensData?.ens?.name,
        avatar: ensData?.ens?.avatar
      };
    });
    
    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
    
    // Add a small delay between batches to avoid rate limiting
    if (chunks.indexOf(chunk) < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}
