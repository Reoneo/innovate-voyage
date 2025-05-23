
/**
 * Different resolution methods for ENS names and addresses
 */
import { mainnetProvider } from '../../ethereumProviders';
import { ccipReadEnabled } from '../ccipReadHandler';
import { resolveBoxDomainOnOptimism, lookupAddressOnOptimism } from './optimismResolver';
import { STANDARD_TIMEOUT } from './constants';
import { setupTimeoutController } from './timeoutUtils';

/**
 * Resolve ENS name using CCIP-Read for .box domains
 */
export async function resolveDotBoxDomain(ensName: string): Promise<string | null> {
  if (!ensName.endsWith('.box')) return null;
  
  console.log(`Resolving .box domain: ${ensName}`);
  
  // First try Optimism network resolution
  try {
    const optimismResult = await resolveBoxDomainOnOptimism(ensName);
    if (optimismResult) {
      console.log(`Optimism resolved ${ensName} to ${optimismResult}`);
      return optimismResult;
    }
  } catch (error) {
    console.warn(`Optimism resolution failed for ${ensName}:`, error);
  }
  
  // Then try CCIP-Read
  try {
    const boxResult = await ccipReadEnabled.resolveDotBit(ensName);
    if (boxResult && boxResult.address) {
      console.log(`CCIP-Read resolved ${ensName} to ${boxResult.address}`);
      return boxResult.address;
    }
  } catch (ccipError) {
    console.warn(`CCIP-Read error for ${ensName}:`, ccipError);
  }
  
  return null;
}

/**
 * Try to resolve ENS name using direct resolver
 */
export async function resolveWithDirectResolver(ensName: string): Promise<string | null> {
  try {
    const resolver = await mainnetProvider.getResolver(ensName);
    if (resolver) {
      const address = await resolver.getAddress();
      if (address) {
        console.log(`Direct resolver found ${address} for ${ensName}`);
        return address;
      }
    }
    return null;
  } catch (error) {
    console.warn(`Error with direct resolver for ${ensName}:`, error);
    return null;
  }
}

/**
 * Try to resolve ENS name using resolveName
 */
export async function resolveWithResolveName(ensName: string): Promise<string | null> {
  try {
    const address = await mainnetProvider.resolveName(ensName);
    if (address) {
      console.log(`resolveName found ${address} for ${ensName}`);
      return address;
    }
    return null;
  } catch (error) {
    console.warn(`Error with resolveName for ${ensName}:`, error);
    return null;
  }
}

/**
 * Lookup address to ENS name using standard method
 */
export async function standardEnsLookup(address: string, timeoutMs = STANDARD_TIMEOUT): Promise<string | null> {
  try {
    console.log(`Looking up ENS for address: ${address} on Mainnet`);
    const { controller, clear } = setupTimeoutController(timeoutMs);
    
    try {
      // Using lookupAddress
      const ensName = await mainnetProvider.lookupAddress(address);
      
      if (ensName) {
        console.log(`Found ENS name for ${address}: ${ensName}`);
        return ensName;
      }
      return null;
    } finally {
      clear();
    }
  } catch (error) {
    console.warn(`Error in standard ENS lookup for ${address}:`, error);
    return null;
  }
}

/**
 * Lookup address to .box domains using multiple methods
 */
export async function dotBoxLookup(address: string, timeoutMs = STANDARD_TIMEOUT): Promise<string | null> {
  try {
    console.log(`Looking up .box domains for address: ${address}`);
    const { controller, clear } = setupTimeoutController(timeoutMs);
    
    try {
      // First try Optimism network
      const optimismResult = await lookupAddressOnOptimism(address);
      if (optimismResult) {
        // Convert .eth result to .box
        const boxDomain = optimismResult.endsWith('.eth') 
          ? optimismResult.replace('.eth', '.box')
          : optimismResult;
        console.log(`Found .box domain on Optimism for ${address}: ${boxDomain}`);
        return boxDomain;
      }
      
      // Then try CCIP-Read
      const boxDomains = await ccipReadEnabled.getDotBitByAddress(address);
      if (boxDomains && boxDomains.length > 0) {
        console.log(`Found .box domains via CCIP for ${address}:`, boxDomains);
        return boxDomains[0];
      }
      
      return null;
    } finally {
      clear();
    }
  } catch (error) {
    console.warn(`Error in .box lookup for ${address}:`, error);
    return null;
  }
}
