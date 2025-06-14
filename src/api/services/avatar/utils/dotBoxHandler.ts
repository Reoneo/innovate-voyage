import { supabase } from '@/integrations/supabase/client';
import { avatarCache } from '../../../utils/web3/index';
import { fetchDotBoxAvatar } from '../../openseaService';
import { ccipReadEnabled } from '../../../../utils/ens/ccipReadHandler';

// Etherscan API key for .box domains is now in a proxy function

export async function handleDotBoxAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching .box avatar for ${identity}`);
    
    // First try the gskril/ens-api - most reliable
    try {
      const ensResponse = await fetch(`https://ens-api.vercel.app/api/${identity}`);
      if (ensResponse.ok) {
        const ensData = await ensResponse.json();
        if (ensData && ensData.avatar) {
          console.log(`Found .box avatar via gskril/ens-api for ${identity}`);
          avatarCache[identity] = ensData.avatar;
          return ensData.avatar;
        }
      }
    } catch (ensApiError) {
      console.error(`Error fetching from ENS API for ${identity}:`, ensApiError);
    }
    
    // Second, try CCIP-Read compatible resolver to get the avatar
    const boxData = await ccipReadEnabled.resolveDotBit(identity);
    if (boxData && boxData.avatar) {
      console.log(`Found .box avatar via CCIP-Read for ${identity}:`, boxData.avatar);
      avatarCache[identity] = boxData.avatar;
      return boxData.avatar;
    }
    
    // Third, try Optimism Etherscan API to get metadata via proxy
    const params = `module=account&action=txlist&address=${boxData?.address || identity}&startblock=0&endblock=99999999&sort=desc`;
    try {
       const { data: etherscanData, error } = await supabase.functions.invoke('proxy-optimism-etherscan', {
        body: { params }
      });

      if (error) {
        throw error;
      }
      
      if (etherscanData) {
        console.log(`Got Optimism Etherscan data for ${identity}`);
        // Continue with other methods as we just want the transactions data for metadata
      }
    } catch (etherscanError) {
      console.error("Error fetching from Optimism Etherscan proxy:", etherscanError);
    }
    
    // Fourth, try metadata.ens.domains for .box domains
    try {
      const metadataUrl = `https://metadata.ens.domains/optimism/avatar/${identity}`;
      const metadataResponse = await fetch(metadataUrl, { method: 'HEAD' });
      
      if (metadataResponse.ok) {
        console.log(`Found .box avatar via ENS metadata service for ${identity}`);
        avatarCache[identity] = metadataUrl;
        return metadataUrl;
      }
    } catch (ensError) {
      console.error(`Error fetching ENS avatar from metadata for ${identity}:`, ensError);
    }
    
    // Fifth, try OpenSea method to get avatar from NFTs
    const openSeaAvatar = await fetchDotBoxAvatar(identity);
    if (openSeaAvatar) {
      console.log(`Found .box avatar via OpenSea for ${identity}:`, openSeaAvatar);
      avatarCache[identity] = openSeaAvatar;
      return openSeaAvatar;
    }
    
    // Try the native .bit API
    const bitProfile = await fetch(`https://indexer-v1.did.id/v1/account/records?account=${identity}&key=profile.avatar`);
    if (bitProfile.ok) {
      const bitData = await bitProfile.json();
      if (bitData?.data && bitData.data.length > 0 && bitData.data[0].value) {
        const avatarUrl = bitData.data[0].value;
        console.log(`Found .box avatar via .bit API for ${identity}`);
        avatarCache[identity] = avatarUrl;
        return avatarUrl;
      }
    }
    
    // Final fallback: use .box community avatar
    console.log(`Using .box community avatar as fallback for ${identity}`);
    const fallbackAvatar = '/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png';
    avatarCache[identity] = fallbackAvatar;
    return fallbackAvatar;
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    // Even on error, return the .box community avatar
    const fallbackAvatar = '/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png';
    avatarCache[identity] = fallbackAvatar;
    return fallbackAvatar;
  }
}
