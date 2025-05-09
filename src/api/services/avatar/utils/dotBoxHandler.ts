
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
    const boxData = await ccipReadEnabled.resolveDotBit(identity);
    if (boxData && boxData.avatar) {
      console.log(`Found .box avatar via CCIP-Read for ${identity}:`, boxData.avatar);
      avatarCache[identity] = boxData.avatar;
      return boxData.avatar;
    }
    
    // Third, try Optimism Etherscan API to get metadata using the API key
    const address = boxData?.address || identity;
    const etherscanUrl = `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${OPTIMISM_ETHERSCAN_API_KEY}`;
    try {
      const etherscanResponse = await fetch(etherscanUrl);
      if (etherscanResponse.ok) {
        const etherscanData = await etherscanResponse.json();
        console.log(`Got Optimism Etherscan data for ${identity}`);
        
        // Try to fetch ERC-1155 tokens using the API key
        try {
          const tokenUrl = `https://api-optimistic.etherscan.io/api?module=account&action=token1155tx&address=${address}&page=1&offset=100&sort=desc&apikey=${OPTIMISM_ETHERSCAN_API_KEY}`;
          const tokenResponse = await fetch(tokenUrl);
          
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            
            if (tokenData.status === "1" && tokenData.result && tokenData.result.length > 0) {
              // Get the first token contract
              const tokenContract = tokenData.result[0].contractAddress;
              const tokenId = tokenData.result[0].tokenID;
              
              if (tokenContract && tokenId) {
                console.log(`Found ERC-1155 token for ${identity}: ${tokenContract}/${tokenId}`);
                
                // Try to get token URI/metadata
                const avatarUrl = `https://metadata.ens.domains/optimism/avatar/${identity}`;
                avatarCache[identity] = avatarUrl;
                return avatarUrl;
              }
            }
          }
        } catch (tokenError) {
          console.error(`Error fetching token data for ${identity}:`, tokenError);
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
    
    return null;
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    return null;
  }
}
