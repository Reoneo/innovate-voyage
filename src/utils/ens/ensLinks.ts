
import { ethers } from 'ethers';
import { mainnetProvider } from '../ethereumProviders';

export async function getEnsLinks(ensName: string, networkName: string = 'mainnet') {
  // Default result structure
  const result = {
    socials: {} as Record<string, string>,
    ensLinks: [] as string[],
    description: undefined as string | undefined,
    keywords: [] as string[]
  };
  
  try {
    // If the name doesn't end with .eth or .box, return empty result
    if (!ensName.endsWith('.eth') && !ensName.endsWith('.box')) {
      return result;
    }
    
    const resolver = await mainnetProvider.getResolver(ensName);
    
    // Exit if no resolver found
    if (!resolver) {
      console.log('No resolver found for', ensName);
      return result;
    }
    
    // Parallel fetch for all social records
    const recordsToFetch = [
      'com.github', 'com.twitter', 'com.discord', 'com.linkedin', 'org.telegram',
      'com.reddit', 'email', 'url', 'description', 'avatar',
      'com.instagram', 'io.keybase', 'xyz.lens', 'location', 'com.youtube',
      'app.bsky', 'com.whatsapp', 'phone', 'name', 'notice', 'keywords'
    ];
    
    const records = await Promise.all(
      recordsToFetch.map(async (key) => {
        try {
          const value = await resolver.getText(key);
          return { key, value };
        } catch (error) {
          console.log(`Error fetching ${key} record:`, error);
          return { key, value: null };
        }
      })
    );
    
    // Map the records to our result structure
    records.forEach(({ key, value }) => {
      if (!value) return;
      
      switch (key) {
        case 'com.github':
          result.socials.github = value;
          break;
        case 'com.twitter':
          result.socials.twitter = value;
          break;
        case 'com.discord':
          result.socials.discord = value;
          break;
        case 'com.linkedin':
          result.socials.linkedin = value;
          break;
        case 'org.telegram':
          result.socials.telegram = value;
          break;
        case 'com.reddit':
          result.socials.reddit = value;
          break;
        case 'email':
          result.socials.email = value;
          break;
        case 'com.whatsapp':
          result.socials.whatsapp = value;
          break;
        case 'app.bsky':
          result.socials.bluesky = value;
          break;
        case 'url':
          result.socials.website = value;
          break;
        case 'phone':
          result.socials.telephone = value;
          break;
        case 'location':
          result.socials.location = value;
          break;
        case 'com.instagram':
          result.socials.instagram = value;
          break;
        case 'com.youtube':
          result.socials.youtube = value;
          break;
        case 'description':
          result.description = value;
          break;
        case 'keywords':
          // Handle keywords - could be comma-separated or space-separated
          result.keywords = value.split(/[,\s]+/).filter(k => k.trim().length > 0);
          break;
        default:
          break;
      }
    });
    
    return result;
    
  } catch (error) {
    console.error(`Error fetching ENS links for ${ensName}:`, error);
    return result;
  }
}
