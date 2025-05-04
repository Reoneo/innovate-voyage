
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
      avatar: profile.avatar || '',
      description: profile.description || '',
      github: profile.socials?.github || '',
      twitter: profile.socials?.twitter || '',
      telegram: profile.socials?.telegram || '',
      lens: '',
      farcaster: '',
      website: profile.socials?.website || '',
      linkedin: profile.socials?.linkedin || '',
      email: profile.socials?.email || '',
      discord: profile.socials?.discord || '',
      instagram: profile.socials?.instagram || ''
    };
    
    return web3Profile;
  } catch (error) {
    console.error('Error fetching ENS profile:', error);
    return null;
  }
}
