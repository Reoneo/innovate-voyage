
import { Web3BioProvider } from '../services/domains/providers/web3BioProvider';
import { EtherscanProvider } from '../services/domains/providers/etherscanProvider';
import { Profile } from '@/types/profile';
import { validateInput } from '@/utils/secureStorage';
import { enforceRateLimit, getSafeHeaders } from './rateLimiter';
import { getServerConfig } from './secureConfig';

const serverConfig = getServerConfig();

// Initialize providers with API keys from secure config
const web3BioProvider = new Web3BioProvider(serverConfig.WEB3_BIO_API_KEY);
const etherscanProvider = new EtherscanProvider();

/**
 * Fetches profile information from multiple sources based on the input string.
 * @param input - An Ethereum address, ENS name, or other identifier.
 * @returns A promise that resolves to a Profile object or null if no profile is found.
 */
export async function fetchProfile(input: string): Promise<Profile | null> {
  if (!input) {
    console.warn('No input provided to fetchProfile');
    return null;
  }

  // Validate input format
  if (!validateInput.ensName(input) && !validateInput.ethereumAddress(input)) {
    console.warn('Invalid input format for profile fetch');
    return null;
  }

  try {
    // 1. Try fetching from Web3.bio
    if (serverConfig.WEB3_BIO_API_KEY) {
      const web3BioProfile = await web3BioProvider.fetchProfile(input);
      if (web3BioProfile) {
        console.log('Profile found in Web3.bio');
        return web3BioProfile;
      }
    } else {
      console.warn('Web3.bio API key not set, skipping Web3.bio profile fetch');
    }

    // 2. Try fetching from Etherscan
    const etherscanProfile = await etherscanProvider.fetchProfile(input);
    if (etherscanProfile) {
      console.log('Profile found in Etherscan');
      return etherscanProfile;
    }

    console.log('No profile found in any source');
    return null;

  } catch (error: any) {
    console.error('Error fetching profile:', error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
}
