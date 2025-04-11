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
    
    // Handle EIP155 formatted avatar URIs
    if (identity.startsWith('eip155:1/erc721:')) {
      try {
        // Try to fetch the NFT image directly using the token ID
        const parts = identity.split('/');
        const nftInfo = identity.split(':');
        
        // Extract contract address from the EIP155 format
        let contractAddress = '';
        if (nftInfo.length >= 3) {
          contractAddress = nftInfo[2].split('/')[0];
        }
        
        // Extract token ID - may be the last part of the string
        let tokenId = '';
        if (parts.length >= 3) {
          tokenId = parts[2];
        } else if (nftInfo.length >= 4) {
          tokenId = nftInfo[3];
        }
        
        console.log(`Parsed EIP155: Contract=${contractAddress}, TokenId=${tokenId}`);
        
        if (contractAddress && tokenId) {
          // Try the ENS avatar service with the EIP155 format directly
          const ensAvatarUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
          try {
            const response = await fetch(ensAvatarUrl, { method: 'HEAD' });
            if (response.ok) {
              console.log(`Found avatar via ENS metadata for EIP155 ${identity}`);
              avatarCache[identity] = ensAvatarUrl;
              return ensAvatarUrl;
            }
          } catch (error) {
            console.error(`Error fetching from ENS metadata for ${identity}:`, error);
          }
          
          // Try OpenSea API format
          const openseaUrl = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/?format=json`;
          try {
            const response = await fetch(openseaUrl);
            if (response.ok) {
              const data = await response.json();
              if (data.image_url) {
                console.log(`Found avatar via OpenSea for ${identity}`);
                avatarCache[identity] = data.image_url;
                return data.image_url;
              }
            }
          } catch (error) {
            console.error(`Error fetching from OpenSea for ${identity}:`, error);
          }
          
          // Try NFT.Storage gateway format
          const nftStorageUrl = `https://nftstorage.link/ipfs/${tokenId}`;
          try {
            const response = await fetch(nftStorageUrl, { method: 'HEAD' });
            if (response.ok) {
              console.log(`Found avatar via NFT.Storage for ${identity}`);
              avatarCache[identity] = nftStorageUrl;
              return nftStorageUrl;
            }
          } catch (error) {
            console.error(`Error fetching from NFT.Storage for ${identity}:`, error);
          }
          
          // Try direct IPFS gateway using the token ID if it looks like an IPFS hash
          if (tokenId && tokenId.length > 30) {
            const ipfsUrl = `https://ipfs.io/ipfs/${tokenId}`;
            try {
              const response = await fetch(ipfsUrl, { method: 'HEAD' });
              if (response.ok) {
                console.log(`Found avatar via IPFS for ${identity}`);
                avatarCache[identity] = ipfsUrl;
                return ipfsUrl;
              }
            } catch (error) {
              console.error(`Error fetching from IPFS for ${identity}:`, error);
            }
          }
          
          // Try direct ipfs:// URI format conversion
          if (identity.includes('ipfs://')) {
            const ipfsPath = identity.replace('ipfs://', '');
            const ipfsUrl = `https://ipfs.io/ipfs/${ipfsPath}`;
            try {
              const response = await fetch(ipfsUrl, { method: 'HEAD' });
              if (response.ok) {
                console.log(`Found avatar via IPFS gateway for ${identity}`);
                avatarCache[identity] = ipfsUrl;
                return ipfsUrl;
              }
            } catch (error) {
              console.error(`Error fetching from IPFS gateway for ${identity}:`, error);
            }
          }
        }
      } catch (eipError) {
        console.error(`Error processing EIP155 avatar for ${identity}:`, eipError);
      }
    }
    
    // Try Web3Bio API first - works for all domain types
    const profile = await fetchWeb3BioProfile(identity);
    if (profile && profile.avatar) {
      console.log(`Found avatar via Web3.bio for ${identity}`);
      avatarCache[identity] = profile.avatar;
      return profile.avatar;
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
          console.log(`Found avatar via ENS Avatar API for ${identity}`);
          avatarCache[identity] = ensAvatarUrl;
          return ensAvatarUrl;
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
            console.log(`Found .box avatar for ${identity}`);
            avatarCache[identity] = boxData.avatar;
            return boxData.avatar;
          }
        }
      } catch (boxError) {
        console.error(`Error fetching .box avatar for ${identity}:`, boxError);
      }
    }
    
    // If the avatar is a direct URL to an image (common for custom avatars)
    if (identity.startsWith('http') && 
        (identity.endsWith('.jpg') || identity.endsWith('.jpeg') || 
         identity.endsWith('.png') || identity.endsWith('.gif') ||
         identity.endsWith('.webp') || identity.endsWith('.svg'))) {
      console.log(`Using direct image URL for avatar: ${identity}`);
      avatarCache[identity] = identity;
      return identity;
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
