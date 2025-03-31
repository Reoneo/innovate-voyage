
import { POAP, POAPResponse } from '../types/poapTypes';
import { delay } from '../jobsApi';
import { getSecret } from '@/utils/secrets';

// Mock POAPs data as fallback if the API fails or for development purposes
const mockPoaps: POAP[] = [
  {
    event: {
      id: 1,
      fancy_id: "mock-eth-denver-2023",
      name: "Mock ETHDenver 2023 Attendee",
      description: "This POAP was awarded to attendees of ETHDenver 2023, the world's largest web3 #BUIDLathon.",
      start_date: "2023-02-24",
      end_date: "2023-03-05",
      expiry_date: "2023-03-12",
      city: "Denver",
      country: "USA",
      event_url: "https://www.ethdenver.com",
      image_url: "https://assets.poap.xyz/ethdenver-2023-attendee-2023-logo-1677284258503.png",
      year: 2023
    },
    tokenId: "123456",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    chain: "xdai",
    created: "2023-03-01T12:00:00Z"
  },
  {
    event: {
      id: 2,
      fancy_id: "devcon-6-bogota",
      name: "Devcon 6 Bogotá",
      description: "Official attendee of Devcon 6 in Bogotá, Colombia.",
      start_date: "2022-10-11",
      end_date: "2022-10-14",
      expiry_date: "2022-10-21",
      city: "Bogotá",
      country: "Colombia",
      event_url: "https://devcon.org",
      image_url: "https://assets.poap.xyz/devcon-6-bogota-2022-logo-1665430036926.png",
      year: 2022
    },
    tokenId: "789012",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    chain: "xdai",
    created: "2022-10-12T14:30:00Z"
  },
  {
    event: {
      id: 3,
      fancy_id: "ethcc-paris-2023",
      name: "ETHCC[6] Paris",
      description: "Attended ETHCC 6 in Paris, July 2023.",
      start_date: "2023-07-17",
      end_date: "2023-07-20",
      expiry_date: "2023-07-27",
      city: "Paris",
      country: "France",
      event_url: "https://ethcc.io",
      image_url: "https://assets.poap.xyz/ethcc6-paris-2023-logo-1689589893046.png",
      year: 2023
    },
    tokenId: "345678",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    chain: "xdai",
    created: "2023-07-18T09:45:00Z"
  }
];

// Auth0 token cache to avoid requesting a new token for every API call
let authTokenCache: {
  token: string;
  expiresAt: number;
} | null = null;

/**
 * Get an Auth0 token for POAP API access
 */
async function getPOAPAuthToken(): Promise<string> {
  try {
    // Check if we have a valid cached token
    if (authTokenCache && authTokenCache.expiresAt > Date.now()) {
      return authTokenCache.token;
    }

    const clientId = getSecret('POAP_CLIENT_ID');
    const clientSecret = getSecret('POAP_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('POAP API credentials not configured');
    }

    console.log('Requesting new POAP Auth token with client ID:', clientId.substring(0, 5) + '...');
    
    const response = await fetch('https://auth.accounts.poap.xyz/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audience: 'https://api.poap.tech',
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      console.error('Auth token request failed with status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Auth token request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully obtained POAP auth token');
    
    // Cache the token with expiration
    authTokenCache = {
      token: data.access_token,
      // Set expiry slightly before the actual expiry to ensure we don't use an expired token
      expiresAt: Date.now() + (data.expires_in * 1000) - 60000,
    };
    
    return data.access_token;
  } catch (error) {
    console.error('Error obtaining POAP auth token:', error);
    throw error;
  }
}

/**
 * Get POAPs by Ethereum address from the POAP API
 */
export async function getPoapsByAddress(address: string): Promise<POAP[]> {
  try {
    console.log('Fetching POAPs for address:', address);
    
    // Try to get an auth token
    const token = await getPOAPAuthToken();
    
    // Make request to POAP API
    console.log('Making request to POAP API...');
    const response = await fetch(`https://api.poap.tech/actions/scan/${address}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('POAP API request failed with status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`POAP API request failed: ${response.status}`);
    }

    const data: POAPResponse = await response.json();
    console.log('POAP API returned data:', data);
    
    if (data.tokens && data.tokens.length > 0) {
      console.log(`Retrieved ${data.tokens.length} POAPs for address ${address}`);
      return data.tokens;
    } else {
      console.log('No POAPs found for this address, falling back to alternatives');
      throw new Error('No POAPs found');
    }
  } catch (error) {
    console.error(`Error fetching POAPs for address ${address}:`, error);
    
    // Fall back to mock data in development or if there's an API error
    if (process.env.NODE_ENV !== 'production') {
      await delay(600); // Simulate network delay
      console.log('Using mock POAP data as fallback');
      
      // Return mock data with the correct owner address
      return mockPoaps.map(poap => ({
        ...poap,
        owner: address
      }));
    }
    
    // In production, we might want to return an empty array instead of mocks
    return [];
  }
}
