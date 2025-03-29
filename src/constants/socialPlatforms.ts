
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
  { key: 'telegram', type: 'message-circle' }
];

// Define social platform interface
export interface SocialPlatform {
  key: string;
  type: string;
}
