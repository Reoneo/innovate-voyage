
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
  
  // If the name doesn't end with .eth or .box, return empty result quickly
  if (!ensName.endsWith('.eth') && !ensName.endsWith('.box')) {
    return result;
  }
  
  try {
    // Fast timeout for quick loading
    const resolver = await Promise.race([
      mainnetProvider.getResolver(ensName),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
    ]) as any;
    
    if (!resolver) {
      return result;
    }
    
    // Comprehensive list of ENS text records
    const recordsToFetch = [
      'com.github', 'com.twitter', 'com.linkedin', 'com.discord.ens', 'com.whatsapp.ens',
      'org.telegram', 'app.bsky.ens', 'xyz.farcaster.ens', 'email', 'url.ens', 
      'description', 'bio.ens', 'location.ens', 'keywords.ens', 'com.instagram', 
      'com.youtube', 'com.facebook', 'com.reddit', 'website', 'portfolio', 'resume'
    ];
    
    // Batch fetch all records quickly
    const recordPromises = recordsToFetch.map(async (key) => {
      try {
        const value = await Promise.race([
          resolver.getText(key),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 800))
        ]) as string;
        return { key, value: value?.trim() || null };
      } catch {
        return { key, value: null };
      }
    });
    
    const recordResults = await Promise.allSettled(recordPromises);
    
    // Process results without error handling overhead
    recordResults.forEach((promiseResult) => {
      if (promiseResult.status === 'fulfilled') {
        const { key, value } = promiseResult.value;
        if (!value) return;
        
        // Map ENS records to social fields
        const mapping: Record<string, string> = {
          'com.github': 'github',
          'com.twitter': 'twitter',
          'com.linkedin': 'linkedin',
          'com.discord.ens': 'discord',
          'com.whatsapp.ens': 'whatsapp',
          'org.telegram': 'telegram',
          'app.bsky.ens': 'bluesky',
          'xyz.farcaster.ens': 'farcaster',
          'com.instagram': 'instagram',
          'com.youtube': 'youtube',
          'com.facebook': 'facebook',
          'com.reddit': 'reddit',
          'email': 'email',
          'url.ens': 'website',
          'website': 'website',
          'location.ens': 'location',
          'portfolio': 'portfolio',
          'resume': 'resume'
        };

        if (mapping[key]) {
          result.socials[mapping[key]] = value;
        } else if (key === 'description' || key === 'bio.ens') {
          result.description = value;
        } else if (key === 'keywords.ens') {
          result.keywords = value.split(',').map(k => k.trim());
        }
      }
    });
    
    return result;
    
  } catch {
    // Return partial results even on error
    return result;
  }
}
