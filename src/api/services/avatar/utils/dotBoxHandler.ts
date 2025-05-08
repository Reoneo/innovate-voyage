
import { avatarCache } from '../../../utils/web3/index';
import { fetchDotBoxAvatar } from '../../openseaService';
import { ccipReadEnabled } from '../../../../utils/ens/ccipReadHandler';

// Etherscan API key for .box domains
const OPTIMISM_ETHERSCAN_API_KEY = "MWRCM8Q9RIGEVBT6WJ1VUNDYPAHN4M91FU";

export async function handleDotBoxAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching .box avatar for ${identity}`);
    
    // First try CCIP-Read compatible resolver to get the avatar
    const boxData = await ccipReadEnabled.resolveDotBit(identity);
    if (boxData && boxData.avatar) {
      console.log(`Found .box avatar via CCIP-Read for ${identity}:`, boxData.avatar);
      avatarCache[identity] = boxData.avatar;
      return boxData.avatar;
    }
    
    // Second, try Optimism Etherscan API to get data
    const etherscanUrl = `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${boxData?.address || identity}&startblock=0&endblock=99999999&sort=desc&apikey=${OPTIMISM_ETHERSCAN_API_KEY}`;
    try {
      const etherscanResponse = await fetch(etherscanUrl);
      if (etherscanResponse.ok) {
        const etherscanData = await etherscanResponse.json();
        console.log(`Got Optimism Etherscan data for ${identity}`);
        // Continue with other methods as we just want the transactions data for metadata
      }
    } catch (etherscanError) {
      console.error("Error fetching from Optimism Etherscan:", etherscanError);
    }
    
    // Third, try OpenSea method to get avatar from NFTs
    const openSeaAvatar = await fetchDotBoxAvatar(identity);
    if (openSeaAvatar) {
      console.log(`Found .box avatar via OpenSea for ${identity}:`, openSeaAvatar);
      avatarCache[identity] = openSeaAvatar;
      return openSeaAvatar;
    }
    
    // Try the web3.bio API
    const boxProfile = await fetch(`https://api.web3.bio/profile/dotbit/${identity}?nocache=${Date.now()}`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNDkyNzREIiwiZXhwIjoyMjA1OTExMzI0LCJyb2xlIjo2fQ.dGQ7o_ItgDU8X_MxBlja4in7qvGWtmKXjqhCHq2gX20`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (boxProfile.ok) {
      const boxData = await boxProfile.json();
      if (boxData && boxData.avatar) {
        console.log(`Found .box avatar via web3.bio for ${identity}`);
        avatarCache[identity] = boxData.avatar;
        return boxData.avatar;
      }
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
    
    // Try the ENS API from GitHub (gskril/ens-api)
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
    
    return null;
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    return null;
  }
}
