
import { supabase } from '@/integrations/supabase/client';

export interface Nft {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
}

/**
 * Fetch NFTs for a wallet address from OpenSea
 * @param address Ethereum address
 * @param chain Chain to search on (defaults to 'ethereum')
 * @returns A promise that resolves to an array of NFTs
 */
export async function fetchNftsByAddress(address: string, chain: string = 'ethereum'): Promise<Nft[]> {
  try {
    const path = `/chain/${chain}/account/${address}/nfts`;
    
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-opensea', {
      body: { path },
    });

    if (invokeError) {
      console.error('Error invoking opensea-proxy for NFTs:', invokeError.message);
      return [];
    }
    
    return data.nfts || [];
  } catch (error) {
    console.error(`Error fetching NFTs from OpenSea for ${address}:`, error);
    return [];
  }
}

/**
 * Fetch details for a single NFT from OpenSea
 * @param address NFT contract address
 * @param identifier NFT token ID
 * @param chain Chain to search on
 * @returns A promise that resolves to the NFT details
 */
export async function fetchNftDetails(address: string, identifier: string, chain: string): Promise<any> {
  try {
    const path = `/chain/${chain}/contract/${address}/nfts/${identifier}`;
    
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-opensea', {
      body: { path },
    });

    if (invokeError) {
      console.error('Error invoking opensea-proxy for NFT details:', invokeError.message);
      return null;
    }
    
    return data.nft;
  } catch (error) {
    console.error(`Error fetching NFT details for ${identifier}:`, error);
    return null;
  }
}
