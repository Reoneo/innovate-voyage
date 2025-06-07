
export interface ENSTextRecord {
  key: string;
  value: string;
}

export interface ENSSocialRecord {
  platform: string;
  handle: string;
  url: string;
}

export interface ENSProfile {
  ensName: string;
  address?: string;
  avatar?: string;
  description?: string;
  email?: string;
  website?: string;
  telephone?: string;
  location?: string;
  socials: Record<string, string>;
  textRecords: Record<string, string>;
}

export type ENSTextRecordKey = 
  | 'avatar'
  | 'description' 
  | 'email'
  | 'url'
  | 'website'
  | 'location'
  | 'telephone'
  | 'github'
  | 'twitter'
  | 'linkedin'
  | 'discord'
  | 'telegram'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'reddit'
  | 'snapchat'
  | 'tiktok'
  | 'medium'
  | 'substack'
  | 'mirror'
  | 'lens'
  | 'farcaster'
  | 'nostr'
  | 'mastodon'
  | 'bluesky';

export type PriorityRecordKey = 'github' | 'linkedin' | 'twitter';

export const PRIORITY_RECORDS: PriorityRecordKey[] = ['github', 'linkedin', 'twitter'];

export const ALL_TEXT_RECORDS: ENSTextRecordKey[] = [
  'avatar',
  'description',
  'email', 
  'url',
  'website',
  'location',
  'telephone',
  'github',
  'twitter',
  'linkedin',
  'discord',
  'telegram',
  'instagram',
  'youtube',
  'facebook',
  'reddit',
  'snapchat',
  'tiktok',
  'medium',
  'substack',
  'mirror',
  'lens',
  'farcaster',
  'nostr',
  'mastodon',
  'bluesky'
];

export const RECORD_TO_PLATFORM_MAP: Record<string, string> = {
  'github': 'github',
  'twitter': 'twitter', 
  'linkedin': 'linkedin',
  'discord': 'discord',
  'telegram': 'telegram',
  'instagram': 'instagram',
  'youtube': 'youtube',
  'facebook': 'facebook',
  'reddit': 'reddit',
  'snapchat': 'snapchat',
  'tiktok': 'tiktok',
  'medium': 'website',
  'substack': 'website',
  'mirror': 'website',
  'lens': 'website',
  'farcaster': 'farcaster',
  'nostr': 'website',
  'mastodon': 'website',
  'bluesky': 'website'
};
