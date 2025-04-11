
import { avatarCache } from '../../../utils/web3/index';

/**
 * Handle IPFS URIs
 * @param identity IPFS URI
 * @returns Resolved gateway URL or null
 */
export async function handleIpfsUri(identity: string): Promise<string | null> {
  try {
    if (identity.includes('ipfs://')) {
      const ipfsPath = identity.replace('ipfs://', '');
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsPath}`;
      try {
        const response = await fetch(ipfsUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log(`Found avatar via IPFS gateway for ${identity}`);
          avatarCache[identity] = ipfsUrl;
          return ipfsUrl;
        }
      } catch (error) {
        console.error(`Error fetching from IPFS gateway for ${identity}:`, error);
      }
    }
    return null;
  } catch (error) {
    console.error(`Error handling IPFS URI for ${identity}:`, error);
    return null;
  }
}
