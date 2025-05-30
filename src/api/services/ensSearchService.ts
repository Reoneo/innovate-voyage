
import { web3Api } from '../web3Api';

export interface EnsUser {
  address: string;
  ensName: string;
  avatar: string | null;
  location: string | null;
  displayName: string;
  bio?: string;
}

export interface EnsSearchResult {
  users: EnsUser[];
  total: number;
  hasMore: boolean;
}

/**
 * Search for ENS users by country/location
 */
export async function searchEnsByCountry(
  country: string,
  page: number = 1,
  limit: number = 10
): Promise<EnsSearchResult> {
  try {
    console.log(`Searching ENS users in ${country}, page ${page}`);
    
    // For now, we'll use a mock implementation since direct ENS location search
    // isn't available. In a real implementation, this would call Web3.bio API
    // or other services that index ENS records with location data
    
    const mockUsers: EnsUser[] = await generateMockUsers(country, page, limit);
    
    return {
      users: mockUsers,
      total: 100, // Mock total
      hasMore: page * limit < 100
    };
  } catch (error) {
    console.error('Error searching ENS users by country:', error);
    return {
      users: [],
      total: 0,
      hasMore: false
    };
  }
}

/**
 * Generate mock users for demonstration
 * In production, this would be replaced with actual API calls
 */
async function generateMockUsers(country: string, page: number, limit: number): Promise<EnsUser[]> {
  const mockNames = [
    'alice', 'bob', 'charlie', 'diana', 'eve', 'frank', 'grace', 'henry', 'iris', 'jack',
    'kate', 'liam', 'maya', 'noah', 'olivia', 'peter', 'quinn', 'ruby', 'sam', 'tina'
  ];
  
  const users: EnsUser[] = [];
  const startIndex = (page - 1) * limit;
  
  for (let i = 0; i < limit && i + startIndex < mockNames.length; i++) {
    const name = mockNames[i + startIndex];
    const ensName = `${name}.eth`;
    const address = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    users.push({
      address,
      ensName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      location: country,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      bio: `Web3 enthusiast from ${country}`
    });
  }
  
  return users;
}

/**
 * Get popular countries with ENS users
 */
export function getPopularCountries(): string[] {
  return [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Canada',
    'Australia',
    'Japan',
    'Singapore',
    'Netherlands',
    'Switzerland'
  ];
}
