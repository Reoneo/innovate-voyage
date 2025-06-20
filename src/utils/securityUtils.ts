
// In-memory/session storage for the encryption key
let cryptoKey: CryptoKey | null = null;

// Function to get or generate the encryption key, stored in sessionStorage to persist across reloads.
const getKey = async (): Promise<CryptoKey> => {
  if (cryptoKey) {
    return cryptoKey;
  }

  const jwk = sessionStorage.getItem('cryptoKey');
  if (jwk) {
    try {
      cryptoKey = await window.crypto.subtle.importKey(
        'jwk',
        JSON.parse(jwk),
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      );
      return cryptoKey;
    } catch (e) {
      console.error('Failed to import key, generating new one.', e);
      sessionStorage.removeItem('cryptoKey');
    }
  }

  const newKey = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const exportedKey = await window.crypto.subtle.exportKey('jwk', newKey);
  sessionStorage.setItem('cryptoKey', JSON.stringify(exportedKey));
  cryptoKey = newKey;
  return cryptoKey;
};

// Helper to encrypt data using AES-GCM
const encrypt = async (data: string): Promise<string> => {
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  const buffer = new Uint8Array(iv.length + encryptedContent.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encryptedContent), iv.length);
  
  return btoa(String.fromCharCode.apply(null, Array.from(buffer)));
};

// Helper to decrypt data
const decrypt = async (encryptedData: string): Promise<string> => {
  try {
    const key = await getKey();
    const buffer = new Uint8Array(Array.from(atob(encryptedData)).map(char => char.charCodeAt(0)));
    
    const iv = buffer.slice(0, 12);
    const data = buffer.slice(12);

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    console.error('Decryption failed. Data might be corrupt or from a different session.', error);
    return '';
  }
};

// Security utilities for handling sensitive data
export const secureStorage = {
  setItem: async (key: string, value: string) => {
    try {
      const encrypted = await encrypt(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure item', error);
    }
  },
  
  getItem: async (key: string): Promise<string | null> => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return await decrypt(encrypted);
    } catch (error) {
      console.error('Failed to retrieve secure item', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
    sessionStorage.removeItem('cryptoKey');
    cryptoKey = null;
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
    // Remove HTML tags and potentially harmful characters.
    return input.replace(/<[^>]*>?/gm, '').replace(/[&<>"'/`=]/g, '');
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

// API key management
export const getSecureApiKey = (keyName: string): string | null => {
  // In production, these should come from environment variables
  const keys = {
    github: import.meta.env.VITE_GITHUB_API_TOKEN || '',
    etherscan: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
    web3bio: import.meta.env.VITE_WEB3_BIO_API_KEY || '',
    webacy: import.meta.env.VITE_WEBACY_API_KEY || ''
  };
  
  return keys[keyName as keyof typeof keys] || null;
};
