
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import { createEnsPublicClient } from '@ensdomains/ensjs';

// Create the ENS client with mainnet configuration
export const ensClient = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

// Export specific ENS functions for convenience
export const getAddressRecord = async (name: string) => {
  try {
    return await ensClient.getAddressRecord({ name });
  } catch (error) {
    console.error(`Error getting address record for ${name}:`, error);
    return null;
  }
};

export const getTextRecord = async (name: string, key: string) => {
  try {
    return await ensClient.getTextRecord({ name, key });
  } catch (error) {
    console.error(`Error getting text record ${key} for ${name}:`, error);
    return null;
  }
};

export const getName = async (address: `0x${string}`) => {
  try {
    return await ensClient.getName({ address });
  } catch (error) {
    console.error(`Error getting name for ${address}:`, error);
    return null;
  }
};

export const getAvatar = async (name: string) => {
  try {
    const result = await ensClient.getTextRecord({ name, key: 'avatar' });
    return result;
  } catch (error) {
    console.error(`Error getting avatar for ${name}:`, error);
    return null;
  }
};

// Utility functions to check if a string is a valid ENS name
export const isEnsName = (name: string): boolean => {
  return typeof name === 'string' && (name.endsWith('.eth') || name.endsWith('.box'));
};

// Normalize ENS name by adding .eth suffix if missing and not containing another TLD
export const normalizeEnsDomain = (ensName: string): string => {
  // Already has a TLD
  if (ensName.includes('.')) {
    return ensName;
  }
  
  // Add .eth for names without a TLD
  return `${ensName}.eth`;
};
