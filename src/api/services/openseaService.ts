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
    console.log(`Fetching NFTs for address: ${address} on chain: ${chain}`);
    
    const path = `/chain/${chain}/account/${address}/nfts`;
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-opensea', {
      body: { path },
    });

    if (invokeError) {
      console.error('Error invoking opensea-proxy for NFTs:', invokeError);
      return [];
    }

    console.log('OpenSea API response:', data);

    // Handle different response formats from OpenSea API v2
    if (data?.nfts && Array.isArray(data.nfts)) {
      // Group NFTs by collection
      const collectionMap = new Map<string, OpenSeaNft[]>();
      
      data.nfts.forEach((nft: any) => {
        const collectionName = nft.collection || nft.contract || 'Unknown Collection';
        const mappedNft: OpenSeaNft = {
          identifier: nft.identifier || nft.token_id,
          collection: collectionName,
          contract: nft.contract,
          token_standard: nft.token_standard,
          name: nft.name || `#${nft.identifier}`,
          description: nft.description || '',
          image_url: nft.image_url,
          imageUrl: nft.image_url, // Compatibility
          metadata_url: nft.metadata_url,
          opensea_url: nft.opensea_url,
          updated_at: nft.updated_at,
          is_disabled: nft.is_disabled || false,
          is_nsfw: nft.is_nsfw || false,
          count: nft.count || 1,
        };

        if (!collectionMap.has(collectionName)) {
          collectionMap.set(collectionName, []);
        }
        collectionMap.get(collectionName)!.push(mappedNft);
      });

      return Array.from(collectionMap.entries()).map(([collection, nfts]) => ({
        collection,
        nfts
      }));
    }

    // Legacy format support - if collections array exists
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
          imageUrl: n.image_url,
          metadata_url: n.metadata_url,
          opensea_url: n.opensea_url,
          updated_at: n.updated_at,
          is_disabled: n.is_disabled,
          is_nsfw: n.is_nsfw,
          count: n.count,
        })),
      }));
    }

    console.log('No NFTs found or unexpected response format');
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
