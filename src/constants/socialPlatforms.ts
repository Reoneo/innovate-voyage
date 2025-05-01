
// Define social platform types and their corresponding icon types
export const socialPlatforms = [
  { key: 'bluesky', type: 'bluesky' },
  { key: 'discord', type: 'discord' },
  { key: 'email', type: 'mail' },
  { key: 'facebook', type: 'facebook' },
  { key: 'farcaster', type: 'farcaster' },
  { key: 'github', type: 'github' },
  { key: 'instagram', type: 'instagram' },
  { key: 'lens', type: 'lens' },
  { key: 'linkedin', type: 'linkedin' },
  { key: 'location', type: 'location' },
  { key: 'opensea', type: 'opensea' },
  { key: 'reddit', type: 'reddit' },
  { key: 'telegram', type: 'telegram' },
  { key: 'telephone', type: 'phone' },
  { key: 'twitter', type: 'twitter' },
  { key: 'website', type: 'globe' },
  { key: 'whatsapp', type: 'whatsapp' },
  { key: 'youtube', type: 'youtube' }
];

// Define social platform interface
export interface SocialPlatform {
  key: string;
  type: string;
}
