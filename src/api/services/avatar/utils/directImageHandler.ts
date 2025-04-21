
import { avatarCache } from '../../../utils/web3/index';

/**
 * Check if the input is a direct image URL
 * @param url Potential image URL
 * @returns The same URL if it's an image, null otherwise
 */
export function handleDirectImageUrl(url: string): string | null {
  // Check if the URL is a direct link to an image
  if (url.startsWith('http') && 
      (url.endsWith('.jpg') || url.endsWith('.jpeg') || 
       url.endsWith('.png') || url.endsWith('.gif') ||
       url.endsWith('.webp') || url.endsWith('.svg'))) {
    console.log(`Using direct image URL for avatar: ${url}`);
    avatarCache[url] = url;
    return url;
  }
  return null;
}
