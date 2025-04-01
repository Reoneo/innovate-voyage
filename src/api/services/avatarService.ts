
import { avatarCache, fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3/index';
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
    console.log(`Fetching avatar for ${identity}`);
    
    // Try Web3Bio API first - works for all domain types
    const profile = await fetchWeb3BioProfile(identity);
    if (profile && profile.avatar) {
      console.log(`Found avatar via Web3.bio for ${identity}`);
      avatarCache[identity] = profile.avatar;
      return profile.avatar;
    }
    
    // If it's an ENS name, try the metadata.ens.domains fallback
    if (identity.endsWith('.eth')) {
      try {
        const avatarUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
        const response = await fetch(avatarUrl, { 
          method: 'HEAD',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          console.log(`Found avatar via ENS metadata for ${identity}`);
          avatarCache[identity] = avatarUrl;
          return avatarUrl;
        }
      } catch (ensError) {
        console.error(`Error fetching ENS avatar from metadata service for ${identity}:`, ensError);
      }
    }
    
    // For .box domains, try specific approach
    if (identity.endsWith('.box')) {
      try {
        // Try direct web3.bio approach for .box domains
        const boxProfile = await fetch(`https://api.web3.bio/profile/dotbit/${identity}?nocache=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNDkyNzREIiwiZXhwIjoyMjA1OTExMzI0LCJyb2xlIjo2fQ.dGQ7o_ItgDU8X_MxBlja4in7qvGWtmKXjqhCHq2gX20`,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (boxProfile.ok) {
          const boxData = await boxProfile.json();
          if (boxData && boxData.avatar) {
            console.log(`Found .box avatar for ${identity}`);
            avatarCache[identity] = boxData.avatar;
            return boxData.avatar;
          }
        }
      } catch (boxError) {
        console.error(`Error fetching .box avatar for ${identity}:`, boxError);
      }
    }
    
    // Generate a deterministic fallback avatar
    console.log(`Using fallback avatar for ${identity}`);
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
    return generateFallbackAvatar();
  }
}
