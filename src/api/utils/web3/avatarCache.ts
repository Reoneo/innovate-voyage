
// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {};

// Clear avatar cache function
export function clearAvatarCache() {
  Object.keys(avatarCache).forEach(key => delete avatarCache[key]);
}

// Generate a fallback avatar URL
export function generateFallbackAvatar() {
  const fallbackIdx = Math.floor(Math.random() * 30) + 1;
  return `https://i.pravatar.cc/300?img=${fallbackIdx}`;
}
