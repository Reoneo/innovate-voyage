import { enforceRateLimit } from '../utils/web3/rateLimiter';
import { supabase } from '@/integrations/supabase/client';

// POAP API configuration
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
    
    const path = `/actions/scan/${address}`;
    console.log(`Fetching POAPs from: ${POAP_API_BASE_URL}${path}`);
    
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-poap', {
      body: { path }
    });

    if (invokeError) {
      console.error(`POAP proxy error: ${invokeError.message}`);
      return [];
    }

    const data = invokeError ? [] : data;
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
    
    const path = `/events/id/${eventId}`;
    
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-poap', {
      body: { path }
    });

    if (invokeError) {
      console.error(`POAP event proxy error: ${invokeError.message}`);
      return null;
    }
    
    return data;
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
    
    const path = `/event/${eventId}/poaps`;
    console.log(`Fetching POAP owners from: ${POAP_API_BASE_URL}${path}`);
    
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-poap', {
      body: { path }
    });
    
    console.log(`POAP owners API response received`);
    
    if (invokeError) {
      console.error(`POAP owners proxy error: ${invokeError.message}`);
      return [];
    }
    
    console.log(`POAP owners API raw response:`, data);
    console.log(`Fetched ${Array.isArray(data) ? data.length : 'unknown'} owners for event ID ${eventId}`);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching POAP event owners for event ${eventId}:`, error);
    return [];
  }
}
