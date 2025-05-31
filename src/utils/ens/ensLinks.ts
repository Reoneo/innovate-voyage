
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
    
    // Special handling for .box domains
    if (ensName.endsWith('.box')) {
      try {
        console.log(`Fetching .box domain records for ${ensName}`);
        const boxResponse = await fetch(`https://indexer-v1.did.id/v1/account/records?account=${ensName}`);
        if (boxResponse.ok) {
          const boxData = await boxResponse.json();
          console.log('Box domain records:', boxData);
          
          if (boxData && boxData.data && Array.isArray(boxData.data)) {
            boxData.data.forEach((record: any) => {
              if (record.key && record.value) {
                const key = record.key.toLowerCase();
                
                // Map .box records to our social structure
                if (key.includes('github')) result.socials.github = record.value;
                else if (key.includes('twitter')) result.socials.twitter = record.value;
                else if (key.includes('discord')) result.socials.discord = record.value;
                else if (key.includes('linkedin')) result.socials.linkedin = record.value;
                else if (key.includes('telegram')) result.socials.telegram = record.value;
                else if (key.includes('reddit')) result.socials.reddit = record.value;
                else if (key.includes('email')) result.socials.email = record.value;
                else if (key.includes('whatsapp')) result.socials.whatsapp = record.value;
                else if (key.includes('website') || key.includes('url')) result.socials.website = record.value;
                else if (key.includes('phone') || key.includes('telephone')) result.socials.telephone = record.value;
                else if (key.includes('location')) result.socials.location = record.value;
                else if (key.includes('instagram')) result.socials.instagram = record.value;
                else if (key.includes('youtube')) result.socials.youtube = record.value;
                else if (key.includes('facebook')) result.socials.facebook = record.value;
                else if (key.includes('bluesky') || key.includes('bsky')) result.socials.bluesky = record.value;
                else if (key.includes('description') || key.includes('bio')) result.description = record.value;
                else if (key.includes('keywords')) {
                  result.keywords = record.value.split(/[,\s]+/).filter(k => k.trim().length > 0);
                }
              }
            });
          }
        }
      } catch (boxError) {
        console.error('Error fetching .box records:', boxError);
      }
    }
    
    const resolver = await mainnetProvider.getResolver(ensName);
    
    // Exit if no resolver found
    if (!resolver) {
      console.log('No resolver found for', ensName);
      return result;
    }
    
    // Expanded list of social records to fetch
    const recordsToFetch = [
      'com.github', 'com.twitter', 'com.discord', 'com.linkedin', 'org.telegram',
      'com.reddit', 'email', 'url', 'description', 'avatar',
      'com.instagram', 'io.keybase', 'xyz.lens', 'location', 'com.youtube',
      'app.bsky', 'com.whatsapp', 'phone', 'name', 'notice', 'keywords',
      'com.facebook', 'com.snapchat', 'com.tiktok', 'com.medium',
      'com.substack', 'com.behance', 'com.dribbble', 'com.stackoverflow',
      'com.dev.to', 'com.hashnode', 'com.producthunt', 'com.twitch',
      'com.spotify', 'com.soundcloud', 'org.matrix', 'im.signal',
      'com.opensea', 'foundation.app', 'superrare.co', 'async.art',
      'zora.co', 'com.pinterest', 'com.flickr', 'vimeo.com',
      'org.weibo', 'qq.com', 'wechat.com', 'line.me',
      'skype', 'viber.com', 'kik.com', 'mastodon.social'
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
          console.log('Found LinkedIn in ENS records:', value);
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
        case 'com.facebook':
          result.socials.facebook = value;
          break;
        case 'com.snapchat':
          result.socials.snapchat = value;
          break;
        case 'com.tiktok':
          result.socials.tiktok = value;
          break;
        case 'com.medium':
          result.socials.medium = value;
          break;
        case 'com.substack':
          result.socials.substack = value;
          break;
        case 'com.behance':
          result.socials.behance = value;
          break;
        case 'com.dribbble':
          result.socials.dribbble = value;
          break;
        case 'com.stackoverflow':
          result.socials.stackoverflow = value;
          break;
        case 'com.dev.to':
          result.socials.devto = value;
          break;
        case 'com.hashnode':
          result.socials.hashnode = value;
          break;
        case 'com.producthunt':
          result.socials.producthunt = value;
          break;
        case 'com.twitch':
          result.socials.twitch = value;
          break;
        case 'com.spotify':
          result.socials.spotify = value;
          break;
        case 'com.soundcloud':
          result.socials.soundcloud = value;
          break;
        case 'org.matrix':
          result.socials.matrix = value;
          break;
        case 'im.signal':
          result.socials.signal = value;
          break;
        case 'com.opensea':
          result.socials.opensea = value;
          break;
        case 'foundation.app':
          result.socials.foundation = value;
          break;
        case 'superrare.co':
          result.socials.superrare = value;
          break;
        case 'async.art':
          result.socials.asyncart = value;
          break;
        case 'zora.co':
          result.socials.zora = value;
          break;
        case 'com.pinterest':
          result.socials.pinterest = value;
          break;
        case 'com.flickr':
          result.socials.flickr = value;
          break;
        case 'vimeo.com':
          result.socials.vimeo = value;
          break;
        case 'org.weibo':
          result.socials.weibo = value;
          break;
        case 'qq.com':
          result.socials.qq = value;
          break;
        case 'wechat.com':
          result.socials.wechat = value;
          break;
        case 'line.me':
          result.socials.line = value;
          break;
        case 'skype':
          result.socials.skype = value;
          break;
        case 'viber.com':
          result.socials.viber = value;
          break;
        case 'kik.com':
          result.socials.kik = value;
          break;
        case 'mastodon.social':
          result.socials.mastodon = value;
          break;
        case 'description':
          result.description = value;
          break;
        case 'keywords':
          // Handle keywords - could be comma-separated or space-separated
          result.keywords = value.split(/[,\s]+/).filter(k => k.trim().length > 0);
          break;
        default:
          // Store any other social records we might have missed
          if (value && value.trim() && key.includes('.')) {
            const socialKey = key.split('.').pop() || key;
            if (!result.socials[socialKey]) {
              result.socials[socialKey] = value;
            }
          }
          break;
      }
    });
    
    console.log('Final ENS social links result:', result);
    return result;
    
  } catch (error) {
    console.error(`Error fetching ENS links for ${ensName}:`, error);
    return result;
  }
}
