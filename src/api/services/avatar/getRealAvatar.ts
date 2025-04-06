
import { avatarCache, fetchWeb3BioProfile, generateFallbackAvatar } from '../../utils/web3/index';

/**
 * Get real avatar for any domain type using web3.bio
 * @param identity The ENS name, address, or other web3 identity
 * @returns A URL to the avatar image or null
 */
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
      let avatar = profile.avatar;
      
      // Handle IPFS protocol for avatars
      if (avatar && avatar.startsWith("ipfs://")) {
        const cid = avatar.replace("ipfs://", "");
        avatar = `https://ipfs.io/ipfs/${cid}`;
      }
      
      console.log(`Found avatar via Web3.bio for ${identity}`);
      avatarCache[identity] = avatar;
      return avatar;
    }
    
    // If it's an ENS name, try multiple sources
    if (identity.endsWith('.eth')) {
      // Try the ENS metadata service (more reliable for newer ENS domains)
      try {
        // First try the ENS metadata service
        const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
        const metadataResponse = await fetch(metadataUrl, { 
          method: 'HEAD',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (metadataResponse.ok) {
          console.log(`Found avatar via ENS metadata for ${identity}`);
          avatarCache[identity] = metadataUrl;
          return metadataUrl;
        }
      } catch (ensError) {
        console.error(`Error fetching ENS avatar from metadata service for ${identity}:`, ensError);
      }
      
      // Try the Ethereum Avatar Service
      try {
        const ethAvatarUrl = `https://eth-avatar-api.herokuapp.com/${identity}`;
        const ethAvatarResponse = await fetch(ethAvatarUrl, { method: 'HEAD' });
        if (ethAvatarResponse.ok) {
          console.log(`Found avatar via Ethereum Avatar Service for ${identity}`);
          avatarCache[identity] = ethAvatarUrl;
          return ethAvatarUrl;
        }
      } catch (ethAvatarError) {
        console.error(`Error fetching from Ethereum Avatar Service for ${identity}:`, ethAvatarError);
      }
      
      // Try the official ENS Avatar API
      try {
        const ensAvatarUrl = `https://avatar.ens.domains/${identity}`;
        const ensAvatarResponse = await fetch(ensAvatarUrl, { method: 'HEAD' });
        if (ensAvatarResponse.ok) {
          // Check if the avatar is an IPFS URL and convert it
          let avatar = ensAvatarUrl;
          
          // Handle IPFS protocol
          try {
            const avatarData = await fetch(ensAvatarUrl);
            const avatarText = await avatarData.text();
            if (avatarText.startsWith("ipfs://")) {
              const cid = avatarText.replace("ipfs://", "");
              avatar = `https://ipfs.io/ipfs/${cid}`;
            }
          } catch (err) {
            console.error("Error processing ENS avatar:", err);
          }
          
          console.log(`Found avatar via ENS Avatar API for ${identity}`);
          avatarCache[identity] = avatar;
          return avatar;
        }
      } catch (ensAvatarError) {
        console.error(`Error fetching from ENS Avatar API for ${identity}:`, ensAvatarError);
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
            let avatar = boxData.avatar;
            
            // Handle IPFS protocol
            if (avatar && avatar.startsWith("ipfs://")) {
              const cid = avatar.replace("ipfs://", "");
              avatar = `https://ipfs.io/ipfs/${cid}`;
            }
            
            console.log(`Found .box avatar for ${identity}`);
            avatarCache[identity] = avatar;
            return avatar;
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
