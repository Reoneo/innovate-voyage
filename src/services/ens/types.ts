
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

export interface ENSTextRecord {
  key: string;
  value: string | null;
}

export interface ENSSocialRecord {
  platform: string;
  value: string;
  verified: boolean;
}

// Priority records that should be fetched first for fast loading
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

// Comprehensive list of all supported ENS text records
export const ALL_TEXT_RECORDS = [
  // Priority records (social platforms)
  'com.github',
  'com.twitter', 
  'com.linkedin',
  'com.discord',
  'com.reddit',
  'com.youtube',
  'com.instagram',
  'com.facebook',
  'com.twitch',
  'com.medium',
  'com.substack',
  'xyz.farcaster',
  'app.bsky',
  'org.telegram',
  
  // Profile info
  'avatar',
  'description',
  'email',
  'url',
  'website',
  'display',
  'keywords',
  'mail',
  'notice',
  'location',
  'phone',
  'portfolio',
  'resume',
  'bio',
  
  // Extended social platforms
  'com.peepeth',
  'com.whatsapp',
  'lens.protocol',
  'nostr',
  'matrix',
  'keybase'
] as const;

export type ENSTextRecordKey = typeof ALL_TEXT_RECORDS[number];
export type PriorityRecordKey = typeof PRIORITY_RECORDS[number];

// Mapping of ENS record keys to social platform names
export const RECORD_TO_PLATFORM_MAP: Record<string, string> = {
  'com.github': 'github',
  'com.twitter': 'twitter',
  'com.linkedin': 'linkedin',
  'com.discord': 'discord',
  'com.reddit': 'reddit',
  'com.youtube': 'youtube',
  'com.instagram': 'instagram',
  'com.facebook': 'facebook',
  'com.twitch': 'twitch',
  'com.medium': 'medium',
  'com.substack': 'substack',
  'xyz.farcaster': 'farcaster',
  'app.bsky': 'bluesky',
  'org.telegram': 'telegram',
  'com.peepeth': 'peepeth',
  'com.whatsapp': 'whatsapp',
  'lens.protocol': 'lens',
  'nostr': 'nostr',
  'matrix': 'matrix',
  'keybase': 'keybase',
  'email': 'email',
  'url': 'website',
  'website': 'website',
  'portfolio': 'portfolio',
  'resume': 'resume'
};
