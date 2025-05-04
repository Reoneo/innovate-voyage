
import { fetchEnsProfile } from '../../services/ens/ensApiClient';
import type { Web3BioProfile } from '../../types/web3Types';

/**
 * Fetches profile data using official ENS API instead of web3.bio
 * @param identity ENS name or Ethereum address
 * @returns Profile data or null if not found
 */
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  try {
    if (!identity) return null;
    
    console.log(`Fetching ENS profile for: ${identity}`);
    
    const profile = await fetchEnsProfile(identity);
    
    if (!profile) {
      return null;
    }
    
    // Convert the ENS profile to our internal Web3BioProfile format
    const web3Profile: Web3BioProfile = {
      address: profile.address || '',
      identity: profile.name || identity,
      platform: 'ethereum',
      displayName: profile.name || identity,
      avatar: profile.avatar || null,
      description: profile.description || null,
      github: profile.socials?.github || undefined,
      twitter: profile.socials?.twitter || undefined,
      telegram: profile.socials?.telegram || undefined,
      lens: undefined,
      farcaster: undefined,
      website: profile.socials?.website || undefined,
      linkedin: profile.socials?.linkedin || undefined,
      email: profile.socials?.email || undefined,
      discord: profile.socials?.discord || undefined,
      instagram: profile.socials?.instagram || undefined
    };
    
    return web3Profile;
  } catch (error) {
    console.error('Error fetching ENS profile:', error);
    return null;
  }
}
