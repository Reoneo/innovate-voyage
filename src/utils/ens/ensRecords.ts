
import { mainnetProvider, getFromEnsCache, addToEnsCache } from '../ethereumProviders';
import { getRealAvatar } from '../../api/services/avatarService';
import { ccipReadEnabled } from './ccipReadHandler';
import { handleDirectImageUrl } from '../../api/services/avatar/utils/directImageHandler';
import { resolveEnsToAddress, resolveNameAndMetadata } from './resolution';

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
    
    // Use the new comprehensive resolveNameAndMetadata function
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
    
    // Fallback to avatar.ens.domains
    try {
      const ensAvatarUrl = `https://avatar.ens.domains/${ensName}`;
      
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000); // Shorter timeout for HEAD request
      
      try {
        const ensAvatarResponse = await fetch(ensAvatarUrl, { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        if (ensAvatarResponse.ok) {
          console.log(`Found avatar via ENS Avatar API for ${ensName}`);
          
          // Cache the result
          addToEnsCache(ensName, { avatar: ensAvatarUrl });
          
          return ensAvatarUrl;
        }
      } catch (ensAvatarError) {
        console.warn(`Error fetching from ENS Avatar API for ${ensName}:`, ensAvatarError);
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      console.warn(`Error trying avatar.ens.domains: ${error}`);
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

/**
 * Gets ENS bio data with caching
 */
export async function getEnsBio(ensName: string, network = 'mainnet', timeoutMs = 5000): Promise<string | null> {
  if (!ensName) return null;
  
  try {
    // Check cache first
    const cachedResult = getFromEnsCache(ensName);
    if (cachedResult && cachedResult.bio !== undefined) {
      console.log(`Using cached bio for ${ensName}`);
      return cachedResult.bio || null;
    }
    
    // Use the new comprehensive resolveNameAndMetadata function
    const ensData = await resolveNameAndMetadata(ensName);
    
    if (ensData && ensData.textRecords?.description) {
      console.log(`Got bio for ${ensName} from resolveNameAndMetadata: ${ensData.textRecords.description}`);
      
      // Cache the result
      addToEnsCache(ensName, { bio: ensData.textRecords.description });
      
      return ensData.textRecords.description;
    }
    
    // Special handling for .box domains
    if (ensName.endsWith('.box')) {
      console.log(`Using CCIP-Read to get .box bio for ${ensName}`);
      
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        // Try the DID indexer for .box domains
        const response = await fetch(
          `https://indexer-v1.did.id/v1/account/records?account=${ensName}&key=profile.description`, 
          { signal: controller.signal }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.data && data.data.length > 0) {
            const bio = data.data[0].value;
            
            // Cache the result
            addToEnsCache(ensName, { bio });
            
            return bio;
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn(`DID indexer fetch for ${ensName} aborted after ${timeoutMs}ms`);
        } else {
          console.warn(`Error fetching .box bio: ${error}`);
        }
      } finally {
        clearTimeout(timer);
      }
    }
    
    // Try to use resolver directly - for both .eth and .box domains on mainnet
    if (ensName.endsWith('.eth') || ensName.endsWith('.box')) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        // Get the resolver
        const resolver = await mainnetProvider.getResolver(ensName);
        
        if (resolver) {
          // Try to get description text record
          try {
            const description = await resolver.getText('description');
            if (description) {
              // Cache the result
              addToEnsCache(ensName, { bio: description });
              
              return description;
            }
          } catch (textError) {
            console.warn(`Error getting description for ${ensName}:`, textError);
          }
        }
      } catch (resolverError: any) {
        if (resolverError.name === 'AbortError') {
          console.warn(`Resolver fetch for ${ensName} aborted after ${timeoutMs}ms`);
        } else {
          console.warn(`Error getting resolver for ${ensName}:`, resolverError);
        }
      } finally {
        clearTimeout(timer);
      }
    }
    
    // No bio found - cache the null result
    addToEnsCache(ensName, { bio: null });
    return null;
  } catch (error) {
    console.error(`Error fetching ENS bio: ${error}`);
    return null;
  }
}

/**
 * Gets all ENS data in parallel
 * This helper function gets address, avatar, bio, and links all at once
 */
