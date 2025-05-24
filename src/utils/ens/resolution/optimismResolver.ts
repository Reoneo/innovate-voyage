
import { mainnetProvider } from '../../ethereumProviders';

/**
 * Resolve .box domains using mainnet ENS (treating .box as .eth)
 */
export async function resolveBoxDomainOnOptimism(boxDomain: string): Promise<string | null> {
  if (!boxDomain.endsWith('.box')) return null;
  
  try {
    console.log(`Resolving ${boxDomain} via mainnet ENS`);
    
    // Convert .box to .eth for ENS resolution
    const ethEquivalent = boxDomain.replace('.box', '.eth');
    
    // Use mainnet ENS resolution for .box domains
    try {
      const resolver = await mainnetProvider.getResolver(ethEquivalent);
      if (resolver) {
        const address = await resolver.getAddress();
        if (address && address !== '0x0000000000000000000000000000000000000000') {
          console.log(`Mainnet ENS resolved ${boxDomain} to ${address}`);
          return address;
        }
      }
    } catch (error) {
      console.log(`Mainnet ENS resolution failed for ${boxDomain}:`, error);
    }
    
    // Fallback to direct resolveName
    try {
      const address = await mainnetProvider.resolveName(ethEquivalent);
      if (address && address !== '0x0000000000000000000000000000000000000000') {
        console.log(`Mainnet resolveName found ${address} for ${boxDomain}`);
        return address;
      }
    } catch (error) {
      console.log(`Mainnet resolveName failed for ${boxDomain}:`, error);
    }
    
    return null;
  } catch (error) {
    console.error(`Error resolving ${boxDomain} via mainnet ENS:`, error);
    return null;
  }
}

/**
 * Lookup address to .box domain using mainnet ENS
 */
export async function lookupAddressOnOptimism(address: string): Promise<string | null> {
  try {
    console.log(`Looking up address ${address} on mainnet for .box domains`);
    
    // Use mainnet ENS for reverse lookup
    try {
      const ensName = await mainnetProvider.lookupAddress(address);
      if (ensName) {
        console.log(`Found ENS name on mainnet: ${ensName} for ${address}`);
        // Convert .eth to .box if applicable
        return ensName.endsWith('.eth') ? ensName.replace('.eth', '.box') : ensName;
      }
    } catch (error) {
      console.log(`Mainnet lookup failed for ${address}:`, error);
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up address ${address} on mainnet:`, error);
    return null;
  }
}
