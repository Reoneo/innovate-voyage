
import { mainnetProvider, getFromEnsCache, addToEnsCache } from '../../ethereumProviders';
import { resolveNameAndMetadata } from '../resolution';
import { ccipReadEnabled } from '../ccipReadHandler';

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
    
    // Use the comprehensive resolveNameAndMetadata function
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
