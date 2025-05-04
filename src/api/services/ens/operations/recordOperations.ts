
import { publicClient } from '../client/publicClient';

/**
 * Get ENS avatar using viem directly and fallbacks
 */
export async function getEnsAvatarUrl(ensName: string): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Getting avatar for ENS: ${ensName}`);
    
    // Try multiple methods to get avatar
    
    // Method 1: Use viem to get avatar (most reliable)
    try {
      const avatar = await publicClient.getEnsAvatar({
        name: ensName,
      });
      
      if (avatar) {
        console.log(`Avatar found using viem method for ${ensName}: ${avatar}`);
        return avatar;
      }
    } catch (viemError) {
      console.error(`Viem avatar fetch error for ${ensName}:`, viemError);
    }
    
    // Method 2: Try the ENS metadata service (more reliable for newer ENS domains)
    try {
      const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
      console.log(`Trying ENS metadata service: ${metadataUrl}`);
      
      const metadataResponse = await fetch(metadataUrl, { 
        method: 'HEAD',
        cache: 'no-store',
      });
      
      if (metadataResponse.ok) {
        console.log(`Found avatar via ENS metadata for ${ensName}: ${metadataUrl}`);
        return metadataUrl;
      }
    } catch (metadataError) {
      console.error(`Metadata service avatar error for ${ensName}:`, metadataError);
    }
    
    // Method 3: Try the Ethereum Avatar Service
    try {
      const ethAvatarUrl = `https://eth-avatar-api.herokuapp.com/${ensName}`;
      const ethAvatarResponse = await fetch(ethAvatarUrl, { method: 'HEAD' });
      if (ethAvatarResponse.ok) {
        console.log(`Found avatar via Ethereum Avatar Service for ${ensName}: ${ethAvatarUrl}`);
        return ethAvatarUrl;
      }
    } catch (ethAvatarError) {
      console.error(`ETH Avatar API error for ${ensName}:`, ethAvatarError);
    }
    
    // Method 4: Try the official ENS Avatar API
    try {
      const ensAvatarUrl = `https://avatar.ens.domains/${ensName}`;
      const ensAvatarResponse = await fetch(ensAvatarUrl, { method: 'HEAD' });
      if (ensAvatarResponse.ok) {
        console.log(`Found avatar via ENS Avatar API for ${ensName}: ${ensAvatarUrl}`);
        return ensAvatarUrl;
      }
    } catch (ensAvatarError) {
      console.error(`ENS Avatar API error for ${ensName}:`, ensAvatarError);
    }
    
    console.log(`No avatar found for ${ensName} through any method`);
    return null;
  } catch (error) {
    console.error(`Error getting avatar for ENS ${ensName}:`, error);
    return null;
  }
}

/**
 * Get specific text record from ENS
 */
export async function getEnsTextRecord(ensName: string, key: string): Promise<string | null> {
  try {
    if (!ensName || !key) return null;
    
    console.log(`Getting ${key} text record for ENS: ${ensName}`);
    
    // Use viem to get text record
    const value = await publicClient.getEnsText({
      name: ensName,
      key: key,
    });
    
    return value || null;
  } catch (error) {
    console.error(`Error getting ${key} text record for ENS ${ensName}:`, error);
    return null;
  }
}
