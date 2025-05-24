
import { mainnetProvider } from '../ethereumProviders';

// ENS API base URL - you can change this to your self-hosted instance
const ENS_API_BASE = 'https://ens-api.vercel.app';

/**
 * Gets avatar for an ENS name using ENS API
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    console.log(`Getting avatar for ${ensName} using ENS API`);
    
    // Use ENS API avatar endpoint
    const avatarUrl = `${ENS_API_BASE}/avatar/${ensName}`;
    const response = await fetch(avatarUrl, { method: 'HEAD' });
    
    if (response.ok) {
      console.log(`Found avatar via ENS API for ${ensName}`);
      return avatarUrl;
    }
    
    // Fallback to provider resolver for .eth domains
    if (ensName.endsWith('.eth')) {
      try {
        const provider = mainnetProvider;
        const resolver = await provider.getResolver(ensName);
        
        if (resolver) {
          const avatar = await resolver.getText('avatar');
          if (avatar) {
            console.log(`Found avatar via provider for ${ensName}:`, avatar);
            return avatar;
          }
        }
      } catch (resolverError) {
        console.error(`Error using resolver for ${ensName}:`, resolverError);
      }
    }
    
    return null;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}

/**
 * Gets ENS bio data using ENS API
 */
export async function getEnsBio(ensName: string, network = 'mainnet'): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    console.log(`Getting bio for ${ensName} using ENS API`);
    
    // Use ENS API to get text records
    const response = await fetch(`${ENS_API_BASE}/name/${ensName}?texts=description`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.texts && data.texts.description) {
        console.log(`Found bio via ENS API for ${ensName}`);
        return data.texts.description;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ENS bio: ${error}`);
    return null;
  }
}
