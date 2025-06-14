
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Types to align with frontend
interface OpenSeaNft {
  id: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  description?: string;
  currentPrice?: string;
  bestOffer?: string;
  owner?: string;
  chain?: string;
  type: 'ethereum' | 'ens' | 'poap' | '3dns';
}

interface OpenSeaCollection {
  name: string;
  nfts: OpenSeaNft[];
  type: 'ethereum' | 'ens' | 'poap' | '3dns';
}

const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'base', name: 'Base' },
  { id: 'optimism', name: 'Optimism' },
  { id: 'polygon', name: 'Polygon' }
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openseaApiKey = Deno.env.get("OPENSEA_API_KEY");
    if (!openseaApiKey) {
      console.error('OPENSEA_API_KEY is not set in Supabase secrets.');
      return new Response(JSON.stringify({ error: 'Server configuration error: OpenSea API key not found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return new Response(JSON.stringify({ error: 'walletAddress is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const collections: { [key: string]: { nfts: OpenSeaNft[], type: 'ethereum' | 'ens' | 'poap' | '3dns' } } = {};
    
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const fetchPromises = SUPPORTED_CHAINS.map(async (chain) => {
      try {
        const response = await fetch(`https://api.opensea.io/api/v2/chain/${chain.id}/account/${walletAddress}/nfts`, {
          headers: { 'X-API-KEY': openseaApiKey, 'Accept': 'application/json' },
          signal
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch NFTs from ${chain.name} chain:`, response.status, await response.text());
          return [];
        }

        const data = await response.json();
        return (data.nfts || []).map((nft: any) => ({ ...nft, chain: chain.id }));
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log(`Request for ${chain.name} NFTs aborted`);
        } else {
          console.error(`Error fetching ${chain.name} NFTs:`, err);
        }
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    clearTimeout(timeoutId);
    
    const allNfts = results
      .filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled')
      .map(result => result.value)
      .flat();
    
    allNfts.forEach((nft: any) => {
      const collectionName = nft.collection || 'Uncategorized';
      
      if (collectionName.toLowerCase().includes('poap v2')) {
        return;
      }
      
      let type: 'ethereum' | 'ens' | 'poap' | '3dns' = 'ethereum';
      if (collectionName.toLowerCase().includes('ens')) type = 'ens';
      else if (collectionName.toLowerCase().includes('poap')) type = 'poap';
      else if (collectionName.toLowerCase().includes('3dns')) type = '3dns';
      
      if (!collections[collectionName]) {
        collections[collectionName] = { nfts: [], type };
      }
      
      collections[collectionName].nfts.push({
        id: nft.identifier,
        name: nft.name || `#${nft.identifier}`,
        imageUrl: nft.image_url,
        collectionName,
        description: nft.description,
        currentPrice: nft.last_sale?.price,
        bestOffer: nft.offers?.[0]?.price,
        owner: nft.owner,
        chain: nft.chain,
        type: type, // Pass the type to each NFT
      });
    });

    const result: OpenSeaCollection[] = Object.entries(collections).map(([name, data]) => ({
      name,
      nfts: data.nfts,
      type: data.type
    }));
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in proxy-opensea function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
