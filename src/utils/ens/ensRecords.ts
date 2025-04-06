
import { mainnetProvider } from '../ethereumProviders';
import { fetchWeb3BioProfile } from '../../api/utils/web3Utils';

/**
 * Gets avatar for an ENS name
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    console.log(`Getting avatar for ${ensName}`);
    
    // Try web3.bio API first - preferred method
    const profile = await fetchWeb3BioProfile(ensName);
    if (profile && profile.avatar) {
      console.log(`Got avatar for ${ensName} from web3.bio:`, profile.avatar);
      let avatar = profile.avatar;
      
      // Handle IPFS URLs
      if (avatar && avatar.startsWith("ipfs://")) {
        const cid = avatar.replace("ipfs://", "");
        avatar = `https://ipfs.io/ipfs/${cid}`;
        console.log(`Converted IPFS avatar URL: ${avatar}`);
      }
      
      return avatar;
    }
    
    console.log(`No avatar found for ${ensName} in web3.bio, falling back to other methods`);
    
    // Fallback: Try to use resolver directly - only for ENS domains on mainnet
    if (ensName.endsWith('.eth')) {
      try {
        const provider = mainnetProvider;
        const resolver = await provider.getResolver(ensName);
        
        if (resolver) {
          console.log(`Got resolver for ${ensName}`);
          let avatar = await resolver.getText('avatar');
          
          if (avatar) {
            console.log(`Got avatar for ${ensName}:`, avatar);
            
            // Handle IPFS URLs
            if (avatar && avatar.startsWith("ipfs://")) {
              const cid = avatar.replace("ipfs://", "");
              avatar = `https://ipfs.io/ipfs/${cid}`;
              console.log(`Converted IPFS avatar URL: ${avatar}`);
            }
            
            return avatar;
          } else {
            console.log(`No avatar found for ${ensName} in resolver`);
          }
        } else {
          console.log(`No resolver found for ${ensName}`);
        }
      } catch (resolverError) {
        console.error(`Error using resolver for ${ensName}:`, resolverError);
      }
    }
    
    // If still nothing, return null
    return null;
  } catch (avatarError) {
    console.error(`Error fetching avatar for ${ensName}:`, avatarError);
    return null;
  }
}

/**
 * Gets ENS bio data
 */
export async function getEnsBio(ensName: string, network = 'mainnet'): Promise<string | null> {
  try {
    if (!ensName) return null;
    
    // Use web3.bio API to get description/bio
    const profile = await fetchWeb3BioProfile(ensName);
    if (profile && profile.description) {
      return profile.description;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ENS bio: ${error}`);
    return null;
  }
}
