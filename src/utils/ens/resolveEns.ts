
import { mainnetProvider } from '../ethereumProviders';

// ENS API base URL - you can change this to your self-hosted instance
const ENS_API_BASE = 'https://ens-api.vercel.app';

/**
 * Resolves an ENS name to an address using ENS API
 * @param ensName ENS name to resolve
 * @returns Resolved address or null if not found
 */
export async function resolveEnsToAddress(ensName: string) {
  // Check if the input is actually an ENS name
  if (!ensName || (!ensName.includes('.eth') && !ensName.includes('.box'))) {
    console.log(`Invalid ENS name format: ${ensName}`);
    return null;
  }
  
  console.log(`Resolving ENS name: ${ensName} using ENS API`);
  
  try {
    // Use ENS API for resolution
    const response = await fetch(`${ENS_API_BASE}/name/${ensName}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        console.log(`ENS API resolution result for ${ensName}:`, data.address);
        return data.address;
      }
    }
    
    // Fallback to direct provider resolution for .eth domains
    if (ensName.endsWith('.eth')) {
      console.log(`Falling back to provider resolution for ${ensName}`);
      const provider = mainnetProvider;
      
      const resolvePromise = provider.resolveName(ensName);
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('ENS resolution timeout')), 5000)
      );
      
      const resolvedAddress = await Promise.race([
        resolvePromise,
        timeoutPromise
      ]) as string | null;
      
      console.log(`Provider resolution result for ${ensName}:`, resolvedAddress);
      return resolvedAddress;
    }
    
    return null;
  } catch (error) {
    console.error(`Error resolving ${ensName}:`, error);
    return null;
  }
}

/**
 * Resolves an address to ENS names using ENS API
 * @param address Ethereum address to resolve
 * @returns Object containing ENS name and network or null if not found
 */
export async function resolveAddressToEns(address: string) {
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.log(`Invalid Ethereum address format: ${address}`);
    return null;
  }
  
  console.log(`Looking up ENS for address: ${address} using ENS API`);
  
  try {
    // Use ENS API for reverse resolution
    const response = await fetch(`${ENS_API_BASE}/address/${address}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.name) {
        console.log(`ENS API lookup result for ${address}:`, data.name);
        return { ensName: data.name, network: 'mainnet' as const };
      }
    }
    
    // Fallback to provider lookup
    console.log(`Falling back to provider lookup for ${address}`);
    const provider = mainnetProvider;
    
    const lookupPromise = provider.lookupAddress(address);
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('ENS lookup timeout')), 5000)
    );
    
    const ensName = await Promise.race([
      lookupPromise,
      timeoutPromise
    ]) as string | null;
    
    if (ensName) {
      console.log(`Provider lookup result for ${address}: ${ensName}`);
      return { ensName, network: 'mainnet' as const };
    }
    
    return null;
  } catch (error) {
    console.error(`Error looking up ENS for address ${address}:`, error);
    return null;
  }
}
