
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
    
    // Try direct resolution on Optimism first
    try {
      const resolver = await optimismProvider.getResolver(ethEquivalent);
      if (resolver) {
        const address = await resolver.getAddress();
        if (address) {
          console.log(`Optimism resolver found ${address} for ${boxDomain}`);
          return address;
        }
      }
    } catch (error) {
      console.log(`Optimism direct resolution failed for ${boxDomain}:`, error);
    }
    
    // Try Optimism Etherscan API for .box domains
    try {
      const response = await fetch(
        `https://api-optimistic.etherscan.io/api?module=ens&action=resolve&name=${ethEquivalent}&apikey=YourApiKeyToken`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === '1' && data.result) {
          console.log(`Optimism Etherscan resolved ${boxDomain} to ${data.result}`);
          return data.result;
        }
      }
    } catch (error) {
      console.log(`Optimism Etherscan API failed for ${boxDomain}:`, error);
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
    
    // Try direct lookup on Optimism
    const ensName = await optimismProvider.lookupAddress(address);
    if (ensName) {
      console.log(`Found ENS name on Optimism: ${ensName} for ${address}`);
      return ensName;
    }
    
    // Try Optimism Etherscan API for reverse resolution
    try {
      const response = await fetch(
        `https://api-optimistic.etherscan.io/api?module=ens&action=getensaddress&address=${address}&apikey=YourApiKeyToken`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === '1' && data.result !== '0x0000000000000000000000000000000000000000') {
          console.log(`Optimism Etherscan found ENS for ${address}: ${data.result}`);
          return data.result;
        }
      }
    } catch (error) {
      console.log(`Optimism Etherscan reverse lookup failed for ${address}:`, error);
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up address ${address} on Optimism:`, error);
    return null;
  }
}
