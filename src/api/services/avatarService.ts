
import { avatarCache, fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';
import { delay } from '../jobsApi';

// Get real avatar for an ENS name (both .eth and .box domains)
export async function getRealAvatar(ensName: string): Promise<string | null> {
  // Check cache first
  if (avatarCache[ensName]) {
    return avatarCache[ensName];
  }
  
  // If not in cache, fetch from API
  try {
    // Try Web3Bio API first - works for both .eth and .box domains
    const profile = await fetchWeb3BioProfile(ensName);
    if (profile && profile.avatar) {
      avatarCache[ensName] = profile.avatar;
      return profile.avatar;
    }
    
    // Generate a fallback avatar for all domains
    const randomSeed = ensName.split('.')[0].length * 3 + 10;
    const avatarUrl = `https://i.pravatar.cc/300?img=${randomSeed}`;
    avatarCache[ensName] = avatarUrl;
    return avatarUrl;
  } catch (error) {
    console.error(`Error fetching avatar for ${ensName}:`, error);
  }
  
  return null;
}
