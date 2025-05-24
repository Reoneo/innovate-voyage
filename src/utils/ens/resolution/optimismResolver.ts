
import { optimismProvider } from '../../ethereumProviders';

/**
 * Resolve .box domains using Optimism network and Etherscan API
 */
export async function resolveBoxDomainOnOptimism(boxDomain: string): Promise<string | null> {
  if (!boxDomain.endsWith('.box')) return null;
  
  try {
    console.log(`Resolving ${boxDomain} on Optimism network`);
    
    // Convert .box to .eth for Optimism resolution
    const ethEquivalent = boxDomain.replace('.box', '.eth');
    
    // Try Optimism Etherscan API first for more accurate results
    try {
      const response = await fetch(
        `https://api-optimistic.etherscan.io/api?module=ens&action=resolve&name=${ethEquivalent}&apikey=YourApiKeyToken`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === '1' && data.result && data.result !== '0x0000000000000000000000000000000000000000') {
          console.log(`Optimism Etherscan resolved ${boxDomain} to ${data.result}`);
          return data.result;
        }
      }
    } catch (error) {
      console.log(`Optimism Etherscan API failed for ${boxDomain}:`, error);
    }
    
    // Try direct resolution on Optimism as fallback
    try {
      const resolver = await optimismProvider.getResolver(ethEquivalent);
      if (resolver) {
        const address = await resolver.getAddress();
        if (address && address !== '0x0000000000000000000000000000000000000000') {
          console.log(`Optimism resolver found ${address} for ${boxDomain}`);
          return address;
        }
      }
    } catch (error) {
      console.log(`Optimism direct resolution failed for ${boxDomain}:`, error);
    }
    
    return null;
  } catch (error) {
    console.error(`Error resolving ${boxDomain} on Optimism:`, error);
    return null;
  }
}

/**
 * Lookup address to .box domain using Optimism
 */
export async function lookupAddressOnOptimism(address: string): Promise<string | null> {
  try {
    console.log(`Looking up address ${address} on Optimism for .box domains`);
    
    // Try Optimism Etherscan API for reverse resolution first
    try {
      const response = await fetch(
        `https://api-optimistic.etherscan.io/api?module=ens&action=getensaddress&address=${address}&apikey=YourApiKeyToken`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === '1' && data.result && data.result !== '0x0000000000000000000000000000000000000000') {
          console.log(`Optimism Etherscan found ENS for ${address}: ${data.result}`);
          // Convert .eth result back to .box if it exists
          return data.result.endsWith('.eth') ? data.result.replace('.eth', '.box') : data.result;
        }
      }
    } catch (error) {
      console.log(`Optimism Etherscan reverse lookup failed for ${address}:`, error);
    }
    
    // Try direct lookup on Optimism as fallback
    try {
      const ensName = await optimismProvider.lookupAddress(address);
      if (ensName) {
        console.log(`Found ENS name on Optimism: ${ensName} for ${address}`);
        // Convert .eth to .box if applicable
        return ensName.endsWith('.eth') ? ensName.replace('.eth', '.box') : ensName;
      }
    } catch (error) {
      console.log(`Optimism direct lookup failed for ${address}:`, error);
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up address ${address} on Optimism:`, error);
    return null;
  }
}
