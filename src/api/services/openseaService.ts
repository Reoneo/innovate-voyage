
import { supabase } from '@/integrations/supabase/client';

// Nft type from OpenSea API v2
export interface OpenSeaNft {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  count?: number;
}

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

export async function fetchUserNfts(address: string, chain: string = 'ethereum'): Promise<{ collection: string; nfts: OpenSeaNft[] }[]> {
  try {
    const path = `/chain/${chain}/account/${address}/nfts`;
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-opensea', {
      body: { path },
    });

    if (invokeError) {
      console.error('Error invoking opensea-proxy for NFTs:', invokeError.message);
      return [];
    }

    // Adapt v2 API: data.collections[] contains nfts array
    if (Array.isArray(data?.collections)) {
      return data.collections.map((col: any) => ({
        collection: col.name || col.slug || 'Unknown Collection',
        nfts: (col.nfts || []).map((n: any) => ({
          identifier: n.identifier,
          collection: col.name || col.slug,
          contract: n.contract,
          token_standard: n.token_standard,
          name: n.name,
          description: n.description,
          image_url: n.image_url,
          imageUrl: n.image_url, // Compatibility for places expecting imageUrl
          metadata_url: n.metadata_url,
          opensea_url: n.opensea_url,
          updated_at: n.updated_at,
          is_disabled: n.is_disabled,
          is_nsfw: n.is_nsfw,
          count: n.count,
        })),
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching NFTs from OpenSea for ${address}:`, error);
    return [];
  }
}

// Compatibility fetchNftsByAddress
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

    // API structure compatibility
    if (Array.isArray(data?.nfts)) {
      return data.nfts;
    }
    if (Array.isArray(data?.collections)) {
      // Flatten v2 API nfts per collection to single array
      return data.collections.flatMap((col: any) => (col.nfts || []));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching NFTs from OpenSea for ${address}:`, error);
    return [];
  }
}

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
