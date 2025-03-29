
import { mainnetProvider, optimismProvider } from './ethereumProviders';

/**
 * Resolves an ENS name to an address
 */
export async function resolveEnsToAddress(ensName: string) {
  const isBoxDomain = ensName.includes('.box');
  const provider = isBoxDomain ? optimismProvider : mainnetProvider;
  
  if (isBoxDomain) {
    console.log(`Resolving .box domain: ${ensName} using Optimism provider`);
  } else {
    console.log(`Resolving .eth domain: ${ensName} using Mainnet provider`);
  }
  
  try {
    const resolvedAddress = await provider.resolveName(ensName);
    console.log(`Resolution result for ${ensName}:`, resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names
 */
export async function resolveAddressToEns(address: string) {
  // Try mainnet first
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    const ensName = await mainnetProvider.lookupAddress(address);
    
    if (ensName) {
      console.log(`Found ENS name for ${address}: ${ensName}`);
      return { ensName, network: 'mainnet' };
    }
    
    // Try Optimism network
    console.log(`No ENS found on Mainnet, trying Optimism for address: ${address}`);
    const optimismEns = await optimismProvider.lookupAddress(address);
    
    if (optimismEns) {
      console.log(`Found .box name for ${address}: ${optimismEns}`);
      return { ensName: optimismEns, network: 'optimism' };
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}

/**
 * Gets avatar for an ENS name
 */
export async function getEnsAvatar(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet') {
  try {
    const provider = network === 'mainnet' ? mainnetProvider : optimismProvider;
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
