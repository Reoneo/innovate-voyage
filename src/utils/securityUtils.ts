// Security utilities for handling sensitive data
export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      // Simple encryption for localStorage (in production, use proper encryption)
      const encrypted = btoa(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure item');
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return atob(encrypted);
    } catch (error) {
      console.error('Failed to retrieve secure item');
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};

// Input validation utilities
export const validateInput = {
  isValidEthereumAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
  
  isValidENS: (ens: string): boolean => {
    return /^[a-zA-Z0-9-]+\.eth$/.test(ens);
  },
  
  sanitizeString: (input: string): string => {
    return input.replace(/[<>'"&]/g, '');
  },
  
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

// API key management has been moved to Supabase Edge Functions for security.
