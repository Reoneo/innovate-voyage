
import { avatarCache, generateFallbackAvatar } from '../../../utils/web3/index';

/**
 * Generate a deterministic fallback avatar based on the identity
 * @param identity User identifier
 * @returns Fallback avatar URL
 */
export function generateDeterministicAvatar(identity: string): string {
  console.log(`Generating deterministic fallback avatar for ${identity}`);
  let seed = 0;
  for (let i = 0; i < identity.length; i++) {
    seed += identity.charCodeAt(i);
  }
  seed = seed % 30 + 1; // Range 1-30
  
  const avatarUrl = `https://i.pravatar.cc/300?img=${seed}`;
  avatarCache[identity] = avatarUrl;
  return avatarUrl;
}
