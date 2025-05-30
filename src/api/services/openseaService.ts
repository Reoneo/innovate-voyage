
export interface OpenSeaNft {
  id: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  description?: string;
  currentPrice?: string;
  bestOffer?: string;
  owner?: string;
  chain?: string;
  count?: number; // Added count property
}

interface OpenSeaCollection {
  name: string;
  nfts: OpenSeaNft[];
  type: 'ethereum' | 'ens' | 'poap' | '3dns';
}

const OPENSEA_API_KEY = "33e769a3cf954b15a0d7eddf2b60028e";

// Chains supported by OpenSea API
const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'base', name: 'Base' },
  { id: 'optimism', name: 'Optimism' },
  { id: 'polygon', name: 'Polygon' }
];

// Create cache to avoid redundant API calls
const nftCache = new Map<string, OpenSeaCollection[]>();

export async function fetchUserNfts(walletAddress: string): Promise<OpenSeaCollection[]> {
  // Check if we have cached data for this address
  const cacheKey = walletAddress.toLowerCase();
  if (nftCache.has(cacheKey)) {
    return nftCache.get(cacheKey) || [];
  }
  
  const collections: { [key: string]: { nfts: OpenSeaNft[], type: 'ethereum' | 'ens' | 'poap' | '3dns' } } = {};
  
  // Fetch NFTs from multiple chains
  try {
    // Use AbortController to cancel stale requests
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Set a timeout to abort the request if it takes too long
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    // Fetch in parallel to improve performance
    const fetchPromises = SUPPORTED_CHAINS.map(async (chain) => {
      try {
        const response = await fetch(`https://api.opensea.io/api/v2/chain/${chain.id}/account/${walletAddress}/nfts`, {
          headers: {
            'X-API-KEY': OPENSEA_API_KEY,
            'Accept': 'application/json'
          },
          signal
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
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log(`Request for ${chain.name} NFTs aborted`);
        } else {
          console.error(`Error fetching ${chain.name} NFTs:`, err);
        }
        return [];
      }
    });

    // Wait for all requests to complete or timeout
    const results = await Promise.allSettled(fetchPromises);
    clearTimeout(timeoutId);
    
    const allNfts = results
      .filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled')
      .map(result => result.value)
      .flat();
    
    // Group NFTs by collection and filter out poapv2 as requested
    allNfts.forEach((nft: any) => {
      const collectionName = nft.collection || 'Uncategorized';
      
      // Skip poapv2 collections as requested
      if (collectionName.toLowerCase().includes('poap v2')) {
        return;
      }
      
      // Determine the type of NFT
      let type: 'ethereum' | 'ens' | 'poap' | '3dns' = 'ethereum';
      if (collectionName.toLowerCase().includes('ens')) {
        type = 'ens';
      } else if (collectionName.toLowerCase().includes('poap')) {
        type = 'poap';
      } else if (collectionName.toLowerCase().includes('3dns')) {
        type = '3dns';
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

    const result = Object.entries(collections).map(([name, data]) => ({
      name,
      nfts: data.nfts,
      type: data.type
    }));
    
    // Cache the results to avoid redundant API calls
    nftCache.set(cacheKey, result);
    
    return result;
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
