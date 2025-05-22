
import { getFromEnsCache, addToEnsCache } from '../../ethereumProviders';
import { resolveEnsToAddress, resolveNameAndMetadata } from '../resolution';
import { getEnsAvatar } from '../avatars/avatarFetcher';
import { getEnsBio } from './bioFetcher';
import { extractSocialsFromTextRecords } from '../textRecords/textRecordUtils';
import { ccipReadEnabled } from '../ccipReadHandler';
import { getRealAvatar } from '../../../api/services/avatarService';
import { handleDirectImageUrl } from '../../../api/services/avatar/utils/directImageHandler';

/**
 * Gets all ENS data in parallel
 * This helper function gets address, avatar, bio, and links all at once
 */
export async function getAllEnsData(ensName: string, timeoutMs = 5000): Promise<{
  address: string | null;
  avatar: string | null;
  bio: string | null;
  links: any;
}> {
  // Use the comprehensive resolveNameAndMetadata function
  const ensData = await resolveNameAndMetadata(ensName);
  
  if (ensData) {
    return {
      address: ensData.address || null,
      avatar: ensData.avatarUrl || null,
      bio: ensData.textRecords?.description || null,
      links: { socials: extractSocialsFromTextRecords(ensData.textRecords), ensLinks: [] }
    };
  }
  
  // If comprehensive resolution fails, fall back to previous method
  
  // Check cache first for all data
  const cachedResult = getFromEnsCache(ensName);
  if (cachedResult && cachedResult.address && cachedResult.avatar !== undefined && cachedResult.bio !== undefined) {
    console.log(`Using full cached ENS data for ${ensName}`);
    return {
      address: cachedResult.address,
      avatar: cachedResult.avatar || null,
      bio: cachedResult.bio || null,
      links: cachedResult.links || { socials: {}, ensLinks: [] }
    };
  }
  
  // Get resolver first
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      // Special case for .box domains
      if (ensName.endsWith('.box')) {
        // For .box we use the CCIP handler directly
        const boxData = await ccipReadEnabled.resolveDotBit(ensName);
        if (boxData) {
          // For .box domains, construct a partial result with the available data
          return {
            address: boxData.address || null,
            avatar: boxData.avatar || null,
            bio: boxData.textRecords?.description || null,
            links: { socials: extractSocialsFromTextRecords(boxData.textRecords), ensLinks: [] }
          };
        }
      } else {
        // If we get here, we need to fetch things separately
        const [address, avatar, bio] = await Promise.all([
          resolveEnsToAddress(ensName, timeoutMs),
          getEnsAvatar(ensName, 'mainnet', timeoutMs),
          getEnsBio(ensName, 'mainnet', timeoutMs)
        ]);
        
        return {
          address,
          avatar,
          bio,
          links: { socials: {}, ensLinks: [] }
        };
      }
    } finally {
      clearTimeout(timer);
    }
    
    // Fallback: fetch separately
    const [address, avatar, bio] = await Promise.all([
      resolveEnsToAddress(ensName, timeoutMs),
      getEnsAvatar(ensName, 'mainnet', timeoutMs),
      getEnsBio(ensName, 'mainnet', timeoutMs)
    ]);
    
    return {
      address,
      avatar,
      bio,
      links: { socials: {}, ensLinks: [] }
    };
  } catch (error: any) {
    console.error(`Error getting all ENS data for ${ensName}:`, error);
    return {
      address: null,
      avatar: null,
      bio: null,
      links: { socials: {}, ensLinks: [] }
    };
  }
}
