
import { avatarCache } from '../../../utils/web3/index';
import { fetchDotBoxAvatar } from '../../openseaService';
import { ccipReadEnabled } from '../../../../utils/ens/ccipReadHandler';

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
    
    // Second, try OpenSea method to get avatar from NFTs
    const openSeaAvatar = await fetchDotBoxAvatar(identity);
    if (openSeaAvatar) {
      console.log(`Found .box avatar via OpenSea for ${identity}:`, openSeaAvatar);
      avatarCache[identity] = openSeaAvatar;
      return openSeaAvatar;
    }
    
    // Fallback to web3.bio API
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
    
    return null;
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    return null;
  }
}
