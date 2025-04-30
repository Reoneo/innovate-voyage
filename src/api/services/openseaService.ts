
export interface OpenSeaNft {
  id: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  description?: string;
  currentPrice?: string;
  bestOffer?: string;
  owner?: string;
  chain?: string; // Add chain property to indicate which network the NFT is on
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
      return (data.nfts || []).map((nft: any) => ({
        ...nft,
        chain: chain.id // Add chain information to each NFT
      }));
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
        bestOffer: nft.offers?.[0]?.price,
        owner: nft.owner,
        chain: nft.chain // Pass the chain information
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

// Function to fetch avatar for .box domain from OpenSea
export async function fetchDotBoxAvatar(domainName: string): Promise<string | null> {
  try {
    // Check if it's a .box domain
    if (!domainName.endsWith('.box')) return null;

    // Try to find address associated with .box domain
    const response = await fetch(`https://api.dot.bit/v1/account/info?account=${domainName}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data?.data?.address) return null;
    
    // Get account's NFTs to find avatar
    const address = data.data.address;
    const collections = await fetchUserNfts(address);
    
    // Look for profile NFT or ENS NFT that might be used as avatar
    for (const collection of collections) {
      // If we find an NFT with name matching the domain, that's likely the avatar
      const matchingNft = collection.nfts.find(nft => {
        const nftNameLower = nft.name.toLowerCase();
        const domainNameLower = domainName.toLowerCase();
        const domainWithoutSuffix = domainName.replace('.box', '').toLowerCase();
        
        return nftNameLower === domainNameLower || 
               nftNameLower === domainWithoutSuffix ||
               nftNameLower.includes(domainWithoutSuffix);
      });
      
      if (matchingNft?.imageUrl) {
        return matchingNft.imageUrl;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching .box avatar from OpenSea:', error);
    return null;
  }
}
