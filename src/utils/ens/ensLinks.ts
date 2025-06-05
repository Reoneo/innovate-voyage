
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
    
    // Add timeout to resolver calls
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('ENS timeout')), 5000)
    );
    
    const resolver = await Promise.race([
      mainnetProvider.getResolver(ensName),
      timeoutPromise
    ]) as any;
    
    // Exit if no resolver found
    if (!resolver) {
      console.log('No resolver found for', ensName);
      return result;
    }
    
    // Comprehensive list of ENS text records to fetch
    const recordsToFetch = [
      // Social media records
      'com.github', 'com.twitter', 'com.linkedin', 'com.discord', 'com.whatsapp',
      'org.telegram', 'app.bsky.ens', 'xyz.farcaster.ens',
      
      // Contact and profile records
      'email', 'url.ens', 'description', 'bio.ens', 'location.ens', 'keywords.ens',
      
      // Additional social platforms
      'com.instagram', 'com.youtube', 'com.facebook', 'com.reddit',
      
      // Professional records
      'website', 'portfolio', 'resume'
    ];
    
    const recordPromises = recordsToFetch.map(async (key) => {
      try {
        const recordPromise = resolver.getText(key);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout for ${key}`)), 3000)
        );
        
        const value = await Promise.race([recordPromise, timeoutPromise]) as string;
        return { key, value };
      } catch (error) {
        return { key, value: null };
      }
    });
    
    const records = await Promise.all(recordPromises);
    
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
        case 'com.linkedin':
          result.socials.linkedin = value;
          break;
        case 'com.discord':
          result.socials.discord = value;
          break;
        case 'com.whatsapp':
          result.socials.whatsapp = value;
          break;
        case 'org.telegram':
          result.socials.telegram = value;
          break;
        case 'app.bsky.ens':
          result.socials.bluesky = value;
          break;
        case 'xyz.farcaster.ens':
          result.socials.farcaster = value;
          break;
        case 'com.instagram':
          result.socials.instagram = value;
          break;
        case 'com.youtube':
          result.socials.youtube = value;
          break;
        case 'com.facebook':
          result.socials.facebook = value;
          break;
        case 'com.reddit':
          result.socials.reddit = value;
          break;
        case 'email':
          result.socials.email = value;
          break;
        case 'url.ens':
        case 'website':
          result.socials.website = value;
          break;
        case 'description':
        case 'bio.ens':
          result.description = value;
          break;
        case 'location.ens':
          result.socials.location = value;
          break;
        case 'keywords.ens':
          result.keywords = value.split(',').map(k => k.trim());
          break;
        case 'portfolio':
          result.socials.portfolio = value;
          break;
        case 'resume':
          result.socials.resume = value;
          break;
      }
    });
    
    console.log(`ENS records fetched for ${ensName}:`, result);
    return result;
    
  } catch (error) {
    console.error(`Error fetching ENS links for ${ensName}:`, error);
    return result;
  }
}
