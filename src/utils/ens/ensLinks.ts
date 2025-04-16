
import { mainnetProvider } from '../ethereumProviders';

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

    // Try to get bio/description
    let description;
    try {
      description = await resolver.getText('description');
      if (description) {
        console.log(`Got description for ${ensName}:`, description);
      }
    } catch (error) {
      console.warn(`Failed to get description for ${ensName}:`, error);
    }

    // Try to get social media links
    const socials: Record<string, string> = {};
    
    // Extended list of ENS text records for social media and contact info
    const socialKeys = [
      'com.github', 
      'com.twitter', 
      'com.linkedin', 
      'url', 
      'email', 
      'com.facebook',
      'org.whatsapp.phone',
      'org.telegram',
      'com.instagram',
      'com.youtube',
      'com.discord',
      'com.reddit',
      'org.telegram',
      'bsky',           // For Bluesky
      'phone',
      'location',
    ];
    
    // Try to get each social media link in parallel for efficiency
    const results = await Promise.allSettled(
      socialKeys.map(async key => ({ key, value: await resolver.getText(key) }))
    );
    
    // Process successful results
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.value) {
        const { key, value } = result.value;
        
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
          case 'bsky':
            socials.bluesky = value;
            break;
          case 'phone':
            socials.telephone = value;
            break;
          case 'location':
            socials.location = value;
            break;
        }
      }
    });

    // Log the retrieved socials
    console.log(`Retrieved social links for ${ensName}:`, socials);

    // Try to get additional ENS names
    // This is a simplified implementation - in a real app you would query an ENS indexer
    // For demonstration, we'll just return the current ENS name
    const ensLinks = [ensName];
    
    return {
      socials,
      ensLinks,
      description
    };
  } catch (error) {
    console.error(`Error getting ENS links for ${ensName}:`, error);
    return {
      socials: {},
      ensLinks: []
    };
  }
}
