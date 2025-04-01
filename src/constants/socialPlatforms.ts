
// Define social platform types and their corresponding icon types
export const socialPlatforms = [
  { key: 'github', type: 'github' },
  { key: 'twitter', type: 'twitter' },
  { key: 'linkedin', type: 'linkedin' },
  { key: 'facebook', type: 'facebook' },
  { key: 'instagram', type: 'instagram' },
  { key: 'youtube', type: 'youtube' },
  { key: 'bluesky', type: 'bluesky' },
  { key: 'website', type: 'globe' },
  { key: 'telegram', type: 'telegram' },
  { key: 'discord', type: 'discord' },
  { key: 'reddit', type: 'reddit' },
  { key: 'whatsapp', type: 'whatsapp' },
  { key: 'email', type: 'mail' },
  { key: 'telephone', type: 'phone' },
  { key: 'location', type: 'location' },
  { key: 'farcaster', type: 'farcaster' },
  { key: 'lens', type: 'lens' },
  { key: 'opensea', type: 'opensea' }
];

// Define social platform interface
export interface SocialPlatform {
  key: string;
  type: string;
}
