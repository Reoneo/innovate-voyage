// Utility functions for ENS resolution
import { mainnetProvider } from '../../ethereumProviders';
import { ccipReadEnabled } from '../ccipReadHandler';
import { STANDARD_TIMEOUT } from './constants';
import { TextRecord } from './types';

/**
 * Validate ENS name format
 */
export function validateEnsName(ensName: string): boolean {
  if (!ensName) return false;
  return ensName.includes('.eth') || ensName.includes('.box') || ensName.includes('.id');
}

/**
 * Validate Ethereum address format
 */
export function validateAddress(address: string): boolean {
  if (!address) return false;
  return address.startsWith('0x') && address.length === 42;
}

/**
 * Get effective ENS name (handle .box domains as .eth)
 */
export function getEffectiveEnsName(ensName: string): string {
  // Always treat .box domains as .eth equivalents for resolution
  return ensName.endsWith('.box') 
    ? ensName.replace('.box', '.eth')
    : ensName;
}

/**
 * Setup abort controller with timeout
 */
export function setupTimeoutController(timeoutMs: number): {
  controller: AbortController;
  clear: () => void;
} {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    console.warn(`Aborting operation after ${timeoutMs}ms`);
    controller.abort();
  }, timeoutMs);
  
  return {
    controller,
    clear: () => clearTimeout(timer)
  };
}

/**
 * First successful resolution from multiple methods
 */
export async function firstSuccessful<T>(methods: (() => Promise<T>)[]): Promise<T | null> {
  for (const method of methods) {
    try {
      const result = await method();
      if (result) return result;
    } catch (e) {
      console.warn('Method failed:', e);
    }
  }
  return null;
}

/**
 * Get common ENS text record keys
 */
export async function getAllEnsTextKeys(name: string): Promise<string[]> {
  try {
    const resolver = await mainnetProvider.getResolver(name);
    if (!resolver) return getCommonTextKeys();
    
    // ENS doesn't provide a "listKeys" method, so we use a predefined list
    return getCommonTextKeys();
  } catch (error) {
    console.warn(`Error getting text keys for ${name}:`, error);
    return getCommonTextKeys();
  }
}

/**
 * Return a list of common ENS text record keys
 */
export function getCommonTextKeys(): string[] {
  return [
    "avatar",
    "avatar.ens",
    "description",
    "url",
    "com.twitter",
    "com.github",
    "com.discord",
    "org.telegram",
    "email",
    "notice",
    "keywords",
    "name",
    "location",
    "com.reddit",
    "eth.ens.delegate"
  ];
}

/**
 * Fetch text records for an ENS name
 */
export async function fetchTextRecords(
  name: string, 
  resolver: any
): Promise<Record<string, string | null>> {
  if (!resolver) return {};
  
  try {
    const textKeys = await getAllEnsTextKeys(name);
    
    // Fetch all text records in parallel
    const textResults: TextRecord[] = await Promise.all(
      textKeys.map(async key => ({
        key,
        value: await resolver.getText(key).catch(() => null)
      }))
    );
    
    // Filter out null records and convert to object
    return Object.fromEntries(
      textResults
        .filter(record => record.value !== null)
        .map(record => [record.key, record.value])
    );
  } catch (error) {
    console.warn(`Error fetching text records for ${name}:`, error);
    return {};
  }
}

/**
 * Resolve ENS name using CCIP-Read for .box domains
 */
export async function resolveDotBoxDomain(ensName: string): Promise<string | null> {
  if (!ensName.endsWith('.box')) return null;
  
  console.log(`Trying CCIP-Read for .box domain: ${ensName}`);
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
 * Lookup address to .box domains using CCIP-Read
 */
export async function dotBoxLookup(address: string, timeoutMs = STANDARD_TIMEOUT): Promise<string | null> {
  try {
    console.log(`Looking up .box domains for address: ${address}`);
    const { controller, clear } = setupTimeoutController(timeoutMs);
    
    try {
      const boxDomains = await ccipReadEnabled.getDotBitByAddress(address);
      if (boxDomains && boxDomains.length > 0) {
        console.log(`Found .box domains for ${address}:`, boxDomains);
        return boxDomains[0];
      }
      return null;
    } finally {
      clear();
    }
  } catch (error) {
    console.warn(`Error in CCIP-Read lookup for ${address}:`, error);
    return null;
  }
}
