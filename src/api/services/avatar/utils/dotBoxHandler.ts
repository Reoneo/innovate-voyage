
import { ethers } from 'ethers';
import { avatarCache } from '../../../utils/web3/index';

// Cache for optimism provider to avoid creating multiple instances
let optimismProvider: ethers.JsonRpcProvider | null = null;

/**
 * Creates or returns a cached Optimism provider with CCIP-Read enabled
 */
function getOptimismProvider(): ethers.JsonRpcProvider {
  if (!optimismProvider) {
    // List of Optimism RPCs to try (with fallbacks)
    const OPTIMISM_RPC_URLS = [
      "https://optimism-mainnet.public.blastapi.io", // Public endpoint with CCIP-Read support
      "https://mainnet.optimism.io",
      "https://opt-mainnet.g.alchemy.com/v2/demo" // Demo key for fallback
    ];
    
    // Create provider with chain ID 10 (Optimism)
    optimismProvider = new ethers.JsonRpcProvider(OPTIMISM_RPC_URLS[0], { name: "optimism", chainId: 10 });
    console.log("Created Optimism provider with CCIP-Read support");
  }
  
  return optimismProvider;
}

/**
 * Handles fetching avatars for .box domains using CCIP-Read and ENSIP-10
 * @param identity The .box domain name
 * @returns URL of the avatar or null if not found
 */
export async function handleDotBoxAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching .box avatar for ${identity} using CCIP-Read`);
    
    // Check cache first
    if (avatarCache[identity]) {
      console.log(`Using cached avatar for ${identity}`);
      return avatarCache[identity];
    }
    
    // Use CCIP-Read approach with Optimism provider
    const provider = getOptimismProvider();
    
    // Get resolver for the .box domain (should return the OffchainResolver)
    console.log(`Getting resolver for ${identity}`);
    const resolver = await provider.getResolver(identity);
    
    if (!resolver) {
      console.log(`No resolver found for ${identity}, trying fallback methods`);
      return fallbackBoxAvatarLookup(identity);
    }
    
    // Try to get the avatar text record using CCIP-Read
    try {
      console.log(`Reading avatar text record for ${identity}`);
      const avatar = await resolver.getText("avatar");
      
      if (avatar) {
        console.log(`Found avatar for ${identity} via CCIP-Read: ${avatar}`);
        avatarCache[identity] = avatar;
        return avatar;
      }
    } catch (error) {
      console.error(`CCIP-Read error for ${identity}:`, error);
      // Continue to fallback methods
    }
    
    // If CCIP-Read fails, try fallback methods
    return fallbackBoxAvatarLookup(identity);
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    return fallbackBoxAvatarLookup(identity);
  }
}

/**
 * Fallback methods to get .box avatars if CCIP-Read fails
 */
async function fallbackBoxAvatarLookup(identity: string): Promise<string | null> {
  try {
    // Fallback 1: Try web3.bio API
    console.log(`Trying web3.bio API for ${identity}`);
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
        console.log(`Found .box avatar via web3.bio for ${identity}`);
        avatarCache[identity] = boxData.avatar;
        return boxData.avatar;
      }
    }
    
    // Fallback 2: Try .bit API
    console.log(`Trying .bit API for ${identity}`);
    const bitProfile = await fetch(`https://did.id/v1/account/${identity}`);
    if (bitProfile.ok) {
      const bitData = await bitProfile.json();
      if (bitData?.data?.avatar) {
        console.log(`Found .box avatar via .bit for ${identity}`);
        avatarCache[identity] = bitData.data.avatar;
        return bitData.data.avatar;
      }
    }
    
    console.log(`No avatar found for ${identity} using any method`);
    return null;
  } catch (error) {
    console.error(`Error in fallback lookup for ${identity}:`, error);
    return null;
  }
}
