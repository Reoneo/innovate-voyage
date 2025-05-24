
import { mainnetProvider } from '../ethereumProviders';
import { fetchWeb3BioProfile } from '../../api/utils/web3Utils';
import { getRealAvatar } from '../../api/services/avatarService';
import { ccipReadEnabled } from './ccipReadHandler';

/**
 * Gets avatar for an ENS name - optimized for speed
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    console.log(`Getting avatar for ${ensName}`);
    
    // Special handling for .box domains
    if (ensName.endsWith('.box')) {
      console.log(`Using CCIP-Read to get .box avatar for ${ensName}`);
      const boxData = await ccipReadEnabled.resolveDotBit(ensName);
      
      if (boxData && boxData.avatar) {
        console.log(`Got .box avatar from CCIP-Read: ${boxData.avatar}`);
        return boxData.avatar;
      }
    }
    
    // For .eth domains, try the fast ENS metadata service first
    if (ensName.endsWith('.eth')) {
      try {
        const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
        const metadataResponse = await fetch(metadataUrl, { 
          method: 'HEAD',
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'max-age=300'
          }
        });
        
        if (metadataResponse.ok) {
          console.log(`Got avatar for ${ensName} from ENS metadata service`);
          return metadataUrl;
        }
      } catch (metadataError) {
        console.error(`Error using ENS metadata service for ${ensName}:`, metadataError);
      }
    }
    
    // Fallback: Use the refactored getRealAvatar function which handles all cases
    const avatar = await getRealAvatar(ensName);
    if (avatar) {
      console.log(`Got avatar for ${ensName} -> ${avatar}`);
      return avatar;
    }
    
    // Final fallback: Try to use resolver directly - only for ENS domains on mainnet
    if (ensName.endsWith('.eth')) {
      try {
        const provider = mainnetProvider;
        const resolver = await provider.getResolver(ensName);
        
        if (resolver) {
          console.log(`Got resolver for ${ensName}`);
          const avatar = await resolver.getText('avatar');
          
          if (avatar) {
            console.log(`Got avatar for ${ensName}:`, avatar);
            
            // If the avatar is in EIP155 format or any other format,
            // use getRealAvatar to resolve it
            return await getRealAvatar(avatar);
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
    
    // Special handling for .box domains
    if (ensName.endsWith('.box')) {
      console.log(`Using CCIP-Read to get .box bio for ${ensName}`);
      const boxData = await ccipReadEnabled.resolveDotBit(ensName);
      
      // Check for profile description in the dot bit data
      if (boxData) {
        const response = await fetch(`https://indexer-v1.did.id/v1/account/records?account=${ensName}&key=profile.description`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.data && data.data.length > 0) {
            return data.data[0].value;
          }
        }
      }
    }
    
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
