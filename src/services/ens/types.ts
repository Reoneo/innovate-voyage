
export interface ENSProfile {
  address?: string;
  ensName?: string;
  avatar?: string;
  description?: string;
  email?: string;
  website?: string;
  socials: Record<string, string>;
  textRecords: Record<string, string>;
}

export const PRIORITY_RECORDS = [
  'com.github',
  'com.twitter', 
  'com.linkedin',
  'avatar',
  'description',
  'email',
  'url',
  'website'
] as const;

export const ALL_TEXT_RECORDS = [
  ...PRIORITY_RECORDS,
  'display',
  'keywords',
  'mail',
  'notice',
  'location',
  'phone',
  'com.peepeth',
  'com.discord',
  'com.reddit',
  'com.youtube',
  'com.instagram',
  'com.facebook',
  'com.twitch',
  'com.medium',
  'com.substack',
  'xyz.farcaster',
  'app.bsky.ens',
  'bio.ens',
  'com.whatsapp.ens',
  'com.discord.ens',
  'location.ens',
  'keywords.ens',
  'portfolio',
  'resume'
] as const;
