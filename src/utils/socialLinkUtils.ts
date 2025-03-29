
/**
 * Helper functions for social media link handling
 */

// Helper function to extract username from social media URLs
export const extractHandle = (url: string, platform: string): string => {
  try {
    const urlObj = new URL(url);
    switch (platform) {
      case 'github':
        return '@' + urlObj.pathname.split('/')[1];
      case 'twitter':
        return '@' + urlObj.pathname.split('/')[1];
      case 'linkedin':
        if (urlObj.pathname.includes('/in/')) {
          return '@' + urlObj.pathname.split('/in/')[1].split('/')[0];
        }
        return url;
      case 'facebook':
        return '@' + urlObj.pathname.split('/')[1];
      case 'instagram':
        return '@' + urlObj.pathname.split('/')[1];
      case 'youtube':
        if (urlObj.pathname.includes('/c/')) {
          return '@' + urlObj.pathname.split('/c/')[1];
        } else if (urlObj.pathname.includes('/channel/')) {
          return urlObj.pathname.split('/channel/')[1];
        }
        return 'YouTube Channel';
      case 'bluesky':
        return '@' + (urlObj.pathname.split('/').filter(p => p)[0] || '');
      case 'website':
        return urlObj.hostname;
      default:
        return url;
    }
  } catch (e) {
    // If URL parsing fails, just return the original URL
    return url;
  }
};
