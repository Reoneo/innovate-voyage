
import { mainnetProvider, getFromEnsCache, addToEnsCache } from '../../ethereumProviders';
import { getRealAvatar } from '../../../api/services/avatarService';
import { handleDirectImageUrl } from '../../../api/services/avatar/utils/directImageHandler';
import { resolveNameAndMetadata } from '../resolution';
import { ccipReadEnabled } from '../ccipReadHandler';

/**
 * Gets avatar for an ENS name with caching
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet', timeoutMs = 5000): Promise<string | null> {
  if (!ensName) return null;
  
  try {
    // Check cache first
    const cachedResult = getFromEnsCache(ensName);
    if (cachedResult && cachedResult.avatar) {
      console.log(`Using cached avatar for ${ensName}`);
      return cachedResult.avatar;
    }
    
    // Use the comprehensive resolveNameAndMetadata function
    const ensData = await resolveNameAndMetadata(ensName);
    
    if (ensData && ensData.avatarUrl) {
      console.log(`Got avatar for ${ensName} from resolveNameAndMetadata: ${ensData.avatarUrl}`);
      
      // Cache the result
      addToEnsCache(ensName, { avatar: ensData.avatarUrl });
      
      return ensData.avatarUrl;
    }
    
    // If no avatar from comprehensive resolution, try legacy fallbacks
    console.log(`Getting avatar for ${ensName} using legacy methods`);
    
    // Special handling for .box domains
    if (ensName.endsWith('.box')) {
      console.log(`Using CCIP-Read to get .box avatar for ${ensName}`);
      
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const boxData = await ccipReadEnabled.resolveDotBit(ensName);
        
        if (boxData && boxData.avatar) {
          console.log(`Got .box avatar from CCIP-Read: ${boxData.avatar}`);
          
          // Cache the result
          addToEnsCache(ensName, { avatar: boxData.avatar });
          
          return boxData.avatar;
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn(`CCIP-Read for ${ensName} avatar aborted after ${timeoutMs}ms`);
        } else {
          console.error(`Error getting .box avatar for ${ensName}:`, error);
        }
      } finally {
        clearTimeout(timer);
      }
    }
    
    // Try the ENS metadata service first (fast path)
    try {
      const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
      
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000); // Shorter timeout for HEAD request
      
      try {
        const metadataResponse = await fetch(metadataUrl, { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        if (metadataResponse.ok) {
          console.log(`Found avatar via ENS metadata for ${ensName}`);
          
          // Cache the result
          addToEnsCache(ensName, { avatar: metadataUrl });
          
          return metadataUrl;
        }
      } catch (metadataError) {
        console.warn(`Error fetching from ENS metadata for ${ensName}:`, metadataError);
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      console.warn(`Error trying ENS metadata service: ${error}`);
    }
    
    // Fallback: Try to use resolver directly for ENS domains
    if (ensName.endsWith('.eth') || ensName.endsWith('.box')) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        // Get the resolver
        const resolver = await mainnetProvider.getResolver(ensName);
        
        if (resolver) {
          console.log(`Got resolver for ${ensName}`);
          
          // Try to get avatar text record
          try {
            const avatar = await resolver.getText('avatar');
            
            if (avatar) {
              console.log(`Got avatar text record for ${ensName}:`, avatar);
              
              // If the avatar is a direct URL, use it
              if (handleDirectImageUrl(avatar)) {
                addToEnsCache(ensName, { avatar });
                return avatar;
              }
              
              // If the avatar needs resolution (IPFS, NFT, etc.)
              const resolvedAvatar = await getRealAvatar(avatar);
              if (resolvedAvatar) {
                addToEnsCache(ensName, { avatar: resolvedAvatar });
                return resolvedAvatar;
              }
            }
          } catch (textError) {
            console.warn(`Error getting avatar text for ${ensName}:`, textError);
          }
        }
      } catch (resolverError: any) {
        if (resolverError.name === 'AbortError') {
          console.warn(`Resolver fetch for ${ensName} aborted after ${timeoutMs}ms`);
        } else {
          console.error(`Error using resolver for ${ensName}:`, resolverError);
        }
      } finally {
        clearTimeout(timer);
      }
    }
    
    // Final fallback: generate a deterministic avatar
    const fallbackAvatar = `https://robohash.org/${ensName}?set=set4`;
    
    // Cache the fallback
    addToEnsCache(ensName, { avatar: fallbackAvatar });
    
    return fallbackAvatar;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}
