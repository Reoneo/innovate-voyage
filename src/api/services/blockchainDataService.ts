import { delay } from '../jobsApi';

interface BlockchainData {
  mirrorPosts: number;
  lensActivity: number;
  boxDomains: string[];
  snsActive: boolean;
  description?: string;
}

// Mock data for demonstration - this would be replaced with actual API calls
const mockBlockchainData: Record<string, BlockchainData> = {
  // Vitalik's address
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F": {
    mirrorPosts: 3,
    lensActivity: 12,
    boxDomains: ["vitalik.box", "ethereum.box", "web3.box"],
    snsActive: true,
    description: "Ethereum co-founder and blockchain researcher"
  },
  // Default data for any other address
  "default": {
    mirrorPosts: 0,
    lensActivity: 0,
    boxDomains: [],
    snsActive: false,
    description: undefined
  }
};

/**
 * Fetch blockchain data from various sources including:
 * - Mirror.xyz posts
 * - Lens Protocol activity
 * - .box domains
 * - SNS.id status
 * 
 * @param address Ethereum address to fetch data for
 * @returns Promise with aggregated blockchain data
 */
export async function fetchBlockchainData(address: string): Promise<BlockchainData> {
  // Simulate API delay
  await delay(800);
  
  try {
    // In a real implementation, we would make API calls to:
    // - Mirror.xyz API for post count
    // - Lens Protocol GraphQL API for activity
    // - .box API for domain ownership
    // - SNS.id API for status
    
    // For demonstration, we're using mock data
    const lowerCaseAddress = address.toLowerCase();
    
    // Check if we have specific mock data for this address
    if (mockBlockchainData[address]) {
      return mockBlockchainData[address];
    }
    
    // Return default mock data
    return mockBlockchainData.default;
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    return mockBlockchainData.default;
  }
}

/**
 * Fetch .box domains for a specific address
 * This would be replaced with a real API call in production
 */
export async function fetchBoxDomains(address: string): Promise<string[]> {
  await delay(300);
  
  try {
    if (address.toLowerCase() === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F".toLowerCase()) {
      return ["vitalik.box", "ethereum.box", "web3.box"];
    }
    return [];
  } catch (error) {
    console.error('Error fetching .box domains:', error);
    return [];
  }
}

/**
 * Check if an address has an SNS.id
 * This would be replaced with a real API call in production
 */
export async function checkSnsId(address: string): Promise<boolean> {
  await delay(200);
  
  try {
    // Mock implementation
    return address.toLowerCase() === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F".toLowerCase();
  } catch (error) {
    console.error('Error checking SNS.id:', error);
    return false;
  }
}

/**
 * Fetch Mirror.xyz posts for an address
 * This would be replaced with a real API call in production
 */
export async function fetchMirrorPosts(address: string): Promise<number> {
  await delay(400);
  
  try {
    if (address.toLowerCase() === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F".toLowerCase()) {
      return 3;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching Mirror posts:', error);
    return 0;
  }
}

/**
 * Fetch Lens Protocol activity for an address
 * This would be replaced with a real API call in production
 */
export async function fetchLensActivity(address: string): Promise<number> {
  await delay(450);
  
  try {
    if (address.toLowerCase() === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F".toLowerCase()) {
      return 12;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching Lens activity:', error);
    return 0;
  }
}
