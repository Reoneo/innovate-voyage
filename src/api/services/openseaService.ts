
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
}

const OPENSEA_API_KEY = "33e769a3cf954b15a0d7eddf2b60028e";

export async function fetchUserNfts(walletAddress: string): Promise<OpenSeaCollection[]> {
  try {
    const response = await fetch(`https://api.opensea.io/api/v2/chain/ethereum/account/${walletAddress}/nfts`, {
      headers: {
        'X-API-KEY': OPENSEA_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch NFTs');
    }

    const data = await response.json();
    const nftsByCollection: { [key: string]: OpenSeaNft[] } = {};

    // Group NFTs by collection
    data.nfts?.forEach((nft: any) => {
      const collectionName = nft.collection || 'Uncategorized';
      if (!nftsByCollection[collectionName]) {
        nftsByCollection[collectionName] = [];
      }
      
      nftsByCollection[collectionName].push({
        id: nft.identifier,
        name: nft.name || `#${nft.identifier}`,
        imageUrl: nft.image_url,
        collectionName,
        description: nft.description,
        currentPrice: nft.last_sale?.price,
        bestOffer: nft.offers?.[0]?.price
      });
    });

    return Object.entries(nftsByCollection).map(([name, nfts]) => ({
      name,
      nfts
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}
