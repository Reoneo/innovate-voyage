
import { avatarCache, fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';
import { delay } from '../jobsApi';

// Get real avatar for any domain type using web3.bio
export async function getRealAvatar(identity: string): Promise<string | null> {
  if (!identity) return null;
  
  // Check cache first
  if (avatarCache[identity]) {
    return avatarCache[identity];
  }
  
  // If not in cache, fetch from API
  try {
    // Try Web3Bio API first - works for all domain types
    const profile = await fetchWeb3BioProfile(identity);
    if (profile && profile.avatar) {
      avatarCache[identity] = profile.avatar;
      return profile.avatar;
    }
    
    // If it's an ENS name, try the metadata.ens.domains fallback
    if (identity.endsWith('.eth')) {
      try {
        const avatarUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
        const response = await fetch(avatarUrl, { method: 'HEAD' });
        if (response.ok) {
          avatarCache[identity] = avatarUrl;
          return avatarUrl;
        }
      } catch (ensError) {
        console.error(`Error fetching ENS avatar from metadata service for ${identity}:`, ensError);
      }
    }
    
    // Generate a deterministic fallback avatar
    let seed = 0;
    for (let i = 0; i < identity.length; i++) {
      seed += identity.charCodeAt(i);
    }
    seed = seed % 30 + 1; // Range 1-30
    
    const avatarUrl = `https://i.pravatar.cc/300?img=${seed}`;
    avatarCache[identity] = avatarUrl;
    return avatarUrl;
  } catch (error) {
    console.error(`Error fetching avatar for ${identity}:`, error);
  }
  
  return null;
}
