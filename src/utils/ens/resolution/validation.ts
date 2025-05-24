
/**
 * Validation utilities for ENS names and addresses
 */
import { ethers } from 'ethers';

/**
 * Validate if a string is a valid ENS name format
 */
export function validateEnsName(ensName: string): boolean {
  if (!ensName || typeof ensName !== 'string') {
    return false;
  }
  
  const trimmed = ensName.trim().toLowerCase();
  
  // Must contain a dot
  if (!trimmed.includes('.')) {
    return false;
  }
  
  // Check for valid ENS TLDs - including .box
  const validTlds = ['.eth', '.box', '.id', '.crypto', '.nft', '.x', '.wallet', '.bitcoin', '.dao', '.888', '.zil'];
  const hasValidTld = validTlds.some(tld => trimmed.endsWith(tld));
  
  if (!hasValidTld) {
    return false;
  }
  
  // Basic format validation
  const parts = trimmed.split('.');
  if (parts.length < 2) {
    return false;
  }
  
  // Each part should be non-empty and contain valid characters
  for (const part of parts) {
    if (!part || !/^[a-z0-9-]+$/.test(part)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validate if a string is a valid Ethereum address
 */
export function validateAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Get the effective ENS name for resolution
 * Converts .box to .eth for ENS lookups
 */
export function getEffectiveEnsName(ensName: string): string {
  if (!ensName) return ensName;
  
  // Convert .box domains to .eth for ENS resolution
  if (ensName.endsWith('.box')) {
    return ensName.replace('.box', '.eth');
  }
  
  return ensName;
}
