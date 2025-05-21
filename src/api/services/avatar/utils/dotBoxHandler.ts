
import { avatarCache } from '../../../utils/web3/index';
import { fetchDotBoxAvatar } from '../../openseaService';
import { ccipReadEnabled } from '../../../../utils/ens/ccipReadHandler';
import { mainnetProvider } from '../../../../utils/ethereumProviders';

export async function handleDotBoxAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching .box avatar for ${identity}`);
    
    // First try standard ENS methods - treat .box like .eth
    try {
      const resolver = await mainnetProvider.getResolver(identity);
      if (resolver) {
        try {
          const avatar = await resolver.getText('avatar');
          if (avatar) {
            console.log(`Found .box avatar via standard resolver: ${avatar}`);
            avatarCache[identity] = avatar;
            return avatar;
          }
        } catch (error) {
          console.log(`No avatar text record for ${identity}:`, error);
        }
      }
    } catch (error) {
      console.log(`No standard resolver for ${identity}:`, error);
    }
    
    // Try ENS metadata service direct URL
    try {
      const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
      const metadataResponse = await fetch(metadataUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      });
      if (metadataResponse.ok) {
        console.log(`Found .box avatar via ENS metadata: ${metadataUrl}`);
        avatarCache[identity] = metadataUrl;
        return metadataUrl;
      }
    } catch (error) {
      console.log(`No ENS metadata avatar for ${identity}:`, error);
    }
    
    // Try the gskril/ens-api
    try {
      const ensResponse = await fetch(`https://ens-api.vercel.app/api/${identity}`, {
        signal: AbortSignal.timeout(3000)
      });
      if (ensResponse.ok) {
        const ensData = await ensResponse.json();
        if (ensData && ensData.avatar) {
          console.log(`Found .box avatar via gskril/ens-api: ${ensData.avatar}`);
          avatarCache[identity] = ensData.avatar;
          return ensData.avatar;
        }
      }
    } catch (ensApiError) {
      console.log(`Error fetching from ENS API for ${identity}:`, ensApiError);
    }
    
    // Try CCIP-Read compatible resolver
    try {
      const boxData = await ccipReadEnabled.resolveDotBit(identity);
      if (boxData && boxData.avatar) {
        console.log(`Found .box avatar via CCIP-Read: ${boxData.avatar}`);
        avatarCache[identity] = boxData.avatar;
        return boxData.avatar;
      }
    } catch (error) {
      console.log(`CCIP-Read error for ${identity}:`, error);
    }
    
    // Try the native .bit API
    try {
      const bitProfile = await fetch(
        `https://indexer-v1.did.id/v1/account/records?account=${identity}&key=profile.avatar`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (bitProfile.ok) {
        const bitData = await bitProfile.json();
        if (bitData?.data && bitData.data.length > 0 && bitData.data[0].value) {
          const avatarUrl = bitData.data[0].value;
          console.log(`Found .box avatar via .bit API: ${avatarUrl}`);
          avatarCache[identity] = avatarUrl;
          return avatarUrl;
        }
      }
    } catch (error) {
      console.log(`Error fetching .bit API for ${identity}:`, error);
    }
    
    // Try OpenSea method to get avatar from NFTs
    const openSeaAvatar = await fetchDotBoxAvatar(identity);
    if (openSeaAvatar) {
      console.log(`Found .box avatar via OpenSea: ${openSeaAvatar}`);
      avatarCache[identity] = openSeaAvatar;
      return openSeaAvatar;
    }
    
    // Return robohash as fallback
    const fallbackAvatar = `https://robohash.org/${identity}?set=set4`;
    console.log(`Using fallback avatar for ${identity}: ${fallbackAvatar}`);
    avatarCache[identity] = fallbackAvatar;
    return fallbackAvatar;
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    const fallbackAvatar = `https://robohash.org/${identity}?set=set4`;
    avatarCache[identity] = fallbackAvatar;
    return fallbackAvatar;
  }
}
