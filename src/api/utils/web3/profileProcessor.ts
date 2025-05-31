
import { Web3BioProfile } from '../../types/web3Types';
import { avatarCache } from './avatarCache';

/**
 * Process the web3.bio profile data into our internal format
 */
export function processWeb3BioProfileData(data: any, normalizedIdentity: string): Web3BioProfile | null {
  if (!data) return null;
  
  const profile: Web3BioProfile = {
    address: data.address || '',
    identity: data.identity || normalizedIdentity,
    platform: data.platform || 'ens',
    displayName: data.displayName || data.identity || normalizedIdentity,
    avatar: data.avatar || null,
    description: data.description || null,
    status: data.status || null,
    location: data.location || null,
    telephone: data.telephone || null,
    header: data.header || null,
    contenthash: data.contenthash || null,
    github: data.github || null,
    twitter: data.twitter || null,
    linkedin: data.linkedin || null,
    website: data.website || null,
    email: data.email || null,
    facebook: data.facebook || null,
    whatsapp: data.whatsapp || null,
    bluesky: data.bluesky || null,
    discord: data.discord || null,
    links: data.links || {},
    social: data.social || {},
    aliases: data.aliases || []
  };
  
  // Extract social links
  if (data.links) {
    // Process known social platforms
    if (data.links.github?.link) profile.github = data.links.github.link;
    if (data.links.twitter?.link) profile.twitter = data.links.twitter.link;
    if (data.links.linkedin?.link) profile.linkedin = data.links.linkedin.link;
    if (data.links.website?.link) profile.website = data.links.website.link;
    if (data.links.facebook?.link) profile.facebook = data.links.facebook.link;
    if (data.links.whatsapp?.link) profile.whatsapp = data.links.whatsapp.link;
    if (data.links.bluesky?.link) profile.bluesky = data.links.bluesky.link;
    if (data.links.instagram?.link) profile.instagram = data.links.instagram.link;
    if (data.links.youtube?.link) profile.youtube = data.links.youtube.link;
    if (data.links.discord?.link) profile.discord = data.links.discord.link;
    if (data.links.telegram?.link) profile.telegram = data.links.telegram.link;
    if (data.links.reddit?.link) profile.reddit = data.links.reddit.link;
    if (data.links.farcaster?.link) profile.farcaster = data.links.farcaster.link;
    if (data.links.lens?.link) profile.lens = data.links.lens.link;
  }
  
  // Cache the avatar if available
  if (profile.avatar && normalizedIdentity) {
    avatarCache[normalizedIdentity] = profile.avatar;
  }
  
  return profile;
}

/**
 * Process profile data - alias for backward compatibility
 */
export function processProfileData(data: any, identity: string): Web3BioProfile | null {
  return processWeb3BioProfileData(data, identity);
}

/**
 * Normalize profile data - simple normalization function
 */
export function normalizeProfileData(profile: Web3BioProfile): Web3BioProfile {
  return {
    ...profile,
    identity: profile.identity?.toLowerCase() || '',
    displayName: profile.displayName || profile.identity || '',
    platform: profile.platform || 'ethereum'
  };
}
