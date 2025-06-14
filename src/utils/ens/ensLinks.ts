
import { ethers } from 'ethers';
import { mainnetProvider } from '../ethereumProviders';
import { SOCIAL_PLATFORMS_ARRAY } from '../../constants/socialPlatforms'; // Assuming this exports an array of {key: string, name: string, ...}

// Define the structure for ENS data returned by getEnsLinks
export interface EnsData {
  socials: Record<string, string>;
  ensLinks: string[]; // This was for general links, might be deprecated or re-purposed
  description?: string;
  keywords?: string[];
  textRecords?: Record<string, string>; // New field for additional text records
}

// Predefined social keys to fetch for the 'socials' object
// These are typically displayed with icons etc.
const socialKeys = [
  'com.twitter', 'com.discord', 'com.github', 'com.linkedin', 
  'org.telegram', 'email', 'url', 'xyz.farcaster' 
  // Add other common social keys if needed
];

// Additional generic text record keys to fetch
const additionalTextRecordKeys = ['bio.ens', 'location', 'notice'];

export async function getEnsLinks(ensName: string, network = 'mainnet'): Promise<EnsData> {
  const ensData: EnsData = {
    socials: {},
    ensLinks: [],
    keywords: [],
    textRecords: {},
  };

  if (!ensName) return ensData;

  try {
    const provider = mainnetProvider; // Assuming mainnet, adjust if network param is used more broadly
    const resolver = await provider.getResolver(ensName);

    if (!resolver) {
      console.warn(`No resolver found for ${ensName}`);
      return ensData;
    }

    // Fetch description
    const description = await resolver.getText('description');
    if (description) {
      ensData.description = description;
    }

    // Fetch keywords
    const keywordsStr = await resolver.getText('keywords');
    if (keywordsStr) {
      ensData.keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k !== '');
    }

    // Fetch predefined social links
    for (const key of socialKeys) {
      const record = await resolver.getText(key);
      if (record) {
        ensData.socials[key] = record;
      }
    }
    
    // Fetch additional text records
    const fetchedTextRecords: Record<string, string> = {};
    for (const key of additionalTextRecordKeys) {
      const record = await resolver.getText(key);
      if (record) {
        fetchedTextRecords[key] = record;
      }
    }
    ensData.textRecords = fetchedTextRecords;

    // For ensLinks array (if still used):
    // Could populate with general URLs or other relevant links not fitting elsewhere
    // For example, if 'url' text record exists and isn't primary social 'url':
    // const generalUrl = await resolver.getText('url');
    // if (generalUrl && ensData.socials['url'] !== generalUrl) {
    //   ensData.ensLinks.push(generalUrl);
    // }

    // Log fetched ENS links data for debugging
    console.log(`ENS links data for ${ensName}:`, ensData);

  } catch (error) {
    console.error(`Error fetching ENS links for ${ensName}:`, error);
  }

  return ensData;
}

