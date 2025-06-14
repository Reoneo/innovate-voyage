
// Security utilities for handling sensitive data
export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      // Improved simple "encryption": ROT13 in addition to base64, for demonstration (not strong!)
      const rot13 = (s: string) => s.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(
          c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13)
        )
      );
      const encrypted = btoa(rot13(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure item');
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      const rot13 = (s: string) => s.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(
          c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13)
        )
      );
      const base64Decoded = atob(encrypted);
      return rot13(base64Decoded);
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
    // Remove any HTML-special characters
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
