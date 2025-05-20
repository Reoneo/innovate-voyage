
import { mainnetProvider } from '../ethereumProviders';
import { getRealAvatar } from '../../api/services/avatarService';
import { ccipReadEnabled } from './ccipReadHandler';

// Cache for ENS avatars and bios
const ensAvatarCache: Record<string, string | null> = {};
const ensBioCache: Record<string, string | null> = {};

/**
 * Gets avatar for an ENS name
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet'): Promise<string | null> {
  try {
    // Check cache first
    if (ensName in ensAvatarCache) {
      return ensAvatarCache[ensName];
    }
    
    console.log(`Getting avatar for ${ensName}`);
    
    // Special handling for .box domains
    if (ensName.endsWith('.box')) {
      console.log(`Using CCIP-Read to get .box avatar for ${ensName}`);
      const boxData = await ccipReadEnabled.resolveDotBit(ensName);
      
      if (boxData && boxData.avatar) {
        console.log(`Got .box avatar from CCIP-Read: ${boxData.avatar}`);
        ensAvatarCache[ensName] = boxData.avatar;
        return boxData.avatar;
      }
    }
    
    // Try the ENS metadata service first (most reliable source)
    try {
      const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
      const metadataResponse = await fetch(metadataUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      });
      
      if (metadataResponse.ok) {
        console.log(`Found avatar via ENS metadata for ${ensName}`);
        ensAvatarCache[ensName] = metadataUrl;
        return metadataUrl;
      }
    } catch (metadataError) {
      console.warn(`Error fetching from ENS metadata for ${ensName}:`, metadataError);
    }
    
    // Fallback: Try to use resolver directly - only for ENS domains on mainnet
    if (ensName.endsWith('.eth')) {
      try {
        const provider = mainnetProvider;
        const resolver = await provider.getResolver(ensName);
        
        if (resolver) {
          console.log(`Got resolver for ${ensName}`);
          const avatar = await resolver.getText('avatar');
          
          if (avatar) {
            console.log(`Got avatar for ${ensName}:`, avatar);
            
            // If the avatar is in any format, use getRealAvatar to resolve it
            const resolvedAvatar = await getRealAvatar(avatar);
            if (resolvedAvatar) {
              ensAvatarCache[ensName] = resolvedAvatar;
              return resolvedAvatar;
            }
          }
        }
      } catch (resolverError) {
        console.error(`Error using resolver for ${ensName}:`, resolverError);
      }
    }
    
    // If still nothing, try avatar.ens.domains
    try {
      const ensAvatarUrl = `https://avatar.ens.domains/${ensName}`;
      const ensAvatarResponse = await fetch(ensAvatarUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      });
      if (ensAvatarResponse.ok) {
        console.log(`Found avatar via ENS Avatar API for ${ensName}`);
        ensAvatarCache[ensName] = ensAvatarUrl;
        return ensAvatarUrl;
      }
    } catch (ensAvatarError) {
      console.warn(`Error fetching from ENS Avatar API for ${ensName}:`, ensAvatarError);
    }
    
    // Generate a default avatar using hash of ensName
    const fallbackAvatar = `https://robohash.org/${ensName}?set=set4`;
    ensAvatarCache[ensName] = fallbackAvatar;
    return fallbackAvatar;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}

/**
 * Gets ENS bio data
 */
export async function getEnsBio(ensName: string, network = 'mainnet'): Promise<string | null> {
  try {
    // Check cache first
    if (ensName in ensBioCache) {
      return ensBioCache[ensName];
    }
    
    if (!ensName) return null;
    
    // Special handling for .box domains
    if (ensName.endsWith('.box')) {
      console.log(`Using CCIP-Read to get .box bio for ${ensName}`);
      const boxData = await ccipReadEnabled.resolveDotBit(ensName);
      
      // Check for profile description in the dot bit data
      if (boxData) {
        try {
          const response = await fetch(`https://indexer-v1.did.id/v1/account/records?account=${ensName}&key=profile.description`, {
            signal: AbortSignal.timeout(2000)
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.data && data.data.length > 0) {
              const bio = data.data[0].value;
              ensBioCache[ensName] = bio;
              return bio;
            }
          }
        } catch (error) {
          console.warn(`Error fetching .box bio: ${error}`);
        }
      }
    }
    
    // Try to use resolver directly - only for ENS domains on mainnet
    if (ensName.endsWith('.eth')) {
      try {
        const provider = mainnetProvider;
        const resolver = await provider.getResolver(ensName);
        
        if (resolver) {
          try {
            const description = await resolver.getText('description');
            if (description) {
              ensBioCache[ensName] = description;
              return description;
            }
          } catch (textError) {
            console.warn(`Error getting description for ${ensName}:`, textError);
          }
        }
      } catch (resolverError) {
        console.warn(`Error getting resolver for ${ensName}:`, resolverError);
      }
    }
    
    // No bio found
    ensBioCache[ensName] = null;
    return null;
  } catch (error) {
    console.error(`Error fetching ENS bio: ${error}`);
    return null;
  }
}
