
/**
 * Validation utilities for ENS resolution
 */

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
