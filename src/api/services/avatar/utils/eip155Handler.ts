
import { avatarCache } from '../../../utils/web3/index';

/**
 * Handles EIP155 formatted avatar URIs (NFT avatars)
 * @param identity The EIP155 formatted URI
 * @returns A URL to the avatar image or null
 */
export async function handleEip155Avatar(identity: string): Promise<string | null> {
  try {
    console.log(`Parsing EIP155 format: ${identity}`);
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
    
    console.log(`Parsed EIP155: Contract=${contractAddress}, TokenId=${tokenId}`);
    
    if (contractAddress && tokenId) {
      // Try the ENS avatar service with the EIP155 format directly
      const avatar = await tryEnsMetadataService(identity);
      if (avatar) return avatar;
      
      // Try OpenSea API format
      const openseaAvatar = await tryOpenSeaApi(contractAddress, tokenId);
      if (openseaAvatar) return openseaAvatar;
      
      // Try NFT.Storage gateway format
      const nftStorageAvatar = await tryNftStorageGateway(tokenId);
      if (nftStorageAvatar) return nftStorageAvatar;
      
      // Try direct IPFS gateway using the token ID if it looks like an IPFS hash
      if (tokenId && tokenId.length > 30) {
        const ipfsAvatar = await tryIpfsGateway(tokenId);
        if (ipfsAvatar) return ipfsAvatar;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error handling EIP155 avatar for ${identity}:`, error);
    return null;
  }
}

/**
 * Try to fetch avatar from ENS metadata service
 */
async function tryEnsMetadataService(identity: string): Promise<string | null> {
  const ensAvatarUrl = `https://metadata.ens.domains/mainnet/avatar/${identity}`;
  try {
    const response = await fetch(ensAvatarUrl, { method: 'HEAD' });
    if (response.ok) {
      console.log(`Found avatar via ENS metadata for EIP155 ${identity}`);
      avatarCache[identity] = ensAvatarUrl;
      return ensAvatarUrl;
    }
  } catch (error) {
    console.error(`Error fetching from ENS metadata for ${identity}:`, error);
  }
  return null;
}

/**
 * Try to fetch avatar from OpenSea API
 */
async function tryOpenSeaApi(contractAddress: string, tokenId: string): Promise<string | null> {
  const openseaUrl = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/?format=json`;
  try {
    const response = await fetch(openseaUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.image_url) {
        console.log(`Found avatar via OpenSea for contract=${contractAddress}, tokenId=${tokenId}`);
        avatarCache[`eip155:1/erc721:${contractAddress}/${tokenId}`] = data.image_url;
        return data.image_url;
      }
    }
  } catch (error) {
    console.error(`Error fetching from OpenSea for contract=${contractAddress}, tokenId=${tokenId}:`, error);
  }
  return null;
}

/**
 * Try to fetch avatar from NFT.Storage gateway
 */
async function tryNftStorageGateway(tokenId: string): Promise<string | null> {
  const nftStorageUrl = `https://nftstorage.link/ipfs/${tokenId}`;
  try {
    const response = await fetch(nftStorageUrl, { method: 'HEAD' });
    if (response.ok) {
      console.log(`Found avatar via NFT.Storage for tokenId=${tokenId}`);
      avatarCache[`ipfs://${tokenId}`] = nftStorageUrl;
      return nftStorageUrl;
    }
  } catch (error) {
    console.error(`Error fetching from NFT.Storage for tokenId=${tokenId}:`, error);
  }
  return null;
}

/**
 * Try to fetch avatar from IPFS gateway
 */
async function tryIpfsGateway(tokenId: string): Promise<string | null> {
  const ipfsUrl = `https://ipfs.io/ipfs/${tokenId}`;
  try {
    const response = await fetch(ipfsUrl, { method: 'HEAD' });
    if (response.ok) {
      console.log(`Found avatar via IPFS for tokenId=${tokenId}`);
      avatarCache[`ipfs://${tokenId}`] = ipfsUrl;
      return ipfsUrl;
    }
  } catch (error) {
    console.error(`Error fetching from IPFS for tokenId=${tokenId}:`, error);
  }
  return null;
}