export async function getAllEnsData(ensName: string, timeoutMs = 5000): Promise<{
  address: string | null;
  avatar: string | null;
  bio: string | null;
  links: any;
}> {
  // Use the new comprehensive resolveNameAndMetadata function
  const ensData = await resolveNameAndMetadata(ensName);
  
  if (ensData) {
    return {
      address: ensData.address || null,
      avatar: ensData.avatarUrl || null,
      bio: ensData.textRecords?.description || null,
      links: { socials: extractSocialsFromTextRecords(ensData.textRecords), ensLinks: [] }
    };
  }
  
  // If comprehensive resolution fails, fall back to previous method
  
  // Check cache first for all data
  const cachedResult = getFromEnsCache(ensName);
  if (cachedResult && cachedResult.address && cachedResult.avatar !== undefined && cachedResult.bio !== undefined) {
    console.log(`Using full cached ENS data for ${ensName}`);
    return {
      address: cachedResult.address,
      avatar: cachedResult.avatar || null,
      bio: cachedResult.bio || null,
      links: cachedResult.links || { socials: {}, ensLinks: [] }
    };
  }
  
  // Get resolver first
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      let resolver;
      
      // Special case for .box domains
      if (ensName.endsWith('.box')) {
        // For .box we use the CCIP handler directly
        const boxData = await ccipReadEnabled.resolveDotBit(ensName);
        if (boxData) {
          // For .box domains, construct a partial result with the available data
          return {
            address: boxData.address || null,
            avatar: boxData.avatar || null,
            bio: boxData.textRecords?.description || null,
            links: { socials: extractSocialsFromTextRecords(boxData.textRecords), ensLinks: [] }
          };
        }
      } else {
        // For .eth domains, get the resolver
        resolver = await mainnetProvider.getResolver(ensName);
        
        if (resolver) {
          // Parallel fetching of all required ENS data
          const [address, avatar, description] = await Promise.all([
            resolver.getAddress().catch(() => null),
            resolver.getText('avatar').catch(() => null),
            resolver.getText('description').catch(() => null)
          ]);
          
          // Process avatar if needed
          let processedAvatar = avatar;
          if (avatar && !handleDirectImageUrl(avatar)) {
            processedAvatar = await getRealAvatar(avatar);
          }
          
          // Cache all the results
          addToEnsCache(ensName, {
            address: address || undefined,
            avatar: processedAvatar || undefined,
            bio: description || undefined
          });
          
          return {
            address: address,
            avatar: processedAvatar,
            bio: description,
            links: { socials: {}, ensLinks: [] } // Links will be handled separately
          };
        }
      }
    } finally {
      clearTimeout(timer);
    }
    
    // If we get here, we need to fetch things separately
    const [address, avatar, bio] = await Promise.all([
      resolveEnsToAddress(ensName, timeoutMs),
      getEnsAvatar(ensName, 'mainnet', timeoutMs),
      getEnsBio(ensName, 'mainnet', timeoutMs)
    ]);
    
    return {
      address,
      avatar,
      bio,
      links: { socials: {}, ensLinks: [] }
    };
  } catch (error: any) {
    console.error(`Error getting all ENS data for ${ensName}:`, error);
    return {
      address: null,
      avatar: null,
      bio: null,
      links: { socials: {}, ensLinks: [] }
    };
  }
}

/**
 * Extract social media links from text records
 */
function extractSocialsFromTextRecords(textRecords?: Record<string, string | null>): Record<string, string> {
  if (!textRecords) return {};
  
  const socials: Record<string, string> = {};
  
  // Map common ENS text records to social platform keys
  if (textRecords['com.twitter']) socials.twitter = textRecords['com.twitter'];
  if (textRecords['com.github']) socials.github = textRecords['com.github'];
  if (textRecords['com.discord']) socials.discord = textRecords['com.discord'];
  if (textRecords['org.telegram']) socials.telegram = textRecords['org.telegram'];
  if (textRecords['com.reddit']) socials.reddit = textRecords['com.reddit'];
  if (textRecords['email']) socials.email = textRecords['email'];
  if (textRecords['url']) socials.website = textRecords['url'];
  
  return socials;
}
