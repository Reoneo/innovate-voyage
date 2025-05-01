
import { EfpPerson } from './types';
import { fetchWeb3BioProfile } from '@/api/utils/web3';
import { resolveAddressToEns } from '@/utils/ensResolution';

export async function fetchEfpStats(address: string) {
  try {
    const response = await fetch(`https://api.ethereum-follow-protocol.com/v1/address/${address}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch EFP stats: ${response.status}`);
    }
    const data = await response.json();
    return {
      followers: data.followersCount || 0,
      following: data.followingCount || 0
    };
  } catch (error) {
    console.error('Error fetching EFP stats:', error);
    return { followers: 0, following: 0 };
  }
}

export async function fetchEfpFollowers(
  address: string, 
  options: { signal?: AbortSignal, limit?: number } = {}
): Promise<any[]> {
  try {
    const { signal, limit = 1000 } = options;
    const response = await fetch(
      `https://api.ethereum-follow-protocol.com/v1/address/${address}/followers?limit=${limit}`,
      { signal }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch EFP followers: ${response.status}`);
    }
    const data = await response.json();
    return data.followers || [];
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Fetch followers aborted');
    } else {
      console.error('Error fetching EFP followers:', error);
    }
    return [];
  }
}

export async function fetchEfpFollowing(
  address: string,
  options: { signal?: AbortSignal, limit?: number } = {}
): Promise<any[]> {
  try {
    const { signal, limit = 1000 } = options;
    const response = await fetch(
      `https://api.ethereum-follow-protocol.com/v1/address/${address}/following?limit=${limit}`,
      { signal }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch EFP following: ${response.status}`);
    }
    const data = await response.json();
    return data.following || [];
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Fetch following aborted');
    } else {
      console.error('Error fetching EFP following:', error);
    }
    return [];
  }
}

// Process EFP users with ENS data and avatars in batches
export async function processUsers(
  users: any[], 
  options: { signal?: AbortSignal } = {}
): Promise<EfpPerson[]> {
  if (!users || users.length === 0) return [];
  
  const { signal } = options;
  
  // Process in batches of 25 to avoid rate limiting
  const batchSize = 25;
  const result: EfpPerson[] = [];
  
  for (let i = 0; i < users.length; i += batchSize) {
    if (signal?.aborted) {
      throw new DOMException('Processing aborted', 'AbortError');
    }
    
    const batch = users.slice(i, i + batchSize);
    const batchPromises = batch.map(async (user) => {
      const address = user.address;
      try {
        // Try to get profile from web3.bio
        const profile = await fetchWeb3BioProfile(address);
        if (profile && profile.name) {
          return {
            address,
            ensName: profile.name.endsWith('.eth') ? profile.name : undefined,
            avatar: profile.avatar
          };
        }
        
        // Fallback to ENS resolution
        const ensResult = await resolveAddressToEns(address);
        return {
          address,
          ensName: ensResult?.ensName,
          avatar: undefined
        };
      } catch (error) {
        console.error(`Error processing user ${address}:`, error);
        return { address };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    result.push(...batchResults);
    
    // Add a small delay between batches to prevent rate limiting
    if (i + batchSize < users.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return result;
}
