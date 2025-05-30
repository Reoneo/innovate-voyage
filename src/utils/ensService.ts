
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import { createEnsPublicClient } from '@ensdomains/ensjs';

// Create the ENS client
const ensClient = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Get the primary ENS name for an address using @ensdomains/ensjs
 */
export async function getPrimaryName(address: string): Promise<string | null> {
  try {
    console.log(`Getting primary name for address: ${address}`);
    
    const result = await ensClient.getName({
      address: address as `0x${string}`,
    });
    
    console.log(`Primary name result:`, result);
    return result?.name || null;
  } catch (error) {
    console.error(`Error getting primary name for ${address}:`, error);
    return null;
  }
}

/**
 * Get the address for an ENS name using @ensdomains/ensjs
 */
export async function getAddressRecord(name: string): Promise<string | null> {
  try {
    console.log(`Getting address for ENS name: ${name}`);
    
    const result = await ensClient.getAddressRecord({
      name,
    });
    
    console.log(`Address record result:`, result);
    return result?.value || null;
  } catch (error) {
    console.error(`Error getting address for ${name}:`, error);
    return null;
  }
}

/**
 * Get avatar for an ENS name using @ensdomains/ensjs
 */
export async function getAvatarRecord(name: string): Promise<string | null> {
  try {
    console.log(`Getting avatar for ENS name: ${name}`);
    
    const result = await ensClient.getTextRecord({
      name,
      key: 'avatar',
    });
    
    console.log(`Avatar record result:`, result);
    return result?.value || null;
  } catch (error) {
    console.error(`Error getting avatar for ${name}:`, error);
    return null;
  }
}
