import { mainnetProvider } from '../ethereumProviders';

/**
 * Gets avatar for an ENS name
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    // Always use mainnet provider regardless of network param
    const provider = mainnetProvider;
    const resolver = await provider.getResolver(ensName);
    
    if (resolver) {
      console.log(`Got resolver for ${ensName}`);
      const avatar = await resolver.getText('avatar');
      
      if (avatar) {
        console.log(`Got avatar for ${ensName}:`, avatar);
        return avatar;
      } else {
        console.log(`No avatar found for ${ensName} in resolver`);
      }
    } else {
      console.log(`No resolver found for ${ensName}`);
    }
    
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
    const profile = await fetchWeb3BioProfileForUtil(ensName);
    if (profile && profile.description) {
      return profile.description;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ENS bio: ${error}`);
    return null;
  }
}

// Helper function to fetch Web3Bio profile for utilities
async function fetchWeb3BioProfileForUtil(identity: string) {
  // Import the fetchWeb3BioProfile function dynamically to avoid circular dependencies
  const { fetchWeb3BioProfile } = await import('../../api/utils/web3Utils');
  return fetchWeb3BioProfile(identity);
}
