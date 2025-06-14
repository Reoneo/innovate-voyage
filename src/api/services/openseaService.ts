
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
    console.log('Calling Supabase proxy with path:', path);
    
    const { data, error: invokeError } = await supabase.functions.invoke('proxy-opensea', {
      body: { path },
    });

    if (invokeError) {
      console.error('Error invoking opensea-proxy for NFTs:', invokeError);
      return [];
    }

    console.log('Raw response from OpenSea proxy:', data);

    // Handle different response formats from OpenSea API
    let collections: { collection: string; nfts: OpenSeaNft[] }[] = [];

    // Check if data has the expected structure
    if (data && typeof data === 'object') {
      // OpenSea API v2 format: data should have nfts array grouped by collection
      if (Array.isArray(data.nfts)) {
        console.log('Processing NFTs array format');
        
        // Group NFTs by collection
        const nftsByCollection = data.nfts.reduce((acc: Record<string, OpenSeaNft[]>, nft: any) => {
          const collectionName = nft.collection || 'Unknown Collection';
          if (!acc[collectionName]) {
            acc[collectionName] = [];
          }
          
          acc[collectionName].push({
            identifier: nft.identifier || '',
            collection: collectionName,
            contract: nft.contract || '',
            token_standard: nft.token_standard || '',
            name: nft.name || `Token #${nft.identifier}`,
            description: nft.description || '',
            image_url: nft.image_url || nft.display_image_url,
            imageUrl: nft.image_url || nft.display_image_url, // Compatibility
            metadata_url: nft.metadata_url || '',
            opensea_url: nft.opensea_url || '',
            updated_at: nft.updated_at || '',
            is_disabled: nft.is_disabled || false,
            is_nsfw: nft.is_nsfw || false,
            count: 1,
          });
          
          return acc;
        }, {});

        collections = Object.entries(nftsByCollection).map(([collectionName, nfts]) => ({
          collection: collectionName,
          nfts: nfts
        }));
      }
      // Alternative format: collections array with nfts
      else if (Array.isArray(data.collections)) {
        console.log('Processing collections array format');
        
        collections = data.collections
          .filter((col: any) => col.nfts && Array.isArray(col.nfts) && col.nfts.length > 0)
          .map((col: any) => ({
            collection: col.name || col.slug || col.collection || 'Unknown Collection',
            nfts: col.nfts.map((nft: any) => ({
              identifier: nft.identifier || '',
              collection: col.name || col.slug || col.collection,
              contract: nft.contract || '',
              token_standard: nft.token_standard || '',
              name: nft.name || `Token #${nft.identifier}`,
              description: nft.description || '',
              image_url: nft.image_url || nft.display_image_url,
              imageUrl: nft.image_url || nft.display_image_url,
              metadata_url: nft.metadata_url || '',
              opensea_url: nft.opensea_url || '',
              updated_at: nft.updated_at || '',
              is_disabled: nft.is_disabled || false,
              is_nsfw: nft.is_nsfw || false,
              count: nft.count || 1,
            }))
          }));
      }
      // Direct collections format
      else if (data.collection && data.nfts) {
        console.log('Processing single collection format');
        collections = [{
          collection: data.collection,
          nfts: Array.isArray(data.nfts) ? data.nfts : []
        }];
      }
    }

    console.log(`Processed ${collections.length} collections:`, collections);
    
    // Filter out empty collections and problematic ones
    const validCollections = collections.filter(collection => {
      const hasNfts = collection.nfts && collection.nfts.length > 0;
      const isNotTest = !collection.collection.toLowerCase().includes('test');
      console.log(`Collection "${collection.collection}": hasNfts=${hasNfts}, isNotTest=${isNotTest}`);
      return hasNfts && isNotTest;
    });

    console.log(`Returning ${validCollections.length} valid collections`);
    return validCollections;

  } catch (error) {
    console.error(`Error fetching NFTs from OpenSea for ${address}:`, error);
    return [];
  }
}

// Compatibility fetchNftsByAddress
export async function fetchNftsByAddress(address: string, chain: string = 'ethereum'): Promise<Nft[]> {
  try {
    const collections = await fetchUserNfts(address, chain);
    return collections.flatMap(collection => collection.nfts);
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
