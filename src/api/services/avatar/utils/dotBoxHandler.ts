
import { avatarCache } from '../../../utils/web3/index';
import { fetchDotBoxAvatar } from '../../openseaService';
import { ccipReadEnabled } from '../../../../utils/ens/ccipReadHandler';

// Etherscan API key for .box domains
const OPTIMISM_ETHERSCAN_API_KEY = "MWRCM8Q9RIGEVBT6WJ1VUNDYPAHN4M91FU";

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
    try {
      const boxData = await ccipReadEnabled.resolveDotBit(identity);
      if (boxData && boxData.avatar) {
        console.log(`Found .box avatar via CCIP-Read for ${identity}:`, boxData.avatar);
        avatarCache[identity] = boxData.avatar;
        return boxData.avatar;
      }
    } catch (ccipError) {
      console.error(`Error using CCIP-Read for ${identity}:`, ccipError);
    }
    
    // Third, try Optimism Etherscan API to get metadata
    try {
      const address = await ccipReadEnabled.resolveDotBitAddress(identity);
      if (address) {
        const etherscanUrl = `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${OPTIMISM_ETHERSCAN_API_KEY}`;
        const etherscanResponse = await fetch(etherscanUrl);
        if (etherscanResponse.ok) {
          console.log(`Got Optimism Etherscan data for ${identity}`);
          // Continue with other methods as we just want the transactions data for metadata
        }
      }
    } catch (etherscanError) {
      console.error("Error fetching from Optimism Etherscan:", etherscanError);
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
    try {
      const openSeaAvatar = await fetchDotBoxAvatar(identity);
      if (openSeaAvatar) {
        console.log(`Found .box avatar via OpenSea for ${identity}:`, openSeaAvatar);
        avatarCache[identity] = openSeaAvatar;
        return openSeaAvatar;
      }
    } catch (openSeaError) {
      console.error(`Error fetching from OpenSea for ${identity}:`, openSeaError);
    }
    
    // Try the native .bit API
    try {
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
    } catch (bitError) {
      console.error(`Error fetching from .bit API for ${identity}:`, bitError);
    }
    
    // Use the .box logo as a last resort
    console.log(`Using .box logo as fallback for ${identity}`);
    const boxLogoUrl = '/lovable-uploads/59ba9d7c-9742-4036-9b8d-1aedefc54748.png';
    avatarCache[identity] = boxLogoUrl;
    return boxLogoUrl;
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    // Return the .box logo as fallback
    return '/lovable-uploads/59ba9d7c-9742-4036-9b8d-1aedefc54748.png';
  }
}
