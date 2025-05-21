
import { avatarCache } from '../../../utils/web3/index';

/**
 * Handles EIP155 formatted avatar URIs (NFT avatars)
 * @param identity The EIP155 formatted URI
 * @returns A URL to the avatar image or null
 */
export async function handleEip155Avatar(identity: string): Promise<string | null> {
  try {
    console.log(`Parsing EIP155 format: ${identity}`);
    
    // Parse the EIP155 format to extract contract address and token ID
    const { contractAddress, tokenId } = parseEip155Format(identity);
    
    console.log(`Parsed EIP155: Contract=${contractAddress}, TokenId=${tokenId}`);
    
    if (contractAddress && tokenId) {
      // Try the ENS metadata service first (most reliable)
      const ensMetadataUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
      try {
        const response = await fetch(ensMetadataUrl, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        });
        if (response.ok) {
          console.log(`Found EIP155 avatar via ENS metadata for ${identity}`);
          avatarCache[identity] = ensMetadataUrl;
          return ensMetadataUrl;
        }
      } catch (error) {
        console.warn(`Could not fetch from ENS metadata for ${identity}:`, error);
      }
      
      // Try other resolution methods
      const openSeaUrl = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/?format=json`;
      try {
        const response = await fetch(openSeaUrl, {
          signal: AbortSignal.timeout(3000)
        });
        if (response.ok) {
          const data = await response.json();
          if (data.image_url) {
            console.log(`Found EIP155 avatar via OpenSea for ${identity}`);
            avatarCache[identity] = data.image_url;
            return data.image_url;
          }
        }
      } catch (error) {
        console.warn(`Could not fetch from OpenSea for ${identity}:`, error);
      }
      
      // Try IPFS URL format
      if (tokenId.startsWith('ipfs/')) {
        const ipfsHash = tokenId.replace('ipfs/', '');
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        try {
          const response = await fetch(ipfsUrl, { 
            method: 'HEAD',
            signal: AbortSignal.timeout(3000)
          });
          if (response.ok) {
            console.log(`Found EIP155 avatar via IPFS for ${identity}`);
            avatarCache[identity] = ipfsUrl;
            return ipfsUrl;
          }
        } catch (error) {
          console.warn(`Could not fetch from IPFS for ${identity}:`, error);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error handling EIP155 avatar for ${identity}:`, error);
    return null;
  }
}

/**
 * Parse EIP155 format to extract contract address and token ID
 * @param identity EIP155 formatted string
 * @returns Object with contractAddress and tokenId
 */
function parseEip155Format(identity: string): { contractAddress: string, tokenId: string } {
  // Extract contract address and token ID from the EIP155 format
  const parts = identity.split('/');
  const nftInfo = identity.split(':');
  
  // Extract contract address from the EIP155 format
  let contractAddress = '';
  if (nftInfo.length >= 3) {
    contractAddress = nftInfo[2].split('/')[0];
  }
  
  // Extract token ID - may be the last part of the string
  let tokenId = '';
  if (parts.length >= 3) {
    tokenId = parts[2];
  } else if (nftInfo.length >= 4) {
    tokenId = nftInfo[3];
  }
  
  return { contractAddress, tokenId };
}
