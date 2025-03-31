
import { avatarCache, fetchWeb3BioProfile, generateFallbackAvatar, normalizeIdentity } from '../utils/web3Utils';
import { delay } from '../jobsApi';

// Get real avatar for an ENS name (both .eth and .box domains)
export async function getRealAvatar(ensName: string): Promise<string | null> {
  if (!ensName) return null;
  
  const normalizedEns = normalizeIdentity(ensName);
  
  // Check cache first
  if (avatarCache[normalizedEns]) {
    return avatarCache[normalizedEns];
  }
  
  // If not in cache, fetch from API
  try {
    // Try Web3Bio API first - works for both .eth and .box domains
    const profile = await fetchWeb3BioProfile(normalizedEns);
    if (profile && profile.avatar) {
      avatarCache[normalizedEns] = profile.avatar;
      return profile.avatar;
    }
    
    // No avatar found via API, generate deterministic fallback based on the name
    // This ensures the same name always gets the same avatar
    let seed;
    if (normalizedEns.includes('.')) {
      // Create a deterministic seed based on the domain name
      const namePart = normalizedEns.split('.')[0];
      seed = Array.from(namePart).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 30 + 1;
    } else {
      // For addresses, use a different approach
      seed = (parseInt(normalizedEns.slice(-6), 16) % 30) + 1;
    }
    
    const avatarUrl = `https://i.pravatar.cc/300?img=${seed}`;
    avatarCache[normalizedEns] = avatarUrl;
    return avatarUrl;
  } catch (error) {
    console.error(`Error fetching avatar for ${normalizedEns}:`, error);
    
    // Generate fallback on error
    const avatarUrl = generateFallbackAvatar();
    avatarCache[normalizedEns] = avatarUrl;
    return avatarUrl;
  }
}
