
import { enforceRateLimit } from './rateLimiter';
import { REQUEST_DELAY_MS } from './config';
import type { Web3BioProfile } from '../../types/web3Types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches profile data from web3.bio API
 * @param identity ENS name or Ethereum address
 * @returns Profile data or null if not found
 */
export async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  try {
    // Enforce rate limiting
    await enforceRateLimit(REQUEST_DELAY_MS);
    
    // Prepare the API URL
    const path = `profile/${identity}`;
    
    const { data, error } = await supabase.functions.invoke('proxy-web3-bio', {
      body: { path }
    });
    
    // Handle API errors
    if (error) {
      console.log(`Web3.bio profile for ${identity} not found or proxy error: ${error.message}`);
      return null;
    }

    if (!data) {
        return null;
    }
    
    // Extract and normalize the profile data
    const profile: Web3BioProfile = {
      address: data.address || '',
      identity: identity,
      platform: 'ethereum',
      displayName: data.address || identity,
      avatar: data.avatar || '',
      description: data.description || '',
      github: data.github || '',
      twitter: data.twitter || '',
      telegram: data.telegram || '',
      lens: data.lens || '',
      farcaster: data.farcaster || '',
      website: data.website || '',
      linkedin: data.linkedin || '',
      email: data.email || ''
    };
    
    return profile;
  } catch (error) {
    console.error('Error fetching web3.bio profile:', error);
    return null;
  }
}
