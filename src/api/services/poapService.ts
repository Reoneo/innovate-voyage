
import { enforceRateLimit } from '../utils/web3/rateLimiter';

// POAP API configuration
const POAP_API_KEY = "K6o3vqiX0yr5BXqOCKGVGoJbVqJQNXebRNgg2NnFfvCQ8g0vCowmpv4fgD9sXsDR6wrEhCCv7sLEoaN4neqT9whf3KNO43ILdKpfepOIvDm4nL4BTRdbETbD10ibpizW";
const POAP_API_BASE_URL = "https://api.poap.tech";

export interface PoapEvent {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  expiry_date: string;
  supply: number;
}

export interface Poap {
  tokenId: string;
  event: PoapEvent;
  owner: string;
  chain: string;
  created: string;
}

/**
 * Fetch POAPs for a wallet address
 * @param address Ethereum address
 */
export async function fetchPoapsByAddress(address: string): Promise<Poap[]> {
  try {
    // Rate limit requests
    await enforceRateLimit(300);
    
    const url = `${POAP_API_BASE_URL}/actions/scan/${address}`;
    console.log(`Fetching POAPs from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': POAP_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`POAP API error: ${response.status}`);
      const errorText = await response.text();
      console.error(`POAP API error details: ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    console.log(`POAP API returned ${Array.isArray(data) ? data.length : 0} POAPs`);
    
    // Return all POAPs
    const poaps = Array.isArray(data) ? data : [];
    
    // Log the first POAP for debugging
    if (poaps.length > 0) {
      console.log("Sample POAP data:", {
        tokenId: poaps[0].tokenId,
        eventName: poaps[0].event.name,
        imageUrl: poaps[0].event.image_url,
        description: poaps[0].event.description
      });
    }
    
    return poaps;
  } catch (error) {
    console.error('Error fetching POAPs:', error);
    return [];
  }
}

/**
 * Fetch POAP event details by event ID
 * @param eventId POAP event ID
 */
export async function fetchPoapEventById(eventId: number): Promise<PoapEvent | null> {
  try {
    // Rate limit requests
    await enforceRateLimit(300);
    
    const url = `${POAP_API_BASE_URL}/events/id/${eventId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': POAP_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`POAP event API error: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching POAP event:', error);
    return null;
  }
}

/**
 * Fetch owners of a specific POAP event
 * @param eventId POAP event ID
 * @returns Array of owners with their tokenIds
 */
export async function fetchPoapEventOwners(eventId: number): Promise<any[]> {
  try {
    // Rate limit requests
    await enforceRateLimit(300);
    
    const url = `${POAP_API_BASE_URL}/event/${eventId}/poaps`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': POAP_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`POAP owners API error: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.length} owners for event ID ${eventId}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching POAP event owners for event ${eventId}:`, error);
    return [];
  }
}
