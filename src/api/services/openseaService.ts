
export interface OpenSeaNft {
  id: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  description?: string;
  currentPrice?: string;
  bestOffer?: string;
}

interface OpenSeaCollection {
  name: string;
  nfts: OpenSeaNft[];
  type: 'ethereum' | 'ens' | 'poap';
}

const OPENSEA_API_KEY = "33e769a3cf954b15a0d7eddf2b60028e";

// Chains supported by OpenSea API
const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'base', name: 'Base' },
  { id: 'optimism', name: 'Optimism' },
  { id: 'polygon', name: 'Polygon' }
];

export async function fetchUserNfts(walletAddress: string): Promise<OpenSeaCollection[]> {
  const collections: { [key: string]: { nfts: OpenSeaNft[], type: 'ethereum' | 'ens' | 'poap' } } = {};
  
  // Fetch NFTs from multiple chains
  try {
    const fetchPromises = SUPPORTED_CHAINS.map(async (chain) => {
      const response = await fetch(`https://api.opensea.io/api/v2/chain/${chain.id}/account/${walletAddress}/nfts`, {
        headers: {
          'X-API-KEY': OPENSEA_API_KEY,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch NFTs from ${chain.name} chain:`, response.status);
        return [];
      }

      const data = await response.json();
      return data.nfts || [];
    });

    // Wait for all requests to complete
    const results = await Promise.all(fetchPromises);
    const allNfts = results.flat();
    
    // Group NFTs by collection
    allNfts.forEach((nft: any) => {
      const collectionName = nft.collection || 'Uncategorized';
      
      // Determine the type of NFT
      let type: 'ethereum' | 'ens' | 'poap' = 'ethereum';
      if (collectionName.toLowerCase().includes('ens')) {
        type = 'ens';
      } else if (collectionName.toLowerCase().includes('poap')) {
        type = 'poap';
      }
      
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
        bestOffer: nft.offers?.[0]?.price
      });
    });

    return Object.entries(collections).map(([name, data]) => ({
      name,
      nfts: data.nfts,
      type: data.type
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}
