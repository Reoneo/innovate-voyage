
import { getAllEnsData } from '@/utils/ens/ensRecords';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import { resolveAddressToEns } from '@/utils/ens/resolveEns';
import { getFromEnsCache, addToEnsCache } from '@/utils/ethereumProviders';
import { EnsResolutionState } from './types';

/**
 * Fetch ENS data in parallel for better performance
 */
export async function fetchEnsData(
  ensName: string,
  controller: AbortController
): Promise<{ address?: string; avatar?: string; bio?: string; links?: any }> {
  // Fetch all data in parallel for better performance
  const [ensData, links] = await Promise.all([
    // Primary data - address, avatar, bio
    getAllEnsData(ensName, 5000),
    
    // Links (can be fetched in parallel)
    getEnsLinks(ensName, 'mainnet').catch(() => ({ socials: {}, ensLinks: [], keywords: [] }))
  ]);
  
  if (controller.signal.aborted) {
    throw new Error('Aborted');
  }
  
  return {
    address: ensData.address || undefined,
    avatar: ensData.avatar || undefined,
    bio: ensData.bio || undefined,
    links: links || { socials: {}, ensLinks: [], keywords: [] }
  };
}

/**
 * Fetch additional data for an ENS name
 */
export async function fetchAdditionalEnsData(
  ensName: string,
  controller: AbortController
) {
  if (controller.signal.aborted) {
    throw new Error('Aborted');
  }
  
  // Fetch all additional data in parallel
  const [avatar, bio, links] = await Promise.all([
    fetch(`https://metadata.ens.domains/mainnet/avatar/${ensName}`)
      .then(res => res.ok ? res.url : null)
      .catch(() => null),
    fetch(`https://metadata.ens.domains/mainnet/text/${ensName}/description`)
      .then(res => res.ok ? res.text() : null)
      .catch(() => null),
    getEnsLinks(ensName, 'mainnet').catch(() => ({ socials: {}, ensLinks: [], keywords: [] }))
  ]);
  
  if (controller.signal.aborted) {
    throw new Error('Aborted');
  }
  
  return {
    avatar: avatar || undefined,
    bio: bio || undefined,
    links: links || { socials: {}, ensLinks: [], keywords: [] }
  };
}

/**
 * Check if we have data in the cache
 */
export function checkEnsCache(
  key: string, 
  setState: React.Dispatch<React.SetStateAction<EnsResolutionState>>
): boolean {
  const cachedResult = getFromEnsCache(key);
  if (cachedResult) {
    console.log(`Using cached ENS resolution data for ${key}`);
    setState(prev => ({
      ...prev, 
      resolvedAddress: cachedResult.address,
      avatarUrl: cachedResult.avatar,
      ensBio: cachedResult.bio,
      ensLinks: cachedResult.links || { socials: {}, ensLinks: [], keywords: [] }
    }));
    return true;
  }
  return false;
}

/**
 * Update the cache with ENS data
 */
export function updateEnsCache(key: string, data: any) {
  addToEnsCache(key, data);
  
  // Cache in reverse direction if we have both ENS and address
  if (data.address && data.ensName) {
    const addressKey = data.address.toLowerCase();
    const ensKey = data.ensName.toLowerCase();
    
    // Cache address -> ENS
    if (key !== addressKey) {
      addToEnsCache(addressKey, data);
    }
    
    // Cache ENS -> address
    if (key !== ensKey) {
      addToEnsCache(ensKey, data);
    }
  }
}
