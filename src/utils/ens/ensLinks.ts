
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
      setTimeout(() => reject(new Error('ENS timeout')), 3000)
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
    
    // Parallel fetch for essential social records only
    const recordsToFetch = [
      'com.github', 'com.twitter', 'com.linkedin', 'email', 'description'
    ];
    
    const recordPromises = recordsToFetch.map(async (key) => {
      try {
        const recordPromise = resolver.getText(key);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout for ${key}`)), 2000)
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
        case 'email':
          result.socials.email = value;
          break;
        case 'description':
          result.description = value;
          break;
      }
    });
    
    return result;
    
  } catch (error) {
    console.error(`Error fetching ENS links for ${ensName}:`, error);
    return result;
  }
}
