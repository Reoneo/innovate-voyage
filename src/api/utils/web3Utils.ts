
import { delay } from '../jobsApi';

// Cache for storing already fetched avatars to reduce API calls
export const avatarCache: Record<string, string> = {
  // Pre-populate with some fallbacks
  'vitalik.eth': 'https://storage.googleapis.com/ethereum-hackmd/upload_7a91319e830e3961cc56e1bfeb4926b5.png',
};

// Function to fetch profile from Web3.bio API
export async function fetchWeb3BioProfile(identity: string) {
  try {
    const response = await fetch(`https://api.web3.bio/profile/${identity}`);
    if (!response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${identity}`);
      return null;
    }
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // Return the first profile in the array
      return data[0];
    } else if (data.error) {
      console.warn(`Web3.bio error for ${identity}:`, data.error);
      return null;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Web3.bio profile for ${identity}:`, error);
    return null;
  }
}

// Generate a fallback avatar URL
export function generateFallbackAvatar() {
  const fallbackIdx = Math.floor(Math.random() * 30) + 1;
  return `https://i.pravatar.cc/300?img=${fallbackIdx}`;
}
