
import { mainnetProvider, optimismProvider } from './ethereumProviders';

/**
 * Resolves an ENS name to an address
 */
export async function resolveEnsToAddress(ensName: string) {
  // Treat all domains as mainnet domains
  const provider = mainnetProvider;
  
  console.log(`Resolving domain: ${ensName} using Mainnet provider`);
  
  try {
    const resolvedAddress = await provider.resolveName(ensName);
    console.log(`Resolution result for ${ensName}:`, resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names
 */
export async function resolveAddressToEns(address: string) {
  // Try mainnet first
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    const ensName = await mainnetProvider.lookupAddress(address);
    
    if (ensName) {
      console.log(`Found ENS name for ${address}: ${ensName}`);
      return { ensName, network: 'mainnet' as const };
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}

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
 * Gets all ENS-related links and data from resolver
 */
export async function getEnsLinks(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    // Always use mainnet provider regardless of network param
    const provider = mainnetProvider;
    const resolver = await provider.getResolver(ensName);
    
    if (!resolver) {
      console.log(`No resolver found for ${ensName}`);
      return {
        socials: {},
        ensLinks: []
      };
    }

    // Try to get social media links
    const socials: Record<string, string> = {};
    
    // Common ENS text records for social media
    const socialKeys = [
      'com.github', 
      'com.twitter', 
      'com.linkedin', 
      'url', 
      'email', 
      'com.facebook',  // Added Facebook
      'org.whatsapp.phone',  // Added WhatsApp
      'com.facebook.messenger', // Added Facebook Messenger
      'com.discord',  // Added Discord
      'com.reddit',  // Added Reddit
      'org.telegram', // Added Telegram
      'com.instagram', // Added Instagram
      'com.youtube',  // Added YouTube
      'bsky.app',  // Added Bluesky
    ];
    
    // Try to get each social media link
    await Promise.all(socialKeys.map(async (key) => {
      try {
        const value = await resolver.getText(key);
        if (value) {
          switch (key) {
            case 'com.github':
              socials.github = value;
              break;
            case 'com.twitter':
              socials.twitter = value;
              break;
            case 'com.linkedin':
              socials.linkedin = value;
              break;
            case 'url':
              socials.website = value;
              break;
            case 'email':
              socials.email = value;
              break;
            case 'com.facebook':
              socials.facebook = value;
              break;
            case 'org.whatsapp.phone':
              socials.whatsapp = value;
              break;
            case 'com.facebook.messenger':
              socials.messenger = value;
              break;
            case 'com.discord':
              socials.discord = value;
              break;
            case 'com.reddit':
              socials.reddit = value;
              break;
            case 'org.telegram':
              socials.telegram = value;
              break;
            case 'com.instagram':
              socials.instagram = value;
              break;
            case 'com.youtube':
              socials.youtube = value;
              break;
            case 'bsky.app':
              socials.bluesky = value;
              break;
          }
        }
      } catch (error) {
        console.warn(`Failed to get ${key} for ${ensName}:`, error);
      }
    }));

    // Try to get additional ENS names
    // This is a simplified implementation - in a real app you would query an ENS indexer
    // For demonstration, we'll just return the current ENS name
    const ensLinks = [ensName];

    console.log(`Got ENS links for ${ensName}:`, { socials, ensLinks });
    
    return {
      socials,
      ensLinks
    };
  } catch (error) {
    console.error(`Error getting ENS links for ${ensName}:`, error);
    return {
      socials: {},
      ensLinks: []
    };
  }
}
