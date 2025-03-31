
import { mainnetProvider } from '../ethereumProviders';

/**
 * Gets avatar for an ENS name
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    // Always use mainnet provider regardless of network param
    const provider = mainnetProvider;
    const resolver = await provider.getResolver(ensName);
    
    if (resolver) {
      console.log(`Got resolver for ${ensName}`);
      const avatar = await resolver.getText('avatar');
      
      if (avatar) {
        console.log(`Got avatar for ${ensName}:`, avatar);
        return avatar;
      } else {
        console.log(`No avatar found for ${ensName} in resolver`);
      }
    } else {
      console.log(`No resolver found for ${ensName}`);
    }
    
    return null;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}

/**
 * Gets ENS bio data
 */
export async function getEnsBio(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    // Always use mainnet provider
    const provider = mainnetProvider;
    const resolver = await provider.getResolver(ensName);
    
    if (resolver) {
      // Try to get description/bio from ENS records
      try {
        const description = await resolver.getText('description');
        if (description) {
          console.log(`Got bio for ${ensName}:`, description);
          return description;
        }
      } catch (error) {
        console.warn(`Failed to get description for ${ensName}:`, error);
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching bio for ${ensName}:`, error);
    return null;
  }
}
