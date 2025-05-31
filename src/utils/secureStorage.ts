
// Secure storage utilities for handling sensitive data
import { toast } from 'sonner';

// Simple encryption for localStorage (basic obfuscation)
const STORAGE_KEY_PREFIX = 'secure_';
const ENCRYPTION_KEY = 'talent_protocol_2024';

// Basic encryption/decryption (for demonstration - use proper encryption in production)
function simpleEncrypt(text: string): string {
  return btoa(text + '|' + ENCRYPTION_KEY);
}

function simpleDecrypt(encrypted: string): string | null {
  try {
    const decoded = atob(encrypted);
    const [text, key] = decoded.split('|');
    return key === ENCRYPTION_KEY ? text : null;
  } catch {
    return null;
  }
}

export const secureStorage = {
  // Store sensitive data with encryption
  setSecureItem: (key: string, value: string): void => {
    try {
      const encrypted = simpleEncrypt(value);
      localStorage.setItem(STORAGE_KEY_PREFIX + key, encrypted);
    } catch (error) {
      console.warn('Failed to store secure item:', key);
    }
  },

  // Retrieve and decrypt sensitive data
  getSecureItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (!encrypted) return null;
      return simpleDecrypt(encrypted);
    } catch (error) {
      console.warn('Failed to retrieve secure item:', key);
      return null;
    }
  },

  // Remove sensitive data
  removeSecureItem: (key: string): void => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + key);
  },

  // Store wallet address securely
  setWalletAddress: (address: string): void => {
    secureStorage.setSecureItem('wallet_address', address);
    // Set expiration (24 hours)
    const expiration = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('wallet_address_expires', expiration.toString());
  },

  // Get wallet address if not expired
  getWalletAddress: (): string | null => {
    const expiration = localStorage.getItem('wallet_address_expires');
    if (expiration && Date.now() > parseInt(expiration)) {
      secureStorage.removeSecureItem('wallet_address');
      localStorage.removeItem('wallet_address_expires');
      return null;
    }
    return secureStorage.getSecureItem('wallet_address');
  },

  // Clear all secure storage
  clearAll: (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('wallet_address_expires');
  }
};

// Input validation utilities
export const validateInput = {
  // Validate Ethereum address
  ethereumAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  // Validate ENS name
  ensName: (name: string): boolean => {
    return /^[a-zA-Z0-9-]+\.eth$/.test(name) && name.length <= 255;
  },

  // Sanitize string input
  sanitizeString: (input: string): string => {
    return input.replace(/[<>'"&]/g, '');
  },

  // Validate URL
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};
